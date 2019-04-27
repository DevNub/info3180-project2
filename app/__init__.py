from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

# Config Values
USERNAME = 'admin'
PASSWORD = 'password123'

# SECRET_KEY is needed for session security, the flash() method in this case stores the message in a session
SECRET_KEY = 'Sup3r$3cretkey'
TOKEN_SECRET = 'Sup3r$3crettoken'


UPLOAD_FOLDER = "./app/static/images"

app = Flask(__name__)
app.config.from_object(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
filefolder = app.config['UPLOAD_FOLDER']


app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://czqowwknlaudcp:4575d49d35647513465716a24862b90b87695df2f9177c3a2e840c4214fe110a@ec2-54-227-245-146.compute-1.amazonaws.com:5432/d2gdamnrqepsr3"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
db = SQLAlchemy(app)


# Flask-Login login manager
csrf = CSRFProtect(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.session_protection = "strong"
login_manager.login_message_category = "info"  # customize the flash message category

from app import views