import { useEffect, useState } from 'react';
export default function NovelModelSettings() {
  const [provider,setProvider]=useState('bailian');
  const [key,setKey]=useState('');
  const [configured,setConfigured]=useState(false);
  const [remaining,setRemaining]=useState(3);
  const [reserved,setReserved]=useState(0);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  async function request(method='GET') {
    const response=await fetch('/api/v1/model-settings',{method,headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('access_token')},...(method==='PUT'?{body:JSON.stringify({provider,key})}:{})});
    const data=await response.json();
    if(!response.ok)throw new Error(typeof data.detail==='string'?data.detail:'设置未保存，请重新登录后重试。');
    return data;
  }
  useEffect(()=>{request().then(data=>{setConfigured(data.configured);setProvider(data.provider);setRemaining(data.remaining);setReserved(data.reserved);}).catch(()=>setMessage('请登录后配置模型。'));},[]);
  async function save(method:string){
    setBusy(true);setMessage('');
    try{const data=await request(method);setConfigured(data.configured);setKey('');setMessage(method==='DELETE'?'已删除个人 Key。':'个人模型设置已保存。');}
    catch(error){setMessage(error instanceof Error?error.message:'操作失败，请重试。');}
    finally{setBusy(false);}
  }
  return <section className="rounded-lg border bg-card p-6 mb-6" aria-labelledby="personal-model-title">
    <h2 id="personal-model-title" className="text-xl font-semibold">我的 AI 模型</h2>
    <p className="text-sm text-muted-foreground mt-2">{configured?'已配置个人 Key。':'尚未配置个人 Key。'} 默认百炼 qwen3.7-flash。免费剩余 {remaining}/3，处理中 {reserved} 次；个人 Key 优先，免费耗尽后需配置个人 Key。</p>
    <p className="text-sm mt-2">在阿里云百炼控制台选择北京地域，开通按量付费并创建 API Key，确认余额及 qwen3.7-flash 模型权限后填入下方密码框。保存将发送极小请求验证，仅使用个人接口额度。401 检查 Key，403 检查地域和权限，429 检查额度；删除 Key 不重置免费次数。个人 Key 失败不会回退扣平台次数。</p>
    <form onSubmit={e=>{e.preventDefault();void save('PUT');}} className="mt-4 space-y-4">
      <label className="block text-sm">服务商<select value={provider} onChange={e=>setProvider(e.target.value)} className="block w-full rounded border bg-background p-2 mt-2"><option value="bailian">阿里云百炼（北京）</option><option value="deepseek">DeepSeek</option><option value="openai">OpenAI</option></select></label>
      <label className="block text-sm">API Key<input type="password" autoComplete="off" required maxLength={512} value={key} onChange={e=>setKey(e.target.value)} className="block w-full rounded border bg-background p-2 mt-2" placeholder="输入新 Key，不显示已保存的内容"/></label>
      <div className="flex gap-4"><button disabled={busy} className="rounded bg-primary text-primary-foreground px-4 py-2">{busy?'保存中…':'保存个人设置'}</button><button type="button" disabled={busy||!configured} onClick={()=>void save('DELETE')} className="rounded border px-4 py-2">删除 Key</button></div>
    </form><p role="status" className="text-sm mt-3">{message}</p>
  </section>;
}
