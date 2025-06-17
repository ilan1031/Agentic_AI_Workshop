from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import Tool, AgentExecutor, initialize_agent
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.2)

prompt = PromptTemplate.from_template(
    "Given this transaction data: {data}, check for any Indian tax violations and summarize findings."
)
chain = LLMChain(llm=llm, prompt=prompt)

tools = [Tool(name="TaxComplianceChecker", func=chain.run, description="Checks Indian tax violations")]

agent = initialize_agent(tools, llm, agent="zero-shot-react-description", verbose=True)

def run_agent(data):
    return agent.run(data)
