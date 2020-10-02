from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = '*'

propagandaResult = {'confidence': 0.9969, 'result': True}

@app.route('/detectpropaganda', methods = ['POST'])
def detect_propaganda():
    return jsonify(propagandaResult)

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    return response

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=80, debug = False)
