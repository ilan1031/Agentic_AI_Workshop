
### 🧠 Multi-Agent Research and Summarization Assistant

A fully agentic app that intelligently routes your question to web search, your uploaded documents, or direct LLM reasoning—then summarizes the answer for clarity.

---

## 🚀 Features

* ✅ **Multi-Agent Pipeline** (LangGraph)

  * Router → Web Search / RAG / LLM → Summarizer
* 📄 **Document Uploads**

  * Supports `.pdf`, `.docx`, and `.txt` in `rag/` folder
* 🔎 **Web Search Agent**

  * Uses DuckDuckGo for real-time data
* 🤖 **LLM Agent**

  * Gemini 1.5 Flash for direct answers & summaries
* 📘 **RAG Agent**

  * Vector-based retrieval using FAISS from your files
* 💬 **Summarizer Agent**

  * AI summarization of all final outputs
* 🌐 **Streamlit UI**

  * Clean, user-friendly question box with real-time results

---

## 🛠 How It Works

### 🧠 Agents

| Agent            | Role                                                     |
| ---------------- | -------------------------------------------------------- |
| Router Agent     | Determines whether to use Web Search, RAG, or direct LLM |
| Web Agent        | Searches the web using DuckDuckGo                        |
| RAG Agent        | Retrieves from local documents using FAISS + embeddings  |
| LLM Agent        | Directly queries Gemini LLM                              |
| Summarizer Agent | Summarizes the output for clarity and conciseness        |

---

## 📂 Folder Structure

```
multi-agent-research/
├── app.py              # Streamlit app + LangGraph logic
├── rag/                # Place PDFs, DOCX, TXT files here
├── .env                # API key config
├── requirements.txt    # Python dependencies
└── README.md           # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/multi-agent-research.git
cd multi-agent-research
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

If needed, install manually:

```bash
pip install streamlit langchain langgraph pdfplumber python-docx faiss-cpu \
    google-generativeai duckduckgo-search python-dotenv
```

### 3. Add API Key

Create a `.env` file:

```env
GOOGLE_API_KEY=your_gemini_api_key
```

Get your key from [Google AI Studio](https://makersuite.google.com/app)

---

## 📄 Add Your Documents

Place your custom knowledge files into the `rag/` folder. Supported formats:

* `.pdf`
* `.docx`
* `.txt`

These will be automatically parsed and embedded into a vector store.

---

## ▶️ Run the App

```bash
streamlit run app.py
```

Then open the local URL (usually `http://localhost:8501`).

---

## 🧪 Example Queries

* "What is LangGraph?"
* "Summarize my training manuals."
* "Give updates on generative AI from the web."
* "Explain warehouse optimization based on my documents."

---

## 🔐 Notes

* All document embeddings are stored in-memory via FAISS
* Summarization uses Gemini for all agent output
* Make sure your `.env` is excluded from Git (`.gitignore`)
* Works fully offline if no web search is needed

---

## 📃 License

MIT License — Free to use and extend.

---

## 🙌 Credits

* [LangChain](https://www.langchain.com/)
* [LangGraph](https://github.com/langchain-ai/langgraph)
* [Google Gemini](https://ai.google.dev/)
* [DuckDuckGo Search API](https://duckduckgo.com/)
* [Streamlit](https://streamlit.io/)

---
