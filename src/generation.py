import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from src.retrieval import get_retriever
from src.embeddings import load_vectorstore

load_dotenv()

PROMPT_TEMPLATE = """You are an AI assistant for Saket Saurabh's resume. 
Use the following context to answer questions about his background, skills, projects, and experience.

Context: {context}

Question: {question}

Provide a concise, accurate response based only on the context. 
If you don't have enough information, say so politely.

Answer:"""


def get_client():
    """Initializes the HuggingFace InferenceClient."""
    hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN") or os.getenv("HF_TOKEN")
    if not hf_token:
        raise ValueError("API Token not found in .env. Please set HUGGINGFACEHUB_API_TOKEN.")
    
    client = InferenceClient(
        api_key=hf_token,
    )
    return client


def generate_answer(query: str, client=None, retriever=None):
    """Retrieves context and generates an answer for the given query."""
    if client is None:
        client = get_client()
    if retriever is None:
        retriever = get_retriever(k=4)
    
    # Retrieve relevant documents
    docs = retriever.invoke(query)
    context = "\n\n".join(doc.page_content for doc in docs)
    
    # Build prompt
    prompt = PROMPT_TEMPLATE.format(context=context, question=query)
    
    # Call HuggingFace Inference API
    messages = [{"role": "user", "content": prompt}]
    
    response = client.chat.completions.create(
        model="Qwen/Qwen2.5-Coder-32B-Instruct",
        messages=messages,
        max_tokens=512,
        temperature=0.1,
    )
    
    answer = response.choices[0].message.content
    return answer, docs


if __name__ == "__main__":
    query = "What are Saket's main technical skills?"
    print(f"Query: {query}")
    answer, docs = generate_answer(query)
    print(f"\nAnswer:\n{answer}")
