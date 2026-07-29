import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

from src.retrieval import get_retriever
from src.embeddings import load_vectorstore

load_dotenv()

PROMPT_TEMPLATE = """You are Saket Saurabh's official AI Resume & Portfolio Assistant.
Use the following context to answer questions about his technical background, skills, projects, and experience.

Rules for your response:
1. Provide specific technical details, algorithms, frameworks, and metrics (e.g. YOLOv8/v10, PyTorch, TensorFlow, ResNet50, 94%+ accuracy, 30+ FPS, DeepSORT, ChromaDB, etc.) whenever relevant.
2. Structure your answer clearly using bullet points, bold key terms, and section headers.
3. Be direct, professional, and detailed. Avoid vague or generic one-line responses.
4. Base your answer strictly on Saket's context provided below.

Context:
{context}

Question: {question}

Detailed Professional Answer:"""


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
