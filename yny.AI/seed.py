from dotenv import load_dotenv
import google.generativeai as genai
import psycopg2
import os

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

manual_text = """
Maintenance Manual for PUMP-CENT-001:
Section 4: Troubleshooting
Issue: Crackling noise (like marbles/gravel).
Diagnosis: Pump is experiencing cavitation due to low Net Positive Suction Head (NPSH).
Action: Immediately throttle the discharge valve to reduce flow rate, or increase suction tank level. Check housing bolts and torque to 45 Nm.
"""

print("Embedding text via Gemini Embedding 1...")
embedding_result = genai.embed_content(
    model="gemini-embedding-001",
    content=manual_text,
    output_dimensionality=768  # Set to 768 dimensions
)
vector = embedding_result['embedding']

print("Saving to PostgreSQL...")
conn = psycopg2.connect(os.getenv("DB_URL"))
cur = conn.cursor()
cur.execute(
    "INSERT INTO manual_knowledge (product_code, section_title, text_chunk, embedding) VALUES (%s, %s, %s, %s)",
    ('PUMP-CENT-001', 'Troubleshooting: Noise', manual_text, vector)
)
conn.commit()
print("Vector Seeded Successfully!")
cur.close()
conn.close()