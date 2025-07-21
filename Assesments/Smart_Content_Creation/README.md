# 🧠 Smart Competitor Insights AI

This AI assistant helps you generate reports on nearby clothing store competitors based on footfall, popularity, and busiest hours.

## 🔍 Features

- Ask questions like:
  - "What are the busiest clothing stores in Koramangala?"
  - "When is the peak time for customer visits in MG Road stores?"
- Gets real-time data using Tavily Search
- Powered by Gemini 1.5 Flash and LangChain + LangGraph
- Stunning UI with Streamlit

## 🛠️ Setup

1. **Clone the repo**
```bash
git clone <your-repo-url>
cd smart_competitor_ai
Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
Add your Gemini API Key

Create a .env file in the root directory:

bash
Copy
Edit
GEMINI_API_KEY=your-google-api-key
Run the app

bash
Copy
Edit
streamlit run app.py
App runs at: http://localhost:8501

🤖 How It Works
Uses LangChain tools to:

Search competitor stores and footfall using Tavily

Invoke Gemini 1.5 Flash for insights and report generation

LangGraph used for orchestration of tool calls

Clean one-click UI built with Streamlit

🔐 Security
Never share your .env file publicly

.gitignore should include .env, __pycache__/, .DS_Store

📎 Sample Query
"What are the peak hours for clothing stores in Koramangala?"
