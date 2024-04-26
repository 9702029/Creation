from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Directory to save uploaded images
UPLOAD_FOLDER = '/path/to/save'

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Data structure to store hex properties
hex_data = {}

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/uploadImage', methods=['POST'])
def upload_image():
    image_file = request.files.get('image')

    if image_file is None:
        return jsonify({'error': 'No image uploaded'}), 400

    # Check if the file has a valid name
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in image_file.filename or image_file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file extension'}), 400

    # Save the uploaded image to the upload folder
    image_path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    try:
        image_file.save(image_path)
        # Return the path to the uploaded image
        return jsonify({'imageUrl': image_path}), 200  # Return with status code 200 for success
    except Exception as e:
        print(f"Failed to save image: {e}")
        return jsonify({'error': 'Failed to save image', 'exception': str(e)}), 500

@app.route('/buildTerrain', methods=['POST'])
def build_terrain():
    selected_hexagons = request.json['selectedHexagons']
    terrain_type = request.json['terrainType']

    # Update the terrain type for the selected hexagons
    for hexagon in selected_hexagons:
        hex_data[hexagon]['terrainType'] = terrain_type

    # Optionally, save the updated data to a database or file

    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
