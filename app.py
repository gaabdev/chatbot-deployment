from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response  # Importe a função get_response aqui

app = Flask(__name__)
CORS(app)

@app.route("/")
def index_get():
    return render_template("base.html")

@app.route("/predict", methods=["POST"])
def predict():
    text = request.get_json().get("message")

    app.logger.info(f"Received message: {text}")

    # TODO: verificar se o texto é válido

    response = get_response(text)  # Certifique-se de que a função está corretamente importada
    message = {"answer": response}

    app.logger.info(f"Sending response: {response}")

    response = jsonify(message)
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response

if __name__ == "__main__":
    app.run(debug=True)
