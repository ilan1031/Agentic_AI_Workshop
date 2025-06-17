import requests

# Fetch violations
res = requests.post("http://localhost:5000/api/compliance", json={"transactions": [{"amount": 10000}]})
summary = res.json().get("result", "No result.")

# Send email
requests.post("http://localhost:3001/send", json={
    "to": "ilanthalirs10@gmail.com",
    "subject": "Tax Compliance Report",
    "text": summary
})
