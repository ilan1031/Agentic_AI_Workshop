# 🤖 Smart Health Assistant

An intelligent multi-agent assistant that creates a **personalized health plan** including:
- ✅ BMI analysis and health recommendations
- 🥗 Meal plans tailored to your dietary preferences
- 🏋️ Workout schedules based on your age, gender, and BMI

All powered by **Google Gemini 1.5 Flash** and **Microsoft AutoGen** with a slick **Streamlit UI**.

---

## 🌟 Features

- **Conversational Multi-Agent System** (AutoGen):
  - `BMI Agent`: Calculates BMI and gives personalized health advice.
  - `Diet Planner`: Crafts meal plans based on BMI and user preferences.
  - `Workout Scheduler`: Generates a 7-day workout schedule.
  - `User Proxy`: Orchestrates all agents and user data.
- **Streamlit UI** for easy use and results download.
- **Gemini 1.5 Flash** for fast, free LLM reasoning.

---

## 🛠️ Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
2. Get Your Gemini API Key
Go to Google AI Studio

Copy your key.

3. Run the app
bash
Copy
Edit
streamlit run app.py
🧪 How It Works
User enters basic health data and preferences.

UserProxyAgent sends the input to all agents.

Each agent performs its task:

BMI_Agent → BMI + health suggestions.

Diet_Planner → Meal plan generation.

Workout_Scheduler → Weekly workout based on diet and BMI.

Results are displayed and downloadable in the UI.

🔐 Security
API keys are entered securely in the UI.

.env and cache files should be excluded via .gitignore.

