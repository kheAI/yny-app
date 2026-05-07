from langchain_google_vertexai import VertexAIEmbeddings
from dotenv import load_dotenv
import psycopg2
import vertexai
import os

load_dotenv()
vertexai.init(project=os.getenv("GCP_PROJECT_ID"), location=os.getenv("GCP_LOCATION"))
embed_model = VertexAIEmbeddings(model_name="gemini-embedding-001")

manual_text = """
Maintenance Manual for PUMP-CENT-001:
Section 4: Troubleshooting
Issue: Crackling noise (like marbles/gravel).
Diagnosis: Pump is experiencing cavitation due to low Net Positive Suction Head (NPSH).
Action: Immediately throttle the discharge valve to reduce flow rate, or increase suction tank level. Check housing bolts and torque to 45 Nm.
"""

print("Embedding text via Gemini...")
vector = embed_model.embed_query(manual_text)

print("Saving to PostgreSQL...")
conn = psycopg2.connect(os.getenv("DB_URL"))
cur = conn.cursor()
cur.execute(
    "INSERT INTO manual_knowledge (product_code, section_title, text_chunk, embedding) VALUES (%s, %s, %s, %s)",
    ('PUMP-CENT-001', 'Troubleshooting: Noise', manual_text, vector)
)
conn.commit()
print("Vector Seeded Successfully!")