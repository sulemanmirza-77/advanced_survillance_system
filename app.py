from flask import Flask, request, jsonify
# from flask_cors import cross_origin, CORS
from main import inference

app = Flask(__name__)


@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "API is healthy"}), 200


@app.route('/start-process', methods=['GET', 'POST'])
def start_inference_process():
    if request.content_type != 'application/json':
        return jsonify({"status": "error", "message": "Content-Type must be application/json"}), 415

    try:
        # Get the path from the request
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid JSON"}), 400

        file_path = data.get('path')
        if not file_path:
            return jsonify({"status": "error", "message": "File path is required"}), 400

        # Call the inference function with the file path
        # result = inference(file_path)
        response = jsonify({'message': 'Request for video processing received'})
        response.status_code = 200

        def after_request_func(response):
            def closure():
                inference(file_path)

            response.call_on_close(closure)
            return response

        return after_request_func(response)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run()
