from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from langchain_google_vertexai import VertexAIEmbeddings
import psycopg2
import vertexai
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# Initialize APIs
vertexai.init(project=os.getenv("GCP_PROJECT_ID"), location=os.getenv("GCP_LOCATION"))
embed_model = VertexAIEmbeddings(model_name="text-embedding-004")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
llm = genai.GenerativeModel("gemini-3.1-flash-lite-preview")

DB_URL = os.getenv("DB_URL")

@app.get("/")
def root():
    return {"status": "AI API running"}

@app.get("/troubleshoot")
async def troubleshoot(question: str, product_code: str):
    try:
        if not question or not product_code:
            raise HTTPException(status_code=400, detail="Missing question or product_code")
        
        # Step A: Convert question to vector using Vertex AI Embeddings
        query_vector = embed_model.embed_query(question)
        
        # Step B: Search Postgres using pgvector
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        query = """
            SELECT text_chunk FROM manual_knowledge 
            WHERE product_code = %s 
            ORDER BY embedding <=> %s::vector LIMIT 3
        """
        cur.execute(query, (product_code, query_vector))
        results = cur.fetchall()
        cur.close()
        conn.close()

        context = "\n".join([row[0] for row in results]) if results else "No manual found."

        # Step C: Generate answer with Gemini API (free tier)
        prompt = f"""
        You are an expert industrial maintenance AI for YNY Technology.
        Use ONLY the following manual excerpt to answer the user's question.
        
        Manual Excerpt: {context}
        User Question: {question}
        
        Provide a concise, safe, and professional engineering resolution.
        """
        
        response = llm.generate_content(prompt)
        return {"answer": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)