from flask import Flask, jsonify, request
import os
import json
from openai import OpenAI

app = Flask(__name__)

@app.route('/', methods=['POST'])
@app.route('/api/index.py', methods=['POST'])
def handler():
    try:
        data = request.get_json()
        receta_info = data.get('receta', '')

        prompt = f"""
        Eres un asistente de cocina. Genera una ficha técnica detallada para: {receta_info}.
        Sigue el formato estándar de fichas técnicas gastronómicas.
        """

        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un chef profesional y experto en fichas técnicas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )

        return jsonify({"ficha": response.choices[0].message.content}), 200

    except Exception as e:
        return jsonify({"error": f"Error interno: {str(e)}"}), 500