# 🚚 AI-Powered Logistics Optimization using CrewAI + Gemini + Streamlit

This project uses **CrewAI** agents powered by **Google Gemini** to perform logistics performance analysis and strategy generation through a simple and elegant **Streamlit interface**. It helps businesses analyze supply chain inefficiencies and produce AI-driven optimization strategies.

---

## 🔧 Features

- ✅ Gemini Pro (`gemini-1.5-flash`) for real-time reasoning
- ✅ 2 specialized CrewAI agents: *Logistics Analyst* and *Optimization Strategist*
- ✅ Beautiful and interactive **Streamlit UI**
- ✅ Custom inputs: products, warehouse locations, and time range
- ✅ Step-by-step agent-based logistics strategy generation
- ✅ Easy-to-run, no complex setup required

---

## 🧠 Agents

### 1. **Logistics Analyst**
- **Goal**: Analyze delivery performance, warehouse turnover, and route efficiency.
- **Backstory**: Veteran supply chain analyst with deep knowledge in logistics KPIs and operational flow.

### 2. **Optimization Strategist**
- **Goal**: Build an actionable strategy based on the analyst's report.
- **Backstory**: A senior strategist specializing in cost reduction and warehouse-routing optimization.

---

## 💻 Streamlit UI

- Input:
  - 🛒 Product names (comma-separated)
  - 📦 Warehouse or store locations
  - 📆 Time range (7/30/90 days or custom)
- Output:
  - 📊 Logistics performance analysis
  - 📈 AI-generated strategy recommendations
  - 🔍 Agent roles and thought process

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/logistics-crewai-optimizer.git
cd logistics-crewai-optimizer
2. Install dependencies

pip install -r requirements.txt
3. Set your Gemini API key
Create a .env file in the root directory:


GEMINI_API_KEY=your_gemini_api_key_here
4. Run the app

streamlit run app.py
🧾 Example Inputs
Products: Laptop, Smartphone, Router

Locations: Warehouse A, Warehouse B

Time Range: Last 30 days

📦 Folder Structure

├── app.py               # Streamlit UI + CrewAI logic
├── .env                 # Gemini API key
├── requirements.txt     # Python dependencies
└── README.md            # Project documentation
🔐 Gemini API Note
You’ll need a valid Google Generative AI key. Add it in the .env file.

📍 Roadmap
 Add PDF report export

 Enable memory for agent context tracking

 Add vector store (Chroma/MongoDB) for advanced historical knowledge

👨‍💻 Author
Built by [Your Name] — powered by 🧠 CrewAI + 🌐 Google Gemini + 📊 Streamlit.

📜 License
MIT License — free to use and modify.

