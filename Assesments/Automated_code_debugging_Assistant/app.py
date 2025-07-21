import streamlit as st
from crewai import Agent, Task, Crew, Process, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import ast
from dotenv import load_dotenv

# ===== Load Environment Variables =====
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# ===== Static Code Analyzer (AST) =====
def analyze_python_code(code: str) -> str:
    """Perform static analysis using AST without executing code."""
    try:
        tree = ast.parse(code)
        issues = []

        # Check for print() usage
        if any(isinstance(node, ast.Call) and getattr(node.func, 'id', '') == 'print' for node in ast.walk(tree)):
            issues.append("⚠️ Found `print()` - Use logging in production.")

        # Check for bare `except:` blocks
        for node in ast.walk(tree):
            if isinstance(node, ast.ExceptHandler) and node.type is None:
                issues.append("⚠️ Found bare `except:` - Always specify exception types.")

        return "✅ No critical issues found." if not issues else "Found issues:\n" + "\n".join(issues)

    except SyntaxError as e:
        return f"❌ Syntax Error: {e.msg} (Line {e.lineno})"

# ===== Initialize Gemini LLM (via CrewAI) =====
llm = LLM(
    api_key=GEMINI_API_KEY,
    model="gemini/gemini-2.5-flash"
)

# ===== Define CrewAI Agents =====
code_analyzer = Agent(
    role="Python Static Analyzer",
    goal="Identify issues in Python code using AST",
    backstory="AST parsing expert, doesn't run the code but finds all the bad patterns.",
    llm=llm,
    verbose=True
)

code_corrector = Agent(
    role="Python Code Fixer",
    goal="Suggest PEP8-compliant fixes to code issues",
    backstory="Professional Python developer focused on static code improvement.",
    llm=llm,
    verbose=True
)

manager = Agent(
    role="Review Manager",
    goal="Oversee analysis and correction",
    backstory="Handles communication and coordinates the task flow.",
    llm=llm,
    verbose=True
)

# ===== Streamlit UI =====
st.set_page_config(page_title="Python Code Debugger", layout="centered")
st.title("🔍 Automated Code Debugging Assistant (No ONNX)")
st.markdown("Paste your Python code, and let the agents review & fix it without executing anything.")

code_input = st.text_area("✍️ Paste Python Code:", height=300)

if st.button("Analyze & Fix"):
    if not code_input.strip():
        st.warning("⚠️ Please paste some code before analyzing.")
    else:
        with st.spinner("🔎 Running static analysis and corrections..."):
            # AST Analysis
            static_analysis_result = analyze_python_code(code_input)

            # Task 1: Analyze Code
            analysis_task = Task(
                description=f"Perform a code review on the following snippet and return clear issues:\n```python\n{code_input}\n```",
                agent=code_analyzer,
                expected_output="List of issues found using static analysis."
            )

            # Task 2: Fix the issues found
            correction_task = Task(
                description="Correct the code based on the issues from the analyzer. Retain original logic. Fix only what’s flagged.",
                agent=code_corrector,
                expected_output="Fixed code with comments on each change.",
                context=[analysis_task]
            )

            # Define the Crew
            crew = Crew(
                agents=[code_analyzer, code_corrector, manager],
                tasks=[analysis_task, correction_task],
                process=Process.sequential,
                verbose=True
            )

            # Run the Crew
            result = crew.kickoff()

        # ===== Display Results =====
        st.subheader("🧠 Static AST Analysis")
        st.markdown(f"```\n{static_analysis_result}\n```")

        st.subheader("✅ Fixed Code (by Agents)")
        st.code(result, language="python")

        st.success("✅ Review completed!")
