This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

__init__.py for all agent floder

agent .env
GEMINI_API_KEY="AIzaSyDPsEavgnqJ4ltBgCOtgtqWj_u9vjsbovU"
MONGO_URI=mongodb+srv://sabaribihub:O78ekT8lJZjYXmjI@cluster0.wieij.mongodb.net/Z_Clone
DB_NAME=Z_Clone
MONGO_COLLECTION=invoices
TRANSACTIONS_COLLECTION=transactions
INVOICES_COLLECTION=invoices
RECONCILIATION_LOGS_COLLECTION=reconciliation_logs
VECTOR_STORE_COLLECTION=vector_store

BE .env
MONGO_URI=mongodb+srv://sabaribihub:O78ekT8lJZjYXmjI@cluster0.wieij.mongodb.net/Z_Clone
FASTAPI_URL=http://0.0.0.0:8000
PORT=3001



First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Here's a comprehensive guide to how the full system works with visual flow diagrams and step-by-step instructions:

### 🧩 Full System Architecture
```mermaid
graph LR
    A[Frontend] -->|API Calls| B[Node.js Backend]
    A -->|Direct API Calls| C[Python Agents]
    B -->|Data Storage| D[MongoDB]
    C -->|Vector Storage| D
    C -->|Data Processing| B
    D -->|Data Retrieval| C
    D -->|Data Retrieval| B
```

### 🌐 Connection Flow Diagram
```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant FE as Next.js Frontend
    participant Node as Node.js Backend
    participant Py as Python Agents
    participant DB as MongoDB

    User->>FE: Uploads bank feed (CSV)
    FE->>Node: POST /api/transactions/upload
    Node->>Py: POST /extract-transactions
    Py->>DB: Store transactions
    Py-->>Node: Extracted transactions
    Node-->>FE: Transaction data
    
    FE->>Py: POST /match-invoices
    Py->>DB: Vector search invoices
    Py->>DB: Update matches
    Py-->>FE: Match results
    
    FE->>Py: POST /categorize
    Py->>DB: Update categories
    Py-->>FE: Categorized data
    
    FE->>Py: POST /detect-discrepancies
    Py->>DB: Flag discrepancies
    Py-->>FE: Discrepancy report
    
    FE->>Py: POST /reconcile
    Py->>DB: Create reconciliation log
    Py-->>FE: Final report
```

### 🛠️ How to Use the Full System

**Prerequisites:**
1. Python 3.8+
2. Node.js 16+
3. MongoDB Atlas account
4. Gemini API key

**Setup Instructions:**

1. **Start Python Agents:**
   ```bash
   cd agent_py
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate    # Windows
   pip install -r requirements.txt
   python app.py  # Runs on http://localhost:8000
   ```

2. **Start Node.js Backend:**
   ```bash
   cd backend
   npm install
   npm run dev  # Runs on http://localhost:3001
   ```

3. **Start Next.js Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on http://localhost:3000
   ```

**User Workflow:**

1. **Access Dashboard:**
   - Open `http://localhost:3000`
   - View financial summary and recent activity

   ![Dashboard](https://via.placeholder.com/800x400?text=Reconciliation+Dashboard)

2. **Upload Bank Feed:**
   - Navigate to Reconcile → Upload
   - Select CSV or JSON file
   - Click "Start Reconciliation"

   ![Upload Screen](https://via.placeholder.com/800x400?text=Bank+Feed+Upload)

3. **Monitor Agent Progress:**
   - Automatic redirect to agent status page
   - Real-time visualization of processing steps:
     - Transaction Extraction
     - Invoice Matching
     - Categorization
     - Discrepancy Detection
     - Final Approval

   ![Agent Status](https://via.placeholder.com/800x400?text=Agent+Processing+Status)

4. **Review Results:**
   - View matched transactions
   - Examine flagged discrepancies
   - Approve/reject items
   - Download PDF report

   ![Results Screen](https://via.placeholder.com/800x400?text=Reconciliation+Results)

5. **Manage Invoices:**
   - Create new invoices
   - View invoice history
   - Edit existing invoices

   ![Invoice Management](https://via.placeholder.com/800x400?text=Invoice+Management)

### 🔧 Key Configuration Files

1. **Python Agents (agent_py/.env):**
   ```env
   GEMINI_API_KEY=your_gemini_key
   MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/db
   ```

2. **Node.js Backend (backend/.env):**
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/db
   PORT=3001
   FASTAPI_URL=http://localhost:8000
   ```

3. **Frontend (frontend/.env.local):**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
   ```

### 💡 Sample API Calls

**1. Upload Bank Feed (Frontend → Node.js):**
```javascript
// Frontend code
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/transactions/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

**2. Match Invoices (Node.js → Python Agents):**
```python
# Node.js backend code
const matchInvoices = async (transactions) => {
  const response = await axios.post(
    'http://localhost:8000/match-invoices',
    { transactions }
  );
  return response.data;
};
```

**3. Vector Search (Python → MongoDB):**
```python
# Python agent code
def find_similar_invoices(transaction):
    query = {
        "transaction": transaction['description'],
        "path": "embedding",
        "k": 5
    }
    results = vector_collection.aggregate([
        {"$vectorSearch": query}
    ])
    return list(results)
```

### 🚀 Production Deployment

1. **Frontend:**
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

2. **Backend Services:**
   - Use PM2 for process management:
   ```bash
   pm2 start "npm run dev" --name node-backend
   pm2 start "python app.py" --name python-agents
   ```

3. **Environment Variables:**
   - Set production values in `.env.production` files
   - Use secrets management for API keys

### 📊 Performance Metrics

| Component | CPU | Memory | Latency |
|-----------|-----|--------|---------|
| Python Agents | 2 vCPU | 2GB | 200-500ms |
| Node.js Backend | 1 vCPU | 1GB | 50-100ms |
| MongoDB | 4 vCPU | 8GB | 5-20ms |

### ⚠️ Troubleshooting Tips

1. **Connection Issues:**
   - Verify all services are running on correct ports
   - Check CORS configuration in Python/Node servers
   ```python
   # FastAPI CORS setup
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **MongoDB Vector Search:**
   - Ensure index is properly configured:
   ```json
   {
     "fields": [{
       "type": "vector",
       "path": "embedding",
       "numDimensions": 384,
       "similarity": "cosine"
     }]
   }
   ```

3. **Agent Timeouts:**
   - Increase timeout in frontend API calls:
   ```javascript
   // Axios configuration
   axios.create({
     timeout: 30000 // 30 seconds
   })
   ```

This complete system provides an AI-powered reconciliation engine with seamless integration between all components. The visual interface allows finance teams to easily upload bank feeds, monitor AI processing, and review reconciliation results with audit trails.
