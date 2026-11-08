const validId = value => /^[1-9]\d*$/.test(value || '') && Number.isSafeInteger(Number(value)) ? Number(value) : undefined;

// Resolve only the signed-in author's works; a new account has no implicit chapter.
export async function loadWritingSession(api, params) {
  const novels = await api.getNovels();
  let notice = '';
  let chapter;
  let novel = novels.find(item => item.id === validId(params.get('novelId')));
  const chapterId = validId(params.get('chapterId'));
  if (chapterId && novels.length) {
    try {
      const candidate = await api.getChapter(chapterId);
      const owner = novels.find(item => item.id === candidate.novel_id);
      if (owner) { chapter = candidate; novel = owner; }
      else notice = '原章节已不可用，已返回你的作品。';
    } catch (error) {
      if (![403, 404].includes(error.status)) throw error;
      notice = '原章节已删除或无法访问，已返回你的作品。';
    }
  } else if (params.has('chapterId') || (params.has('novelId') && !novel)) {
    notice = '原写作链接已不可用，请选择作品或新建章节。';
  }
  novel ||= novels[0];
  const chapters = novel ? await api.getChapters(novel.id) : [];
  chapter ||= chapters[0];
  return { novels, novel, chapters, chapter, notice };
}
