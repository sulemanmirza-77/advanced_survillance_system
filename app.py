from flask import Flask, render_template, redirect, url_for, request, jsonify, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from forms import LoginForm, RegistrationForm, UploadForm
from main import inference
from extensions import db
import os
import uuid

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['UPLOAD_FOLDER'] = 'videos'

db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

from models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            print(f"Found user: {user.username}")
            if check_password_hash(user.password, form.password.data):
                print("Password is correct")
                login_user(user)
                return redirect(url_for('dashboard'))
            else:
                print("Password is incorrect")
        else:
            print("User not found")
        flash("Invalid username or password")
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data, method='pbkdf2:sha256')
        new_user = User(username=form.username.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.username)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/upload', methods=['GET', 'POST'])
@login_required
def upload():
    form = UploadForm()
    if form.validate_on_submit():
        file = form.file.data
        if file:
            filename = file.filename
            original_filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(original_filepath)
            
            # Generate a unique filename for the processed video
            processed_filename = f"processed_{uuid.uuid4().hex}_{filename}"
            processed_filepath = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)
            
            # Start processing the video
            inference(original_filepath, processed_filepath)
            
            return redirect(url_for('status', video_id=processed_filename))
    return render_template('upload.html', form=form)

@app.route('/status/<video_id>')
@login_required
def status(video_id):
    # Check the status of the processed video
    # For now, just return a dummy status
    return render_template('status.html', video_id=video_id, status="Processing Completed", download_link=url_for('download_video', filename=video_id))

@app.route('/videos/<path:filename>')
@login_required
def download_video(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
