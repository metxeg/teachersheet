from flask import Flask, jsonify, request
import os
import json
from openai import OpenAI

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
@app.route('/api/index.py', methods=['GET', 'POST'])
@app.route('/api', methods=['POST'])
def handler():
    try:
        # Verificar que sea POST
        if request.method == 'GET':
            return jsonify({"error": "Esta ruta requiere POST"}), 405
            
        # Obtener los datos JSON
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se recibieron datos JSON"}), 400
            
        receta_info = data.get('receta', '')
        if not receta_info:
            return jsonify({"error": "Falta el campo 'receta'"}), 400

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
