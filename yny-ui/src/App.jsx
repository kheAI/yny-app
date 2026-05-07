import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [question, setQuestion] = useState("")
  const [aiAnswer, setAiAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  // NOTE: Update these URLs once deployed to Google Cloud Run!
  const ERP_API = 'https://erp-api-158766252751.us-central1.run.app'
  const AI_API = 'https://ai-api-158766252751.us-central1.run.app'

  useEffect(() => {
    axios.get(`${ERP_API}/api/products`)
         .then(res => setProducts(res.data))
         .catch(err => console.error("ERP API not running", err))
  }, [])

  const askAI = async (productCode) => {
    if (!question) return;
    setLoading(true)
    try {
      const res = await axios.get(`${AI_API}/troubleshoot`, {
        params: { question, product_code: productCode }
      })
      setAiAnswer(res.data.answer)
    } catch (err) {
      setAiAnswer("Error reaching AI service.")
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px' }}>
      <h1 style={{ color: '#0056b3' }}>yny SaaS Dashboard</h1>
      
      <h3>1. Live ERP Inventory (.NET Core)</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Code</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Name</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Category</th>
            <th style={{ padding: '8px', borderBottom: '2px solid #ddd' }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.productCode}>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.productCode}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.productName}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{p.category}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #ddd', color: p.quantityInStock === 0 ? 'red' : 'green' }}>
                {p.quantityInStock}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: '2rem 0' }} />

      <h3>2. AI Domain Expert Agent (Python + Gemini 3.1 Flash)</h3>
      <div style={{ padding: '1.5rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fafafa' }}>
        <p><strong>Target Equipment:</strong> PUMP-CENT-001</p>
        <input 
          type="text" 
          value={question} 
          onChange={e => setQuestion(e.target.value)} 
          placeholder="e.g., Why is the pump sounding like gravel?" 
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={() => askAI('PUMP-CENT-001')} 
          disabled={loading} 
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? "Analyzing Manuals..." : "Consult AI"}
        </button>
        
        {aiAnswer && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eef6ff', borderLeft: '4px solid #0056b3' }}>
            <strong>YNY Tech Agent:</strong> <br/><br/> {aiAnswer}
          </div>
        )}
      </div>
    </div>
  )
}

export default App