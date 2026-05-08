import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function App() {
  const [products, setProducts] = useState([])
  const [question, setQuestion] = useState("")
  const [aiAnswer, setAiAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const ERP_API = import.meta.env.VITE_ERP_API || 'https://erp-api-158766252751.us-central1.run.app'
  const AI_API = import.meta.env.VITE_AI_API || 'https://ai-api-158766252751.us-central1.run.app'

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
    <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#0056b3' }}>Y&Y SaaS Dashboard</h1>
      
      <h3>1. Live ERP Inventory: .NET Core (C#) + CloudSQL (PostgreSQL)</h3>
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

      <h3>2. AI Domain Expert Agent: FastAPI (Python) + Gemma (Gemini)</h3>
      <div style={{ padding: '1.5rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fafafa' }}>
        <p><strong>Target Equipment:</strong> PUMP-CENT-001</p>
        <input 
          type="text" 
          value={question} 
          onChange={e => setQuestion(e.target.value)} 
          placeholder="e.g., Why is the pump sounding like gravel?" 
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <button 
          onClick={() => askAI('PUMP-CENT-001')} 
          disabled={loading} 
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem' }}>
          {loading ? "Analyzing Manuals..." : "Consult AI"}
        </button>
        
        {aiAnswer && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eef6ff', borderLeft: '4px solid #0056b3', borderRadius: '4px' }}>
            <strong style={{ fontSize: '1.1rem', color: '#0056b3' }}>YNY Tech Agent:</strong>
            <div style={{ marginTop: '1rem', lineHeight: '1.8', textAlign: 'left' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p style={{ marginBottom: '1rem', textAlign: 'left' }} {...props} />,
                  h1: ({ node, ...props }) => <h2 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#0056b3' }} {...props} />,
                  h2: ({ node, ...props }) => <h3 style={{ marginTop: '1.2rem', marginBottom: '0.4rem', color: '#0056b3' }} {...props} />,
                  h3: ({ node, ...props }) => <h4 style={{ marginTop: '1rem', marginBottom: '0.3rem', color: '#0056b3' }} {...props} />,
                  strong: ({ node, ...props }) => <strong style={{ color: '#d9534f', fontWeight: 'bold' }} {...props} />,
                  em: ({ node, ...props }) => <em style={{ fontStyle: 'italic', color: '#666' }} {...props} />,
                  ul: ({ node, ...props }) => <ul style={{ marginLeft: '1.5rem', marginTop: '0.8rem', marginBottom: '0.8rem', textAlign: 'left' }} {...props} />,
                  ol: ({ node, ...props }) => <ol style={{ marginLeft: '1.5rem', marginTop: '0.8rem', marginBottom: '0.8rem', textAlign: 'left' }} {...props} />,
                  li: ({ node, ...props }) => <li style={{ marginBottom: '0.6rem', textAlign: 'left' }} {...props} />,
                  code: ({ node, ...props }) => <code style={{ backgroundColor: '#f4f4f4', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace', color: '#d9534f' }} {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote style={{ borderLeft: '4px solid #0056b3', paddingLeft: '1rem', marginLeft: 0, marginTop: '0.8rem', marginBottom: '0.8rem', color: '#666' }} {...props} />,
                  hr: ({ node, ...props }) => <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} {...props} />,
                }}
              >
                {aiAnswer}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App