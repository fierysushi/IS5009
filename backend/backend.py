import json
import pandas as pd
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/calculate', methods=['POST'])
def calculate():
    file = request.files['data']
    df = pd.read_csv(file)
    print(df.head())
   
    return {'data': '$50.05'}

if __name__ == "__main__":
    app.run(host='localhost', port=5000, debug=True)