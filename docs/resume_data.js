// Resume data embedded directly for GitHub Pages (RAG Context Data)
const RESUME_DATA = `
# Saket Saurabh - Professional Profile & Resume

## Candidate Overview
Saket Saurabh is a Machine Learning and Computer Vision Developer specializing in Real-Time Object Detection, Optical Character Recognition (OCR), Deep Learning Model Optimization, Edge AI Deployment, and Retrieval-Augmented Generation (RAG) Systems. He develops scalable AI solutions for real-world applications in accessibility, sports analytics, and financial technology.

## Core Technical Skills
- **Programming Languages:** Python (Advanced), C++, SQL, JavaScript, HTML5/CSS3.
- **Deep Learning & Computer Vision:** TensorFlow, PyTorch, Keras, OpenCV, YOLO (v8, v10), DeepSORT, ByteTRACK, Torchvision, Scikit-Learn.
- **Generative AI & RAG Architecture:** LangChain, ChromaDB, HuggingFace Inference API, Sentence-Transformers (all-MiniLM-L6-v2), Qwen 2.5 32B Instruct, Vector Store Retrieval.
- **Web & Deployment Frameworks:** Streamlit, FastAPI, HTML5, CSS3, JavaScript (ES6+), Docker.
- **Specialized Domains:** Real-Time Object Recognition, Video Analytics, Edge Computing & Model Quantization, Accessibility AI, Automated Financial Classification, Sports Tracking.

## Detailed Projects & Architectural Breakdown

1. **Signboard Recognition System (Real-Time Vision & Accessibility)**
   - **Objective:** Designed and deployed an end-to-end computer vision solution to detect street signboards, commercial signage, and navigation text in real-time to assist visually impaired individuals.
   - **Tech Stack:** Python, YOLOv8/v10 for object detection, OpenCV for image preprocessing & contour detection, Tesseract / EasyOCR for text extraction, PyTorch.
   - **Key Features & Metrics:**
     * Implemented multi-stage detection pipeline achieving 94%+ detection precision across varying lighting conditions and camera angles.
     * Engineered real-time frame processing optimized for 30+ FPS performance.
     * Integrated automated text-to-speech audio overlays to deliver instantaneous navigation cues to users.

2. **Currency Detection & Classification System**
   - **Objective:** Built a deep learning classification pipeline to recognize bank notes, verify currency authenticity, and classify denominations for automated financial systems.
   - **Tech Stack:** TensorFlow, Keras, Convolutional Neural Networks (ResNet50 / MobileNetV2 architecture), OpenCV, Streamlit UI.
   - **Key Features & Metrics:**
     * Achieved 98.2% test accuracy on multi-denomination banknote classification.
     * Applied transfer learning and feature extraction to detect minute security threads and watermark patterns.
     * Quantized model weights for low-latency deployment on resource-constrained edge hardware.

3. **Football Analytics & Player Tracking Framework**
   - **Objective:** Created a computer vision analytics engine for automated tactical analysis in football (soccer) matches, including player velocity, ball trajectory, and team formation mapping.
   - **Tech Stack:** OpenCV, PyTorch, YOLOv8 object detector, DeepSORT / ByteTRACK multi-object tracker, Matplotlib, Pandas, NumPy.
   - **Key Features & Metrics:**
     * Built multi-object tracking (MOT) pipeline to continuously track 22 players, referees, and the match ball without ID switching.
     * Developed 2D pitch perspective transformation (homography matrix mapping) to render real-time tactical pitch radar views.
     * Computed player speed, distance covered, and heatmaps for comprehensive post-match performance reporting.

4. **RAG-based Resume AI Assistant**
   - **Objective:** Created a Retrieval-Augmented Generation chatbot platform that indexes candidate resume documents into vector embeddings to provide precise, context-backed answers.
   - **Tech Stack:** LangChain, ChromaDB vector store, HuggingFace Inference API, Qwen 2.5 Coder 32B model, HTML/CSS/JS frontend.
   - **Key Features & Metrics:**
     * Chunks resume text into semantic units and embeds using sentence-transformers (all-MiniLM-L6-v2).
     * Eliminates LLM hallucinations by enforcing strict retrieval-augmented prompt constraints.

## Education & Certifications
- **Education:** Bachelor's Specialization in AI & Machine Learning.
- **Certifications:**
  1. AI & Machine Learning Professional Certification
  2. Advanced SQL & Database Management Certification
  3. Edge Computing & Embedded AI Model Deployment Certification
`;
