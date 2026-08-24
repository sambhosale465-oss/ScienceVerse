from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/scientists")
def scientists():
    with open("data/scientists.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    return jsonify(data)
@app.route("/search", methods=["POST"])
def search_scientist():

    request_data = request.get_json()

    search_name = request_data["name"].strip().lower()

    with open("data/scientists.json", "r", encoding="utf-8") as file:

        scientists = json.load(file)

    for scientist in scientists["scientists"]:

        if scientist["name"].lower() == search_name:

            return jsonify(scientist)

    return jsonify({

        "error": "Scientist not found."

    })
@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    question = data["question"]

    return jsonify({

        "reply": f"You asked: {question}"

    })


if __name__ == "__main__":
    app.run(debug=True)