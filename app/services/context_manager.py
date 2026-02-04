from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from app.core.config import settings
import os
import logging

logger = logging.getLogger(__name__)

class ContextManager:
    def __init__(self):
        # Ensure directory exists
        if not os.path.exists(settings.CHROMA_PERSIST_DIRECTORY):
            os.makedirs(settings.CHROMA_PERSIST_DIRECTORY)
        
        try:
            self.embeddings = OpenAIEmbeddings(
                api_key=settings.OPENAI_API_KEY,
                model="text-embedding-3-small"
            )
        except Exception as e:
            logger.error(f"Failed to initialize OpenAIEmbeddings: {e}")
            self.embeddings = None
        
        self.persist_directory = settings.CHROMA_PERSIST_DIRECTORY
        
    def get_vectorstore(self, collection_name: str):
        if not self.embeddings:
            raise ValueError("Embeddings not initialized")
        
        return Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=self.persist_directory
        )

    async def add_chapter_summary(self, novel_id: int, chapter_id: int, summary: str):
        if not self.embeddings:
            logger.warning("Skipping adding chapter summary: Embeddings not initialized")
            return
        
        collection_name = f"novel_{novel_id}"
        try:
            vectorstore = self.get_vectorstore(collection_name)
            vectorstore.add_texts(
                texts=[summary],
                metadatas=[{"chapter_id": chapter_id, "type": "summary"}]
            )
        except Exception as e:
            logger.error(f"Error adding chapter summary: {e}")
        
    async def query_context(self, novel_id: int, query: str, k: int = 3):
        """Retrieve relevant context for the current generation"""
        if not self.embeddings:
            logger.warning("Skipping context query: Embeddings not initialized")
            return ""
        
        collection_name = f"novel_{novel_id}"
        try:
            vectorstore = self.get_vectorstore(collection_name)
            docs = vectorstore.similarity_search(query, k=k)
            return "\n".join([d.page_content for d in docs])
        except Exception as e:
            # Handle case where collection doesn't exist yet or API call fails
            logger.error(f"Error querying context: {e}")
            return ""

context_manager = ContextManager()
