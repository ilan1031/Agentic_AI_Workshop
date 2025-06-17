from flask import Flask, request, jsonify
from agent.agent import run_agent
import json, os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

@app.route("/api/compliance", methods=["POST"])
def compliance():
    transactions = request.json.get("transactions", [])
    result = run_agent(transactions)
    return jsonify({"result": result})

@app.route("/api/rules", methods=["GET"])
def rules():
    with open("rulebook.json") as f:
        return jsonify(json.load(f))

if __name__ == "__main__":
    app.run(port=5000)
