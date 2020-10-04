from flask import Flask, request, Response, jsonify
from flask_cors import CORS, cross_origin
#from tensorflow.keras.backend import set_session
import tensorflow as tf
from tensorflow.keras.models import load_model
import re

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = '*'

#graph = tf.get_default_graph()
#sess = tf.Session()
#set_session(sess)

model = load_model("./models/google-universal-sentence-encoder-finetuned/")

threshhold = 0.7

@app.route('/detectpropaganda', methods = ['POST'])
def detect_propaganda():
	#global graph
	#global sess
	#with graph.as_default():
		#set_session(sess)
		
	text = request.data.decode("utf-8")

	sentences = re.split('\?|\.|!|\n', text)
	print(sentences)
	
	confidences = model.predict(sentences).ravel()
	
	resultSentences = []
	for i in range(len(sentences)):
		if confidences[i] >= threshhold:
			resultSentences.append(sentences[i])
	
	
	print(confidences)
	
	return jsonify(resultSentences)

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', '*')
    return response

if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=80, debug = False)
