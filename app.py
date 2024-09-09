from flask import Flask, render_template, redirect, url_for, request, jsonify, flash, send_from_directory
from flask_cors import CORS
from main import inference
import os

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'videos'


from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)

# Set the upload folder for videos
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
OUTPUT_FOLDER = 'videos'
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER


# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# Ensure the upload folder exists
if not os.path.exists(OUTPUT_FOLDER):
    os.makedirs(OUTPUT_FOLDER)


# Health check endpoint
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200


# Combined route to upload video and start the inference process
@app.route('/upload-and-process', methods=['POST'])
def upload_and_process():
    try:
        # Check if there's a video file in the request
        if 'video' not in request.files:
            return jsonify({'status': 'error', 'message': 'No video file provided'}), 400

        video = request.files['video']

        # Check if the file has a valid name
        if video.filename == '':
            return jsonify({'status': 'error', 'message': 'No selected video file'}), 400

        # Save the video to the uploads folder
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video.filename)
        print(video_path)
        video.save(video_path)

        # Send a response immediately after upload and then process the video asynchronously
        response = jsonify({'status': 'success', 'message': 'Video uploaded successfully and processing has started', 'path': video_path})
        response.status_code = 200

        def after_request_func(response):
            def closure():
                # Call the inference function after the response is sent
                inference(video_path)

            response.call_on_close(closure)
            return response

        return after_request_func(response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




if __name__ == '__main__':

    app.run(host="0.0.0.0",port=5000)
