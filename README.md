# 🤖 Resume Assistant RAG Chatbot

An intelligent **Retrieval-Augmented Generation (RAG)** chatbot assistant for Saket Saurabh's resume. Built using LangChain, HuggingFace Inference API, ChromaDB, Sentence Transformers, and a modern web interface ready for GitHub Pages.

---

## 🌟 Features
- **Intelligent Q&A**: Answers questions about Saket's skills, projects, certifications, and background.
- **RAG Architecture**: Uses Chroma Vector DB to retrieve contextually relevant resume chunks.
- **CLI Chatbot**: Terminal-based interactive assistant (`src/cli.py`).
- **GitHub Pages Web UI**: Dark-mode web interface in `docs/` ready for free hosting.

---

## 📁 Project Structure
```text
ChatBot-RaG-Project/
├── data/
│   └── SS_NEW_RESUME.pdf    # Target Resume PDF
├── docs/                    # GitHub Pages Web UI
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── resume_data.js
├── src/
│   ├── ingestion.py        # PDF text loading & chunking
│   ├── embeddings.py       # Chroma vector store persistence
│   ├── retrieval.py        # Retriever module
│   ├── generation.py       # HuggingFace RAG inference pipeline
│   └── cli.py              # CLI interactive entry point
├── .env.example
├── .gitignore
└── requirements.txt
```

---

## 🚀 Quick Start (Local CLI)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Up API Key
Copy `.env.example` to `.env` and add your HuggingFace token:
```env
HUGGINGFACEHUB_API_TOKEN=your_hf_token_here
```

### 3. Generate Vector Store
```bash
python -m src.embeddings
```

### 4. Run CLI Chatbot
```bash
python src/cli.py
```

---

## 🌐 Deploying Web UI to GitHub Pages

1. Push this folder to your repository: `https://github.com/SAKET-SAURABH-07/ChatBot-RaG-Project.git`
2. Go to **Settings > Pages** on GitHub.
3. Select **Branch: `main`** and **Folder: `/docs`**.
4. Click **Save**!
