import {test} from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createOperationFetch} from '../src/lib/aiOperation.mjs';
const url='/api/v1/novels/1/chapters/2/stream_continue';
const options={method:'POST',headers:{Authorization:'Bearer fake-user'},body:JSON.stringify({text:'private fixture'})};
test('network failure reuses ID; completed body permits a new operation',async()=>{
 const ids=[];let fail=true;const send=createOperationFetch(async(u,o)=>{ids.push(o.headers.get('Idempotency-Key'));if(fail){fail=false;throw Error('network');}return new Response('valid output');},webcrypto);
 await assert.rejects(send(url,options));await (await send(url,options)).text();await (await send(url,options)).text();assert.equal(ids[0],ids[1]);assert.notEqual(ids[1],ids[2]);
});
test('HTTP error and incomplete cancelled stream retain operation ID',async()=>{
 const ids=[];let count=0;const send=createOperationFetch(async(u,o)=>{ids.push(o.headers.get('Idempotency-Key'));count++;return count===1?new Response('error',{status:503}):new Response(new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('chunk'));}}));},webcrypto);
 await send(url,options);const second=await send(url,options);await second.body.cancel();const third=await send(url,options);await third.body.cancel();assert.equal(new Set(ids).size,1);
});
test('SSE reported failure retains ID and success clears it',async()=>{
 const ids=[];let count=0;const send=createOperationFetch(async(u,o)=>{ids.push(o.headers.get('Idempotency-Key'));return new Response(++count===1?'data: {"error":"upstream"}\n\n':'data: {"content":"done"}\n\n');},webcrypto);
 await (await send(url,options)).text();await (await send(url,options)).text();await (await send(url,options)).text();assert.equal(ids[0],ids[1]);assert.notEqual(ids[1],ids[2]);
});
test('changed input and changed authenticated account use separate IDs',async()=>{
 const ids=[];const send=createOperationFetch(async(u,o)=>{ids.push(o.headers.get('Idempotency-Key'));throw Error('network');},webcrypto);
 await assert.rejects(send(url,options));await assert.rejects(send(url,{...options,body:'different'}));await assert.rejects(send(url,{...options,headers:{Authorization:'Bearer other'}}));assert.equal(new Set(ids).size,3);
});
test('ordinary GET does not gain an AI operation header',async()=>{
 let received;const send=createOperationFetch(async(u,o)=>{received=o;return new Response('ok');},webcrypto);await send('/api/v1/novels/1',{method:'GET'});assert.equal(received.headers,undefined);
});
test('research analyze submission shares retry policy',async()=>{
 const ids=[];const send=createOperationFetch(async(u,o)=>{ids.push(o.headers.get('Idempotency-Key'));throw Error('network');},webcrypto);await assert.rejects(send('/analyze',options));await assert.rejects(send('/analyze',options));assert.equal(ids[0],ids[1]);
});
