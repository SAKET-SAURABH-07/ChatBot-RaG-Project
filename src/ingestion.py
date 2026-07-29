import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_and_chunk_resume(pdf_path: str):
    """Loads a PDF resume and splits it into chunks."""
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"Resume file not found at {pdf_path}")

    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n## ", "\n### ", "\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

if __name__ == "__main__":
    # Test ingestion
    sample_path = "../data/SS_NEW_RESUME.pdf"
    if os.path.exists(sample_path):
        chunks = load_and_chunk_resume(sample_path)
        print(f"Loaded {len(chunks)} chunks from {sample_path}")
    else:
        print(f"No test file found at {sample_path}")
