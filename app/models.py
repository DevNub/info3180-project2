import uuid, datetime, random, os, errno
from . import db, UPLOAD_FOLDER
#from werkzeug.security import  generate_password_hash
from werkzeug.security import safe_str_cmp


def get_newlike_id():
    return int(str(uuid.uuid4())[:8])

def get_newpost_id():
    return str(uuid.uuid4())[:6]

def get_new_id():
    return int(str(uuid.uuid4())[:8])

def date_now():
    return datetime.date.today()
    
def generate_file_URI(post_id=None):
    if post_id:      
        URI=UPLOAD_FOLDER+'/posts/'
    else:
        URI=UPLOAD_FOLDER+'/prof_photo/'+str(uuid.uuid4().get_hex()[0:12])+'/'
    if not os.path.exists(URI):
        try:
            os.makedirs(URI)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise
    return URI
    

class Users(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    location = db.Column(db.String(25))
    #gender = db.Column(db.String(10))
    joined_on = db.Column(db.Date, nullable=False)
    biography = db.Column(db.String(255))
    profile_photo = db.Column(db.String(80))
    posts=db.relationship("Posts",backref='users')
    userposts=db.relationship("Likes",backref='users')
    follows=db.relationship("Follows",backref='users')
    
    
    def __init__(self, first_name, last_name, username, password, email, location, joined_on):
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.password = password #generate_password_hash(password, method='pbkdf2:sha256')
        self.email = email
        self.location = location
        #self.gender = gender
        self.joined_on = date_now()
        self.profile_photo = generate_file_URI()

    def is_correct_password(self, password):
        #test_password = generate_password_hash(password, method='pbkdf2:sha256')
        #if(test_password == self.password):
        #    return True
        #return False
        return safe_str_cmp(self.password.encode('utf-8'), password.encode('utf-8'))
    
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)


class Posts(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.String(10), primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    image_URI = db.Column(db.String(80))
    caption = db.Column(db.String(120))
    created_on =db.Column(db.Date,nullable=False)
    likes=db.relationship("Likes",backref='posts')

    def __init__(self,user_id,caption,image_URI=None):
        self.id=get_newpost_id()
        self.user_id=user_id
        self.image_URI= generate_file_URI(id)
        self.caption=caption
        self.created_on=date_now()
    
    def __repr__(self):
        return '<Posts %r>' % (self.id)


class Likes(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    post_id = db.Column(db.String(10),db.ForeignKey('posts.id'),nullable=False)

    def __init__(self,user_id,post_id):
        id=get_newlike_id()
        self.user_id=user_id
        self.post_id=post_id  


class Follows(db.Model):
    __tablename__ = 'follows'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    follower_id = db.Column(db.Integer,nullable=False)

    def __init__(self,user_id,follower_id):
        id=get_new_id()
        self.user_id=user_id
        self.follower_id=follower_id
