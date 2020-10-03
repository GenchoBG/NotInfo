from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
import random

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = '*'

@app.route('/detectpropaganda', methods = ['POST'])
def detect_propaganda():
	confidence = random.uniform(0, 1)
	propagandaResult = {'confidence': confidence, 'result': True if confidence >= 0.5 else False}
	return jsonify(propagandaResult)

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    return response

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=80, debug = False)