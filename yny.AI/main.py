from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_google_vertexai import VertexAIEmbeddings, VertexAI
from dotenv import load_dotenv
import psycopg2
import vertexai
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# 1. Initialize Google AI
vertexai.init(project=os.getenv("GCP_PROJECT_ID"), location=os.getenv("GCP_LOCATION"))

# 2. Define our Gemini Models
embed_model = VertexAIEmbeddings(model_name="gemini-embeddings-1")
llm = VertexAI(model_name="gemini-3.1-flash-lite-preview", temperature=0.2)
DB_URL = os.getenv("DB_URL")

@app.get("/ai/troubleshoot")
async def troubleshoot(question: str, product_code: str):
    try:
        # Step A: Convert the user's question into a mathematical vector
        query_vector = embed_model.embed_query(question)
        
        # Step B: Search Postgres using pgvector (Cosine Distance <=>)
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        # Find the top 3 most relevant manual chunks
        query = """
            SELECT text_chunk FROM manual_knowledge 
            WHERE product_code = %s 
            ORDER BY embedding <=> %s::vector LIMIT 3
        """
        cur.execute(query, (product_code, query_vector))
        results = cur.fetchall()
        cur.close()
        conn.close()

        # Combine the retrieved text
        context = "\n".join([row[0] for row in results]) if results else "No manual found."

        # Step C: The Prompt Injection
        prompt = f"""
        You are an expert industrial maintenance AI for YNY Technology.
        Use ONLY the following manual excerpt to answer the user's question.
        
        Manual Excerpt: {context}
        User Question: {question}
        
        Provide a concise, safe, and professional engineering resolution.
        """
        
        # Step D: Generate the Answer
        response = llm.invoke(prompt)
        return {"answer": response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))