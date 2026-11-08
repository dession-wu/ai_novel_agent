"""Private per-user model credentials; never fall back to a server key."""
import hashlib
import os
import sqlite3
from contextvars import ContextVar
from pathlib import Path
from cryptography.fernet import Fernet
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from app.api.deps import get_current_active_user
from app.core.database import SessionLocal
from app.services.auth_service import auth_service

ROOT=Path(os.environ.get('MODEL_DATA_DIR','/app/private'))
ROOT.mkdir(parents=True,exist_ok=True)
path=ROOT/'model-encryption.key'
if not path.exists():
    with path.open('xb') as stream:stream.write(Fernet.generate_key())
    path.chmod(0o600)
BOX=Fernet(path.read_bytes())
with sqlite3.connect(ROOT/'models.sqlite') as conn:
    conn.execute('CREATE TABLE IF NOT EXISTS configs(user_id INTEGER PRIMARY KEY,provider TEXT NOT NULL,key TEXT NOT NULL)')
CURRENT=ContextVar('novel_model_user',default=None)
router=APIRouter()

def config(user_id):
    with sqlite3.connect(ROOT/'models.sqlite') as conn:
        return conn.execute('SELECT provider,key FROM configs WHERE user_id=?',(user_id,)).fetchone()

class ModelConfig(BaseModel):
    provider:str=Field(pattern='^(bailian|deepseek|openai)$')
    key:str=Field(min_length=1,max_length=512)

@router.get('/model-settings')
def get_model(current=Depends(get_current_active_user)):
    value=config(current.id)
    return {'configured':bool(value),'provider':value[0] if value else 'bailian', **LEDGER.status(current.id)}

@router.put('/model-settings')
def save_model(body:ModelConfig,current=Depends(get_current_active_user)):
    if not body.key.strip():raise HTTPException(422,'请输入有效的 Key')
    from app.llm_policy import validate_personal_key
    validate_personal_key(body.provider,body.key.strip())
    with sqlite3.connect(ROOT/'models.sqlite') as conn:
        conn.execute('INSERT OR REPLACE INTO configs VALUES(?,?,?)',(current.id,body.provider,BOX.encrypt(body.key.strip().encode()).decode()))
    return {'configured':True,'provider':body.provider}

@router.delete('/model-settings')
def delete_model(current=Depends(get_current_active_user)):
    with sqlite3.connect(ROOT/'models.sqlite') as conn:conn.execute('DELETE FROM configs WHERE user_id=?',(current.id,))
    return {'configured':False}

from app.llm_policy import Ledger, SCOPE, scoped_credentials
import uuid, json
LEDGER=Ledger(ROOT/'llm-quota.sqlite')
LEDGER.recover()

def personal_config():
    user_id=CURRENT.get()
    value=config(user_id) if user_id is not None else None
    personal=(value[0],BOX.decrypt(value[1].encode()).decode()) if value else None
    provider,key=scoped_credentials(personal,LEDGER)
    return user_id,provider,key,hashlib.sha256(key.encode()).hexdigest()

class ModelScopeMiddleware:
    def __init__(self,app):self.app=app
    async def __call__(self,scope,receive,send):
        if scope['type']!='http':return await self.app(scope,receive,send)
        headers=dict(scope.get('headers',[]));user_id=None
        token=headers.get(b'authorization',b'').decode()
        if token.startswith('Bearer '):
            payload=auth_service.decode_token(token[7:])
            if payload and payload.get('type')=='access':
                with SessionLocal() as session:
                    current=auth_service.get_user_by_username(session,username=payload.get('sub',''))
                    if current and current.is_active:user_id=current.id
        # Hash full request without persisting its content (never novel text).
        chunks=[]
        while True:
            part=await receive();chunks.append(part)
            if part['type']!='http.request' or not part.get('more_body'):break
        body=b''.join(p.get('body',b'') for p in chunks)
        operation=headers.get(b'idempotency-key',uuid.uuid4().hex.encode()).decode()[:128]
        state={'owner':user_id,'id':operation,'fingerprint':hashlib.sha256(scope['path'].encode()+body).hexdigest()}
        a=CURRENT.set(user_id);b=SCOPE.set(state);status=500;valid=False
        async def replay_receive():
            if chunks:return chunks.pop(0)
            return await receive()
        async def tracked_send(message):
            nonlocal status,valid
            if message['type']=='http.response.start':status=message['status']
            if message['type']=='http.response.body' and message.get('body') and status<400:valid=True
            await send(message)
        try:await self.app(scope,replay_receive,tracked_send)
        finally:
            if state.get('reserved'):LEDGER.finish(user_id,operation,bool(state.get('valid_output')),'saved-result')
            SCOPE.reset(b);CURRENT.reset(a)

def install(app):
    app.include_router(router,prefix='/api/v1',tags=['personal model'])
    app.add_middleware(ModelScopeMiddleware)
