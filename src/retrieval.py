from src.embeddings import load_vectorstore

def get_retriever(k=4):
    """Returns a retriever configured for similarity search."""
    vectorstore = load_vectorstore()
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k}
    )
    return retriever

if __name__ == "__main__":
    retriever = get_retriever()
    print("Retriever configured successfully.")
    
    # Optional test
    docs = retriever.invoke("What are Saket's main technical skills?")
    print(f"Retrieved {len(docs)} documents.")
    for i, doc in enumerate(docs):
        print(f"\nSource {i+1}:\n{doc.page_content[:200]}...\n")
