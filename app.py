from flask import Flask, render_template, request, jsonify, redirect, url_for
from keras.models import load_model
import numpy as np
from keras.preprocessing.image import load_img
from keras.applications.resnet50 import preprocess_input
import os
from keras.preprocessing import image
import uuid
import urllib

import AStar as AS

app = Flask(__name__)
model = load_model('model/irespond_cnn_model.h5')
target_img = os.path.join(os.getcwd() , 'static/images')

@app.route("/")
def start():
    return render_template("index.html")

@app.route('/submit', methods = ['POST'])
def crunchData():
	# Get data
	data = request.get_json(force=True)
	adjacencyMatrix = data['adjacency']
	distanceMatrix = data['distance']
	start = int(data['start'])
	end = int(data['end'])

	# Find shortest path
	listOfShortestPath = AS.AStar(adjacencyMatrix, distanceMatrix, start, end)
	
	return jsonify(listOfShortestPath)


#Allow files with extension png, jpg and jpeg
ALLOWED_EXT = set(['jpg' , 'jpeg' , 'png'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXT
           
# Function to load and prepare the image in right shape
def read_image(filename):

    img = load_img(filename, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    return x

@app.route('/predict', methods=['GET','POST'])
def predict():
    error = ''
    if request.method == 'POST':
        if(request.form):
            link = request.form.get('link')
            try :
                resource = urllib.request.urlopen(link)
                unique_filename = str(uuid.uuid4())
                filename = unique_filename+".jpg"
                file_path = os.path.join('static/images', filename)
                output = open(file_path , "wb")
                output.write(resource.read())
                output.close()
                img = read_image(file_path)
                class_prediction = model.predict(img) 
                classes_x = np.argmax(class_prediction, axis=1)
                if classes_x == 0:
                    label = "Accident / Human Inflicted"
                elif classes_x == 1:
                    label = "Earthquake"
                elif classes_x == 2:
                    label = "El Niño"
                elif classes_x == 3:
                    label = "Flood"
                elif classes_x == 4:
                    label = "Infrastructure Damage"
                elif classes_x == 5:
                    label = "Landslide"
                elif classes_x == 6:
                    label = "No Damage (Buildings / Street)"
                elif classes_x == 7:
                    label = "No Damage (Human)"
                elif classes_x == 8:
                    label = "No Damage (Water-Related)"
                elif classes_x == 9:
                    label = "No Damage (Wildlife / Forest)"
                elif classes_x == 10:
                    label = "Urban Fire"
                elif classes_x == 11:
                    label = "Wild Fire"
                else:
                    label = "Unable to identify"


            except Exception as e : 
                print(str(e))
                error = 'This image from this site is not accesible or inappropriate input'

            if(len(error) == 0):
                return render_template('predict.html', label = label, prob = round(np.max(class_prediction)*100, 4), user_image = file_path)
            else:
                return render_template('cnn_model.html' , error = error) 

            
        elif (request.files):
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = file.filename
                file_path = os.path.join('static/images', filename)
                file.save(file_path)
                img = read_image(file_path)
                class_prediction = model.predict(img) 
                classes_x = np.argmax(class_prediction, axis=1)
                if classes_x == 0:
                    label = "Accident / Human Inflicted"
                elif classes_x == 1:
                    label = "Earthquake"
                elif classes_x == 2:
                    label = "El Niño"
                elif classes_x == 3:
                    label = "Flood"
                elif classes_x == 4:
                    label = "Infrastructure Damage"
                elif classes_x == 5:
                    label = "Landslide"
                elif classes_x == 6:
                    label = "No Damage (Buildings / Street)"
                elif classes_x == 7:
                    label = "No Damage (Human)"
                elif classes_x == 8:
                    label = "No Damage (Water-Related)"
                elif classes_x == 9:
                    label = "No Damage (Wildlife / Forest)"
                elif classes_x == 10:
                    label = "Urban Fire"
                elif classes_x == 11:
                    label = "Wild Fire"
                else:
                    label = "Unable to identify"

                
            else:
                error = "Please upload images of jpg , jpeg and png extension only"

            if(len(error) == 0):
                return render_template('predict.html', label = label, prob = round(np.max(class_prediction)*100, 4), user_image = file_path)
            else:
                return render_template('cnn_model.html' , error = error)

    else:
        return render_template('cnn_model.html')

@app.route('/cnn_model', methods=['GET', 'POST'])
def cnn_model():
    if request.method == 'POST':
        # do stuff when the form is submitted

        # redirect to end the POST handling
        # the redirect can be to the same route or somewhere else
        return redirect(url_for('cnn_model'))

    # show the form, it wasn't submitted
    return render_template('cnn_model.html')


if __name__ == '__main__':
	app.run(port=5000)
