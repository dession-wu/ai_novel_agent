// Only digests and opaque operation IDs remain in memory; never persist manuscripts.
export function createOperationFetch(fetcher = (...args) => globalThis.fetch(...args), cryptoApi = globalThis.crypto) {
  const pending = new Map();
  return async function operationFetch(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    if (method !== 'POST' || !/\/(novels(?:\/|$)|analyze(?:\?|$))/.test(String(url))) return fetcher(url, options);
    const headers = new Headers(options.headers || {});
    const bytes = new TextEncoder().encode(method+'\n'+url+'\n'+(headers.get('Authorization') || '')+'\n'+(options.body || ''));
    const hash = [...new Uint8Array(await cryptoApi.subtle.digest('SHA-256', bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');
    let id = pending.get(hash);
    if (!id) { id = cryptoApi.randomUUID(); pending.set(hash, id); }
    headers.set('Idempotency-Key', id);
    const response = await fetcher(url, {...options, headers});
    if (!response.ok || !response.body) return response;
    // Keep the ID until the body finishes: headers alone do not prove stream success.
    const reader = response.body.getReader();
    const decoder = new TextDecoder(); let tail = ''; let failed = false;
    const body = new ReadableStream({
      async pull(controller) {
        try {
          const chunk = await reader.read();
          if (chunk.done) { if (!failed && pending.get(hash) === id) pending.delete(hash); controller.close(); return; }
          tail = (tail + decoder.decode(chunk.value, {stream:true})).slice(-8192);
          if (/"error"\s*:/.test(tail)) failed = true;
          controller.enqueue(chunk.value);
        } catch (error) { controller.error(error); }
      },
      cancel(reason) { return reader.cancel(reason); }
    });
    return new Response(body, {status:response.status,statusText:response.statusText,headers:response.headers});
  };
}
export const aiFetch = createOperationFetch();
