from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = '/path/to/save'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

hex_data = {}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/uploadImage', methods=['POST'])
def upload_image():
    image_file = request.files.get('image')

    if not image_file:
        return jsonify({'error': 'No image uploaded'}), 400

    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if not image_file.filename or image_file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file extension'}), 400

    image_path = os.path.join(UPLOAD_FOLDER, secure_filename(image_file.filename))

    try:
        image_file.save(image_path)
        return jsonify({'imageUrl': image_path}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to save image', 'exception': str(e)}), 500

@app.route('/buildTerrain', methods=['POST'])
def build_terrain():
    if not request.json or 'terrainType' not in request.json:
        return jsonify({'error': 'JSON data with terrainType key is required'}), 400

    selected_hexagons = request.json['selectedHexagons']
    terrain_type = request.json['terrainType']

    for hexagon in selected_hexagons:
        hex_data[hexagon]['terrainType'] = terrain_type

    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
