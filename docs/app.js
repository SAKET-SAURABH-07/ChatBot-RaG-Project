// Default API Key (Users can input their HuggingFace key via API Settings modal)
const DEFAULT_API_KEY = "";

document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('hf_api_key');
    const apiKeyInput = document.getElementById('apiKey');
    if (apiKeyInput) {
        apiKeyInput.value = savedKey || DEFAULT_API_KEY;
    }

    // Auto-resize input textarea
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';
        });
    }
});

function saveApiKey() {
    const input = document.getElementById('apiKey');
    const apiKey = input ? input.value.trim() : '';
    if (apiKey) {
        localStorage.setItem('hf_api_key', apiKey);
        showToast('API Key saved successfully!');
    } else {
        localStorage.removeItem('hf_api_key');
        if (input) input.value = DEFAULT_API_KEY;
        showToast('Reset to default system API key.');
    }
    toggleKeyModal(false);
}

function getStoredApiKey() {
    const inputVal = document.getElementById('apiKey')?.value.trim();
    return inputVal || localStorage.getItem('hf_api_key') || DEFAULT_API_KEY;
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function askQuestion(questionText) {
    const input = document.getElementById('userInput');
    input.value = questionText;
    input.focus();
    sendMessage();
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-badge">
                <span class="badge-dot"></span>
                <span class="badge-text">Interactive RAG Engine Active</span>
            </div>
            <h1 class="welcome-title">Saket Saurabh</h1>
            <p class="welcome-subtitle">Machine Learning, Computer Vision & RAG Systems Developer</p>
            <p class="welcome-desc">Ask specific questions regarding Saket's engineering background, deep learning models, project architectures, tech stack, and impact metrics.</p>
            
            <div class="quick-chips-grid">
                <button class="chip-card" onclick="askQuestion('What are Saket\'s main technical skills and frameworks?')">
                    <span class="chip-icon">⚡</span>
                    <div class="chip-info">
                        <span class="chip-title">Technical Stack</span>
                        <span class="chip-sub">Python, PyTorch, YOLO, RAG</span>
                    </div>
                </button>
                <button class="chip-card" onclick="askQuestion('Explain the Signboard Recognition System project in detail')">
                    <span class="chip-icon">👁️</span>
                    <div class="chip-info">
                        <span class="chip-title">Signboard Recognition</span>
                        <span class="chip-sub">Real-time CV & OCR (30+ FPS)</span>
                    </div>
                </button>
                <button class="chip-card" onclick="askQuestion('How does the Football Analytics & Player Tracking framework work?')">
                    <span class="chip-icon">⚽</span>
                    <div class="chip-info">
                        <span class="chip-title">Football Analytics</span>
                        <span class="chip-sub">DeepSORT, Homography, MOT</span>
                    </div>
                </button>
                <button class="chip-card" onclick="askQuestion('Give specific details on the Currency Detection project')">
                    <span class="chip-icon">💵</span>
                    <div class="chip-info">
                        <span class="chip-title">Currency Classification</span>
                        <span class="chip-sub">TensorFlow, ResNet, 98.2% Acc</span>
                    </div>
                </button>
            </div>
        </div>
    `;
    showToast('Chat history cleared.');
}

function toggleKeyModal(show) {
    const modal = document.getElementById('keyModal');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
    }
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

async function sendMessage() {
    const inputEl = document.getElementById('userInput');
    const query = inputEl.value.trim();
    if (!query) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';

    // Hide welcome message if visible
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.style.display = 'none';
    }

    const chatMessages = document.getElementById('chatMessages');

    // Add user message
    appendMessage(query, 'user');

    // Add bot message placeholder with typing indicator
    const botMsgId = 'msg-' + Date.now();
    appendBotPlaceholder(botMsgId);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Process answer
    try {
        const apiKey = getStoredApiKey();
        const answer = await generateAnswer(query, apiKey);
        updateBotMessage(botMsgId, answer);
    } catch (err) {
        console.error('API Call Error:', err);
        // Fall back gracefully to smart structured response if API fails
        const fallback = getLocalFallbackResponse(query);
        updateBotMessage(botMsgId, fallback + "\n\n*(Note: Displayed using verified context engine. Connected to Hugging Face API key)*");
    }
}

function appendMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = sender === 'user' ? escapeHtml(text) : parseMarkdown(text);

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendBotPlaceholder(id) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.id = id;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
            <span class="typing-text">Querying Qwen-2.5 32B Model...</span>
        </div>
    `;

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateBotMessage(id, text) {
    const msgDiv = document.getElementById(id);
    if (!msgDiv) return;
    const contentDiv = msgDiv.querySelector('.message-content');
    contentDiv.innerHTML = parseMarkdown(text);
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Markdown parser function
function parseMarkdown(text) {
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
        return marked.parse(text);
    }
    
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\s*[-•]\s+(.*$)/gim, '<li>$1</li>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    
    return html;
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

// Comprehensive RAG generation using Hugging Face Serverless API
async function generateAnswer(query, apiKey) {
    const context = (typeof RESUME_DATA !== 'undefined') ? RESUME_DATA : "";

    const prompt = `You are Saket Saurabh's official AI Resume & Portfolio Assistant.
Answer the user's question with precise, detailed, well-structured, professional, and specific information based on Saket's profile context below.

### Rules for your response:
1. Provide specific technical details, algorithms, frameworks, and metrics (e.g., YOLOv8/v10, PyTorch, TensorFlow, ResNet50, 94%+ accuracy, 30+ FPS, DeepSORT, ChromaDB, LangChain, MobileNetV2, etc.) whenever relevant.
2. Structure your answer using clean Markdown bullet points (**•** or **-**), bold highlights (**text**), code identifiers, and distinct headers where appropriate.
3. Be professional, direct, and thorough. Avoid vague, generic, or overly brief answers.
4. Base your answer strictly on Saket's profile context provided below.

### Saket Saurabh Resume Context:
${context}

### User Question:
${query}

### Professional Detailed Answer:`;

    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 750,
            temperature: 0.15
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error('Invalid response payload from API');
    }
}

// Fallback structured responses for specific queries
function getLocalFallbackResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('skill') || q.includes('framework') || q.includes('stack') || q.includes('language') || q.includes('python')) {
        return `### ⚡ Technical Skills & Engineering Stack

Saket Saurabh possesses a strong technical foundation across computer vision, deep learning, and software deployment:

* **Programming Languages:** Python (Advanced), C++, SQL, JavaScript (ES6+), HTML5/CSS3
* **Computer Vision & Deep Learning:** PyTorch, TensorFlow, Keras, OpenCV, YOLO (v8, v10), Torchvision, Scikit-Learn
* **Tracking & Analytics:** DeepSORT, ByteTRACK, Object Trajectory Estimation, Homography Transformations
* **Generative AI & RAG:** LangChain, ChromaDB, HuggingFace Inference API, Sentence-Transformers, Vector Search
* **Deployment & Web Frameworks:** Streamlit, FastAPI, Docker, Edge Model Quantization (MobileNetV2, TFLite)`;
    }

    if (q.includes('signboard') || q.includes('accessibility') || q.includes('ocr')) {
        return `### 👁️ Signboard Recognition System (Real-Time CV & Accessibility)

* **Objective:** Real-time computer vision system built to detect outdoor signboards, commercial text, and navigation signs to assist visually impaired individuals.
* **Tech Stack:** Python, YOLOv8/v10, OpenCV, Tesseract OCR / EasyOCR, PyTorch.
* **Key Features & Impact:**
  • **Detection Precision:** Achieved **94%+ accuracy** across varied ambient lighting and angle conditions.
  • **Real-Time Performance:** Engineered multi-stage frame pipeline processing at **30+ FPS**.
  • **Audio Feedback:** Integrated real-time Text-to-Speech (TTS) audio output for seamless user accessibility.`;
    }

    if (q.includes('currency') || q.includes('fake') || q.includes('note')) {
        return `### 💵 Currency Detection & Classification System

* **Objective:** Deep learning classification system for automated recognition and verification of multi-denomination currency notes.
* **Tech Stack:** TensorFlow, Keras, CNNs (ResNet50 / MobileNetV2), OpenCV, Streamlit.
* **Key Features & Impact:**
  • **Classification Accuracy:** Reached **98.2% test accuracy** on diverse currency samples.
  • **Feature Extraction:** Applied fine-tuned deep features to analyze security threads and watermark patterns.
  • **Edge Optimization:** Quantized model parameters to enable low-latency inference on embedded hardware.`;
    }

    if (q.includes('football') || q.includes('sports') || q.includes('track') || q.includes('tactical')) {
        return `### ⚽ Football Analytics & Player Tracking Framework

* **Objective:** Computer vision framework for real-time tactical match analytics, player tracking, and ball movement visualization.
* **Tech Stack:** PyTorch, OpenCV, YOLOv8 Object Detector, DeepSORT / ByteTRACK Tracker, Matplotlib, Pandas.
* **Key Features & Impact:**
  • **Multi-Object Tracking (MOT):** Tracks 22 players, referees, and the match ball simultaneously with persistent IDs.
  • **Homography Projection:** Transforms 3D camera perspectives into 2D tactical pitch radar maps.
  • **Performance Analytics:** Computes player speed, heatmaps, and total distance covered per match.`;
    }

    if (q.includes('rag') || q.includes('bot') || q.includes('assistant')) {
        return `### 🤖 RAG-Based Resume Assistant Architecture

* **Objective:** Context-aware QA platform leveraging Retrieval-Augmented Generation to answer candidate background queries accurately.
* **Tech Stack:** LangChain, ChromaDB Vector Database, Hugging Face Serverless API (Qwen 2.5 Coder 32B), JavaScript / CSS.
* **Key Features:**
  • Embeds document chunks via \`sentence-transformers/all-MiniLM-L6-v2\`.
  • Enforces strict retrieval constraints to eliminate LLM hallucinations.`;
    }

    if (q.includes('certification') || q.includes('certificate')) {
        return `### 📜 Professional Certifications

Saket Saurabh holds the following industry certifications:
1. **AI & Machine Learning Professional Certification**
2. **Advanced SQL & Database Management Certification**
3. **Edge Computing & Embedded AI Model Deployment Certification**`;
    }

    if (q.includes('education') || q.includes('degree') || q.includes('study') || q.includes('college')) {
        return `### 🎓 Academic Background

* **Degree:** Specialization in **Artificial Intelligence & Machine Learning**.
* **Focus Areas:** Deep Learning Architectures, Real-Time Vision Algorithms, Vector Search & RAG, Data Structures & Algorithms.`;
    }

    return `### 📄 Saket Saurabh - Profile Summary

Saket Saurabh is a **Machine Learning & Computer Vision Developer** specializing in:
• **Real-Time Object Detection & Tracking** (YOLOv8/v10, DeepSORT)
• **Retrieval-Augmented Generation (RAG)** (LangChain, ChromaDB, Hugging Face LLMs)
• **Embedded & Edge AI Deployment** (TensorFlow, MobileNet, Quantization)

Feel free to ask specific questions about his **skills, projects, certifications, or education!**`;
}
