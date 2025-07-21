# 📚 AI Study Assistant (Streamlit + Gemini + LangChain)

An AI-powered **PDF Study Assistant** that:
- Summarizes study material
- Generates multiple-choice questions (MCQs)
- Creates an interactive quiz with feedback

All powered by **Gemini 1.5 Flash** via **LangChain** and deployed with **Streamlit**.

---

## 🔧 Features

✅ Upload any PDF  
✅ Bullet-point summary of key concepts  
✅ 5 AI-generated MCQs  
✅ Interactive quiz with real-time feedback  
✅ Built on Gemini 1.5 Flash (Google)  
✅ All in a single Python file  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/study-assistant
cd study-assistant

2. Install requirements
bash
Copy
Edit
pip install -r requirements.txt
3. Set your Gemini API Key
Create a .env file in the project root:

ini
Copy
Edit
GEMINI_API_KEY=your-gemini-api-key

4. Run the app
bash
Copy
Edit
streamlit run app.py
Then go to: http://localhost:8501

📌 Example Use Case
Upload a PDF on "Prompt Engineering for Agents" and instantly get:

10–15 key summary points

5 quiz questions

Detailed feedback and explanations

Perfect for students, educators, or self-learners.

🛡️ Security
API keys are loaded securely from .env

.env is in .gitignore

No external vector DBs or storage is used

👩‍🎓 Ideal For
Exam prep

Course review

Self-assessment

Flashcard creation

📣 Future Additions (Optional)
Upload DOCX/HTML/TXT files

Export quiz as PDF

LLM selection toggle (Gemini, OpenAI, Mistral)

🙌 Built With
LangChain

Gemini API

Streamlit

PyPDF2

yaml
Copy
Edit
