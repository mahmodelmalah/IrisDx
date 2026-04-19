import os
import random
import time
import uuid
import cv2
import numpy as np
from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
import traceback

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Attempt to load the keras model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'IRISRecognizer1.h5')
model = None
try:
    import tensorflow as tf
    from tensorflow import keras
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        model = keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"Model not found at {MODEL_PATH}. Starting in MOCK MODE.")
except Exception as e:
    print(f"Could not load model: {e}")
    print("Starting in MOCK MODE.")

def preprocess_image(filepath):
    # Based on the notebook, preprocess image to match model input
    # This is a generic preprocessing, adjust as needed based on the exact model
    img = cv2.imread(filepath)
    if img is None:
        raise ValueError("Could not read image file.")
    # Assuming input size of 150x150 based on standard models, adjust if known
    img = cv2.resize(img, (150, 150))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400

    if file:
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)

        try:
            # Simulate processing delay to show off UI animations
            time.sleep(2.5) 
            
            if model is not None:
                # Real inference
                processed_img = preprocess_image(filepath)
                predictions = model.predict(processed_img)
                class_index = np.argmax(predictions[0])
                confidence = float(np.max(predictions[0]))
                
                # We don't have the label encoder, so we just return the class index
                # Ideally, we would load the LabelEncoder or a class map.
                subject_id = f"Subject ID: {class_index}"
            else:
                # Mock inference
                confidence = round(random.uniform(0.85, 0.99), 4)
                mock_subjects = ["437-R", "715-L", "515-R", "122-L", "888-R", "057-L"]
                subject_id = f"Subject ID: {random.choice(mock_subjects)}"

            return jsonify({
                'success': True,
                'subject_id': subject_id,
                'confidence': confidence,
                'is_mock': model is None
            })
        except Exception as e:
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
        finally:
            # Clean up the file after processing to save space
            try:
                os.remove(filepath)
            except:
                pass

if __name__ == '__main__':
    app.run(debug=True, port=5000)
