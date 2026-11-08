import asyncio
import unittest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.novel_service import NovelService


class BlankChapterTest(unittest.TestCase):
    def test_blank_chapter_does_not_call_ai_or_vector_store(self):
        db = MagicMock()
        with patch('app.services.novel_service.context_manager') as context, patch('app.services.novel_service.llm_service') as llm:
            context.query_context = AsyncMock(return_value='')
            llm.generate_chapter = AsyncMock(return_value='unexpected paid generation')
            chapter = asyncio.run(NovelService().create_chapter(db, 42, 'First', 1, ''))
            self.assertEqual(chapter.content, '')
            context.query_context.assert_not_called()
            llm.generate_chapter.assert_not_called()
            db.add.assert_called_once_with(chapter)


if __name__ == '__main__':
    unittest.main()
