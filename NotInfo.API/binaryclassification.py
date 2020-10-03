import os
import pandas as pd
import pickle
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score, confusion_matrix
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential, load_model
from keras.layers import Embedding, LSTM, Bidirectional, GlobalMaxPool1D, Dense, Dropout

class TextPreprocessor():
    def __init__(self):
        # clean_text helpers
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = stopwords.words("english")
        self.vectorizer = CountVectorizer()
        self.cvecTtokenizer = self.vectorizer.build_tokenizer()
        # prepare_for_model helpers
        self.max_features = 6000 # I pulled this out of my ass
        self.max_sequence_length = 348 # I also pulled this out of my ass
        self.sequence_tokenizer = Tokenizer(num_words = self.max_features)
        
    def clean_text(self, text):
        # Remove special chars and punctuation
        text = " ".join(self.cvecTtokenizer(text))
        # lowcase
        text = text.lower()
        # Lematize
        text = [self.lemmatizer.lemmatize(token) for token in text.split(" ")]
        text = [self.lemmatizer.lemmatize(token, "v") for token in text]
        # Remove stopwords
        text = [word for word in text if not word in self.stop_words]

        text = " ".join(text)
        return text
    
    def prepare_for_model(self, text):
        return pad_sequences(self.sequence_tokenizer.texts_to_sequences(text), maxlen = self.max_sequence_length)
    
    def fit_sequence_tokenizer(self, texts_to_fit):
        self.sequence_tokenizer.fit_on_texts(texts_to_fit)
        
    def save_sequence_tokenizer(self, path):
        with open(path, 'wb') as handle:
            pickle.dump(self.sequence_tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
            
    def load_sequence_tokenizer(self, path):
        with open(path, 'rb') as handle:
            self.sequence_tokenizer = pickle.load(handle)
			
class PropagandaDetector():
    def __init__(self, textPreprocessor, model_path = None):
        self.textPreprocessor = textPreprocessor
        
        if model_path:
            self.model = load_model(model_path)
        else:
            self.embed_size = 200 # Remember where I get my magic numbers from?
            self.model = Sequential()
            self.model.add(Embedding(textPreprocessor.max_features, self.embed_size))
            self.model.add(Bidirectional(LSTM(32, return_sequences=True)))
            self.model.add(GlobalMaxPool1D())
            self.model.add(Dense(20, activation="relu"))
            self.model.add(Dropout(0.1))
            self.model.add(Dense(1, activation="sigmoid"))
            self.model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
            self.model.summary()
        
    def train(self, features, labels):        
        self.model.fit(features, labels, batch_size=128, epochs=2)
        
    def detect_propaganda(self, text):
        cleaned = self.textPreprocessor.clean_text(text)
        prepared = self.textPreprocessor.prepare_for_model([cleaned])
        confidence = self.model.predict(prepared, verbose=1)[0][0]
        return (True if confidence >= 0.5 else False, confidence.item())
    
    def save_model(self, path):
        self.model.save(path)