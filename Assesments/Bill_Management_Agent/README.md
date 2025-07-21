# 🧾 AI Bill Management Agent

An intelligent, AI-powered expense extraction and analysis app built with **Google Gemini Vision**, **AutoGen agents**, and **Streamlit**. Upload a bill image (JPG/PNG) and let the multi-agent system extract, categorize, and summarize your expenses for smarter budgeting and financial insights.

---

## 📌 Features

* **🖼️ Bill Image Processing (OCR)**
  Upload a photo or scanned copy of your bill. Gemini Vision will extract item names and costs.

* **🧠 Automatic Categorization**
  AI categorizes expenses into:

  * Groceries
  * Dining
  * Utilities
  * Shopping
  * Entertainment
  * Others

* **📊 Expense Summarization**
  Summarizes:

  * Total spending
  * Category-wise expenditure
  * Highlights highest or unusual spending categories

* **🤖 Multi-Agent AI (AutoGen)**
  A team of collaborative agents simulates:

  * `BillProcessingAgent`: Categorizes the bill
  * `ExpenseSummarizationAgent`: Summarizes and analyzes trends

* **🧵 Chat Logs**
  See the agent interaction history for transparency and audit.

* **🧑‍💻 Built with Streamlit**
  Fast, responsive, and clean user interface for a smooth experience.

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Assesments/Bill_Management_Agent
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Your `requirements.txt` should contain:

```txt
streamlit
pillow
python-dotenv
google-generativeai
autogen
```

### 3. Set up Google Gemini API Key

> 📌 Sign up at [Google AI Studio](https://makersuite.google.com/app) to get your Gemini API key.

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## ▶️ Usage

Run the app with:

```bash
streamlit run app.py
```

### In your browser:

1. Upload a **bill image** (JPG or PNG).
2. Wait for the AI to:

   * Extract expenses
   * Categorize them
   * Summarize and analyze spending trends
3. View:

   * **Categorized Expenses**
   * **Markdown-formatted Financial Summary**
   * **Agent Conversation Logs**

---

## 🧠 How It Works

1. **Gemini Vision**:

   * Receives the uploaded bill image
   * Extracts item names and prices
   * Groups them into predefined categories

2. **AutoGen Agents**:

   * `UserProxyAgent`: Orchestrates communication
   * `BillProcessingAgent`: Processes and validates categories
   * `ExpenseSummarizationAgent`: Analyzes and summarizes expense trends

3. **Streamlit Frontend**:

   * Displays categorized data, summary, and chat history

---

## 🔐 Security

* Never hardcode your API key.
* Store it in a `.env` file (excluded in `.gitignore`).
* Never upload your `.env` or environment files to public repos.

---

## 📄 License

MIT License

---

## 🙌 Credits

* **Google Gemini** – OCR and LLM processing
* **AutoGen by Microsoft** – Multi-agent conversation framework
* **Streamlit** – UI/UX for quick web app development

