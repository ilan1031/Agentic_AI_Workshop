
## ✈️ Travel Assistant AI – LangChain + Gemini + Streamlit

An intelligent Travel Assistant AI built using **LangChain** and **Google Gemini 1.5 Flash**, deployed via **Streamlit**. It helps users:

* 🧭 Get **real-time weather info** for any city
* 📍 Discover **top tourist attractions** instantly

---

## 🧠 Features

* 🌤️ **Custom Weather Tool** – fetches current temperature and forecast
* 🗺️ **Top Attractions Finder** – scrapes top places using DuckDuckGo Search
* 🤖 **Tool Calling Agent** – built using `create_tool_calling_agent`
* 🖥️ **Streamlit Interface** – easy-to-use chatbot interface
* 💡 Powered by **Gemini 1.5 Flash** via LangChain

---

## 🏗️ Architecture

```bash
travel_assistant_ai/
│
├── app.py                   # Main Streamlit frontend
├── agent.py                 # LangChain agent logic (all-in-one)
├── .env                     # API keys
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd travel_assistant_ai
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Add your API keys

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Make sure `.env` is included in `.gitignore`.

### 4. Run the app

```bash
streamlit run app.py
```

App runs at `http://localhost:8501`.

---

## 💬 How It Works

1. **User enters a query** like:

   > "What’s the weather in Tokyo? Also suggest some places to visit."

2. The **LangChain agent** activates:

   * Uses custom `@tool` for weather
   * Calls DuckDuckGo for top 5 attractions
   * Returns a smart, conversational response

3. **Streamlit** displays the response in real time.

---

## 🛡️ Security Notes

* Do **not** expose your `.env` file or `GEMINI_API_KEY`.
* All tool calls are sandboxed; no user input directly touches APIs.

---

## 🧪 Example Queries

```text
1. What’s the weather in Chennai?
2. Show me 3 tourist attractions in Rome.
3. Weather and places to visit in Paris today?
```

---

## 🧾 Requirements

Contents of `requirements.txt`:

```
langchain
google-generativeai
streamlit
python-dotenv
duckduckgo-search
```
