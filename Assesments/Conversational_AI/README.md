# 🧠 Competitor Intelligence AI for Clothing Stores

A Streamlit + LangGraph app that helps businesses analyze clothing store competitors in any location (e.g., Koramangala, Bangalore).

## 🔍 Features

- Uses Gemini 1.5 Flash via LangChain
- Fetches top clothing stores nearby (DuckDuckGo API)
- Simulates footfall trends and peak hours
- Orchestrated using LangGraph with Analyst & Strategist agents
- Generates Markdown report with download option

## 🚀 Setup Instructions

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd competitor-intel-ai
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set your Gemini API Key**
```bash
export GOOGLE_API_KEY="your-gemini-key"
# or create a .env file with GOOGLE_API_KEY=your-gemini-key
```

4. **Run the app**
```bash
streamlit run app.py
```

## 📊 Example Use Case

📍 Enter: `Koramangala, Bangalore`  
🧾 Output: Competitor list, footfall heatmap, strategy suggestions.

---

Built with ❤️ using LangGraph + Streamlit + Gemini 1.5 Flash