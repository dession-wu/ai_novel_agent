import test from 'node:test';
import assert from 'node:assert/strict';
import { loadWritingSession } from '../src/lib/writingSession.mjs';

function api(novels, chapters = []) {
  return { getNovels: async () => novels, getChapters: async id => chapters.filter(c => c.novel_id === id),
    getChapter: async () => { throw new Error('Unexpected hard-coded chapter request'); } };
}
test('new author gets an empty workspace without requesting chapter 1', async () => {
  const result = await loadWritingSession(api([]), new URLSearchParams());
  assert.equal(result.chapter, undefined);
  assert.deepEqual(result.novels, []);
});
test('work without chapters can enter the workspace', async () => {
  const result = await loadWritingSession(api([{id: 17}]), new URLSearchParams('novelId=17'));
  assert.equal(result.novel.id, 17);
  assert.equal(result.chapter, undefined);
});
test('selected work loads its own first chapter, not globally numbered 1', async () => {
  const result = await loadWritingSession(api([{id: 17},{id: 22}], [{id: 31,novel_id:22}]), new URLSearchParams('novelId=22'));
  assert.equal(result.chapter.id, 31);
});
test('chapter deep link chooses its owning work', async () => {
  const client = api([{id:17},{id:22}], [{id:31,novel_id:22}]);
  client.getChapter = async () => ({id:31,novel_id:22});
  assert.equal((await loadWritingSession(client, new URLSearchParams('chapterId=31'))).novel.id, 22);
});
for (const status of [403,404]) test(`unavailable deep link ${status} recovers to own chapter`, async () => {
  const client = api([{id:17}], [{id:9,novel_id:17}]);
  client.getChapter = async () => { throw Object.assign(new Error('unavailable'), {status}); };
  const result = await loadWritingSession(client,new URLSearchParams('chapterId=999'));
  assert.equal(result.chapter.id,9);
  assert.ok(result.notice);
});
test('invalid chapter parameter never issues a chapter request', async () => {
  assert.ok((await loadWritingSession(api([]),new URLSearchParams('chapterId=NaN'))).notice);
});
test('network failures remain visible instead of being mistaken for an empty work', async () => {
  const client = api([{id:17}]);
  client.getChapter = async () => { throw Object.assign(new Error('offline'),{status:503}); };
  await assert.rejects(loadWritingSession(client,new URLSearchParams('chapterId=4')),/offline/);
});
