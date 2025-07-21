
## 🧠 Python Code Debugging Assistant (Gemini + CrewAI + Streamlit)

A **secure, agentic AI-powered Python code reviewer and fixer** that:

* Uses **Google Gemini 1.5 Flash** for language understanding.
* **Does not execute any code** – static analysis only.
* Uses **CrewAI** to orchestrate agents for analysis, correction, and review.
* Built with a clean **Streamlit UI** for local or cloud-based interaction.

---

### 🚀 Features

✅ **No Code Execution:** Uses `AST` to perform safe analysis without running the code.
✅ **Google Gemini LLM** for intelligent issue descriptions and corrections.
✅ **Multi-Agent System** using `CrewAI` – Analyzer, Fixer, and Manager agents.
✅ **Streamlit Interface** – Paste code, hit analyze, get explanations and fixed code.
✅ **Explainable Output** – Justifications from both static checks and LLM suggestions.
✅ **Plug & Play** – Works locally with `.env` setup, no database or server needed.

---

### 📁 File Structure

```
.
├── app.py                 # Streamlit UI + CrewAI logic
├── .env                   # Your Gemini API key
├── requirements.txt       # All required Python packages
└── README.md              # This documentation
```

---

### 🧑‍💻 How It Works

1. User pastes Python code into Streamlit.
2. Agent 1 (`code_analyzer`) uses AST to scan for static issues (e.g. `print()`, `bare except:`).
3. Agent 2 (`code_corrector`) uses Gemini to fix only the identified issues.
4. Agent 3 (`manager`) oversees and coordinates results.
5. Fixed code and diagnostics are displayed in the browser.

---

### 📦 Installation

#### 1. Clone the Repo

```bash
git clone https://github.com/your-username/python-debug-agent.git
cd python-debug-agent
```

#### 2. Install Requirements

```bash
pip install -r requirements.txt
```

#### 3. Set Up API Key

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

You can get a free Gemini API key from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

### 🖥️ Usage

```bash
streamlit run app.py
```

Visit `http://localhost:8501` in your browser.

---

### 🧪 Sample Code to Test

```python
def divide(a, b):
    try:
        return a / b
    except:
        print("Error occurred")
```

✅ This will be flagged for:

* Bare `except:` block
* Use of `print()` in error handling

---

### 🛡️ Limitations

* ❌ Does **not execute code**
* ✅ Supports only **Python** input
* ❌ No live code suggestions (not a VS Code extension – yet!)

---

### 🤖 Powered By

* [🧠 CrewAI](https://github.com/joaomdmoura/crewAI)
* [🔗 LangChain](https://www.langchain.com/)
* [🌐 Gemini 1.5 Flash API](https://aistudio.google.com/app/apikey)
* [📊 Streamlit](https://streamlit.io/)

---

### 📄 License

MIT License. Use at your own risk. Do not use for untrusted or sensitive code.

---
