import sys
import os

# Ensure src is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.generation import get_client, generate_answer
from src.retrieval import get_retriever

def run_cli():
    print("=" * 50)
    print("📄 Resume Assistant CLI - Saket Saurabh")
    print("=" * 50)
    print("Initializing AI Model...\n")
    
    try:
        client = get_client()
        retriever = get_retriever()
    except Exception as e:
        print(f"Failed to initialize. Error: {e}")
        return

    print("Ready! Type your questions below (or type 'exit' to stop).\n")
    
    while True:
        try:
            query = input("\nYour question: ").strip()
            if query.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break
            if not query:
                continue
                
            print("\nThinking...")
            
            answer, docs = generate_answer(query, client=client, retriever=retriever)
            
            print("\n--- Answer ---")
            print(answer)
            
            print("\n--- Sources ---")
            for i, doc in enumerate(docs):
                print(f"[{i+1}] {doc.page_content[:150]}...")
                
            print("-" * 50)
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")

if __name__ == "__main__":
    run_cli()
