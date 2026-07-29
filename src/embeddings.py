import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from src.ingestion import load_and_chunk_resume

PERSIST_DIRECTORY = "./resume_db"
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

def get_embeddings_model():
    """Returns the HuggingFace embeddings model."""
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)

def create_and_persist_vectorstore(pdf_path: str):
    """Creates a vector store from a PDF and persists it."""
    print("Loading and chunking resume...")
    chunks = load_and_chunk_resume(pdf_path)
    
    print(f"Creating vector store for {len(chunks)} chunks...")
    embeddings = get_embeddings_model()
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=PERSIST_DIRECTORY
    )
    print(f"Vector store persisted to {PERSIST_DIRECTORY}")
    return vectorstore

def load_vectorstore():
    """Loads the persisted vector store."""
    if not os.path.exists(PERSIST_DIRECTORY):
        raise FileNotFoundError(f"Vector store not found at {PERSIST_DIRECTORY}. Please run ingestion first.")
    
    embeddings = get_embeddings_model()
    vectorstore = Chroma(
        persist_directory=PERSIST_DIRECTORY,
        embedding_function=embeddings
    )
    return vectorstore

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Embed the resume PDF")
    parser.add_argument("--pdf", type=str, default="data/SS_NEW_RESUME.pdf", help="Path to resume PDF")
    args = parser.parse_args()
    
    if os.path.exists(args.pdf):
        create_and_persist_vectorstore(args.pdf)
    else:
        print(f"File not found: {args.pdf}")
