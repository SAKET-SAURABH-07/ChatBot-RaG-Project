// Load saved API Key if available
document.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('hf_api_key');
    if (savedKey) {
        document.getElementById('apiKey').value = savedKey;
    }
});

function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (apiKey) {
        localStorage.setItem('hf_api_key', apiKey);
        alert('API Key saved locally in your browser!');
    } else {
        localStorage.removeItem('hf_api_key');
        alert('API Key cleared.');
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function askQuestion(questionText) {
    document.getElementById('userInput').value = questionText;
    sendMessage();
}

function getStoredApiKey() {
    return document.getElementById('apiKey')?.value.trim() || localStorage.getItem('hf_api_key') || "";
}

async function sendMessage() {
    const inputEl = document.getElementById('userInput');
    const query = inputEl.value.trim();
    if (!query) return;

    inputEl.value = '';

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
        console.error(err);
        updateBotMessage(botMsgId, "⚠️ An error occurred: " + err.message + "\n\nTip: Make sure to enter a valid HuggingFace API key in the sidebar if required.");
    }
}

function appendMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.textContent = sender === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;

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
    avatarDiv.textContent = '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span><span></span><span></span>
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
    contentDiv.innerHTML = text.replace(/\n/g, '<br>');
}

// Simple RAG context retrieval & generation
async function generateAnswer(query, apiKey) {
    const context = RESUME_DATA;
    
    // If no API key provided, fall back to smart local matching
    if (!apiKey) {
        return getLocalFallbackResponse(query);
    }

    const prompt = `You are an AI assistant for Saket Saurabh's resume.
Use the following context to answer questions about his background, skills, projects, and experience.

Context:
${context}

Question: ${query}

Provide a concise, accurate response based only on the context. If you don't have enough information, say so politely.

Answer:`;

    // Try calling HF Serverless API via router endpoint
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 512,
            temperature: 0.1
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
    } else {
        throw new Error('Invalid response format from API');
    }
}

function getLocalFallbackResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('skill') || q.includes('framework') || q.includes('technology') || q.includes('python')) {
        return "Saket's main technical skills include:\n• **Languages:** Python\n• **Frameworks:** TensorFlow, Keras, YOLO, LangChain, Streamlit\n• **Domains:** Computer Vision, Model Deployment, Real-time Systems, Accessibility, Sports Analytics\n• **Tools:** Deployment tools & Edge Computing.";
    }
    if (q.includes('signboard') || q.includes('accessibility')) {
        return " Saket developed a **Signboard Recognition System** — a real-time computer vision system built to recognize signboards for accessibility purposes.";
    }
    if (q.includes('currency')) {
        return " Saket built a **Currency Detection** project featuring a machine learning model designed to detect and classify currency notes.";
    }
    if (q.includes('football') || q.includes('sports')) {
        return " Saket created a **Football Analytics** project analyzing football match data and player tracking using computer vision techniques.";
    }
    if (q.includes('certification') || q.includes('certificate')) {
        return "Saket holds multiple certifications:\n• AI/ML Certification\n• SQL Certification\n• Edge Computing Certification";
    }
    if (q.includes('education') || q.includes('degree') || q.includes('study')) {
        return "Saket has an academic background with a specialization in **AI & ML**.";
    }
    if (q.includes('project')) {
        return "Saket's notable projects include:\n1. **Signboard Recognition System** (Real-time CV for accessibility)\n2. **Currency Detection** (ML model to classify notes)\n3. **Football Analytics** (CV match data & player tracking)";
    }
    if (q.includes('summary') || q.includes('profile') || q.includes('who is')) {
        return "Saket Saurabh is a **Machine Learning & Computer Vision Developer** with end-to-end development experience in computer vision models, real-time systems, and model deployment.";
    }

    return "Saket Saurabh is a Machine Learning & Computer Vision developer skilled in Python, TensorFlow, Keras, YOLO, and LangChain.\n\n*(Note: For dynamic AI answers to any question, please save your HuggingFace API key in the left sidebar!)*";
}
