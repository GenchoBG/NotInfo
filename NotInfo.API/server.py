from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
from binaryclassification import PropagandaDetector, TextPreprocessor
from tensorflow.keras.backend import set_session
import tensorflow as tf

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = '*'

graph = tf.get_default_graph()
sess = tf.Session()
set_session(sess)

textPreprocessor = TextPreprocessor()
textPreprocessor.load_sequence_tokenizer('./models/sequence_tokenizer.pickle')
detector = PropagandaDetector(textPreprocessor, './models/detector')

propagandaResult = {'confidence': 0.9969, 'result': True}

@app.route('/detectpropaganda', methods = ['POST'])
def detect_propaganda():
	global graph
	global sess
	with graph.as_default():
		set_session(sess)
		text_to_analyze = request.data.decode('ISO-8859-1')
		print(text_to_analyze)
		result, confidence = detector.detect_propaganda(text_to_analyze)
		propagandaResult = {'confidence': confidence, 'result': result}
		print(propagandaResult)
		return jsonify(propagandaResult)

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    return response

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=80, debug = False)
