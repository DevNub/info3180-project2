"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os, jwt, json, base64
from app import app, db, login_manager
import datetime
from flask import render_template, request, session, redirect, url_for, flash, abort, jsonify, g, _request_ctx_stack
from functools import wraps
from werkzeug.utils import secure_filename
from .forms import LoginForm, RegistrationForm, PostsForm, FileTypes
from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users, Posts, Follows, Likes


#now = datetime.datetime.now() # today's date

# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.



def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
        return render_template('401.html',description='authorization_header_missing'), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        return render_template('401.html',description='invalid_header:Authorization header must start with Bearer'), 401
    elif len(parts) == 1:
        return render_template('401.html',description='invalid_header:Token not found'), 401
    elif len(parts) > 2:
        return render_template('401.html',description='invalid_header:Authorization header must be Bearer + \s + token'), 401
        
    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['TOKEN_SECRET'])

    except jwt.ExpiredSignature:
        return render_template('401.html',description='token_expired'), 401
    except jwt.DecodeError:
        return render_template('401.html',description='token_invalid_signature'), 401
        
    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated
  

###
# Routing for your application.
###

# This route is now our catch all route for our VueJS single page
# application.

'''@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')'''


###
# Routing for your application.
###
@app.route('/')
def index():
    """Render website's home page."""
    '''return render_template('index.html')'''
    
    """Render the initial webpage and then let VueJS take control."""
    return app.send_static_file('index.html')
    
@app.route('/dashboard')
@login_required
def dashboard():
    """Render website's initial page and let VueJS take over."""
    return render_template('feed.html')

    
#Registration
@app.route('/api/users/register', methods = ['POST'])
def register():
    error=None
    form = RegistrationForm()
    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        check_password = form.check_password.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        email = form.email.data
        location = form.location.data
        biography = form.biography.data
        
        
        if form.profilePhoto.data:
            profilePhoto = form.profilePhoto.data
            if profilePhoto.filename == '':
                error='No selected file'
            if profilePhoto and allowed_file(profilePhoto.filename):
                filename = secure_filename(profilePhoto.filename)
                
                if not Users.query.filter_by(email = email).first() and not Users.query.filter_by(user_name = username).first():
                    user = Users(user_name = username, first_name = first_name, last_name = last_name, email = email, password = password,location=location, biography=biography, profilePhoto=filename)
                    db.session.add(user)
                    db.session.commit()
                    return jsonify({'messages':'You have uploaded a profile photo and registered successfully'})
                else:
                    error = "Email and/or username already exists"
                    return jsonify({'errors': error})
                
            else:
                error='File not allowed'
                return jsonify({'errors': error})
        else:
            
            if not Users.query.filter_by(email = email).first() and not Users.query.filter_by(user_name = username).first():
                user = Users(user_name = username, first_name = first_name, last_name = last_name, email = email, password = password,location=location, biography=biography)
                db.session.add(user)
                db.session.commit()
                return jsonify({'messages':'You have successfully registered'})
            else:
                error = "Email and/or username already exists"
                return jsonify({'errors': error})
    else:
        return jsonify({'errors':form_errors(form)})
        
        
#Login
@app.route('/api/auth/login', methods = ['POST'])
def login():
    error=None
    form = LoginForm()
    if request.method == 'POST' and form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        user = Users.query.filter_by(user_name = username).first()
        if user and user.is_correct_password(password): 
            login_user(user)
            payload = {'id': current_user.id, 'username': current_user.user_name}
            token = jwt.encode(payload, app.config['TOKEN_SECRET'], algorithm='HS256') 
            post=Posts.query.filter_by(user_id=user.id).all();
            following=Follows.query.filter_by(user_id=user.id).all();
            followers=Follows.query.filter_by(follower_id=user.id).all();
            userdata = [len(post),len(following),len(followers),current_user.user_name,current_user.first_name,current_user.last_name,current_user.location,current_user.joined_on,token,current_user.id]
            return jsonify({'user_credentials': userdata, 'messages':"Token Generated"})
        else:
            error = "Invalid email and/or password"
            return jsonify({'errors': error})
    else:
        return jsonify({'errors':form_errors(form)})



#Logout
@app.route('/api/auth/logout', methods = ['GET'])
@login_required
@requires_auth
def userLogout():
    g.current_user = None
    logout_user()
    return jsonify({'messages':'You have successfully logged out'})
    

#Post, Caption Upload
@app.route('/api/posts/new', methods = ['POST'])
@login_required
@requires_auth
def newPost():
    error=None
    form = PostsForm()
    if request.method =='POST' and form.validate_on_submit():
        if form.photo.data:
            photo=form.photo.data
            caption = form.caption.data
            if photo.filename == '':
                error='No selected file'
            if photo and allowed_file(photo.filename):
                filename = secure_filename(photo.filename)
                newpost=Posts(user_id=current_user.id,image_URI=photo,caption=caption)
                photo.save(os.path.join(newpost.image_URI, filename))
                db.session.add(newpost)
                db.session.commit()
                return jsonify({'messages':'Photo Post successfully'})
            else:
                error='File not allowed'
                return jsonify({'errors': error})
        else:
            caption = form.caption.data
            newpost=Posts(user_id=current_user.id,caption=caption)
            db.session.add(newpost)
            db.session.commit()
            return jsonify({'messages':'Post successfully'})
    else:
        return jsonify({'errors':form_errors(form)})


#User's Posts
@app.route('/api/users/<username>/posts', methods = ['GET'])
@login_required
@requires_auth
def get_profile(username):
    error=None
    if request.method =='GET':
        user=Users.query.filter_by(username=username).first()
        posts=Posts.query.filter_by(user_id=user.id).all();
        following=Follows.query.filter_by(user_id=user.id).all();
        followers=Follows.query.filter_by(follower_id=user.id).all();
        if Follows.query.filter_by(username=user.username).first():
            follow = "Following"
        else:
            follow = "Follow"
        user_info={
            'id':user.id,
            'username':user.username,
            'bio':user.bio,
            'posts':len(posts),
            'followers':len(followers),
            'following':len(following),
            'photo':user.file_URI,
            'follow':follow
        }
        listposts=[]
        for i in range (0,len(posts)):
            count=Likes.query.filter_by(post_id=posts[i].post_id).all()
            post_data={
            'id':posts[i].id,
            'photo':posts[i].Post_URI,
            'caption':posts[i].caption,
            'created_on':posts[i].created_on,
            'likes':len(count),
            'username':user.username,
            'userphoto':user.profile_photo
            }
            listposts.append(post_data)
        return jsonify({'profile_info': user_info,'posts':listposts})
    else:
        return jsonify({'errors':error})


#Follow
@app.route('/api/users/<username>/follow', methods = ['POST','GET'])
@login_required
@requires_auth
def follow_user(username):
    if request.method == 'POST':
        user=Users.query.filter_by(username=username).first()
        if user:
            follow=Follows(user.id,current_user.id)
            db.session.add(follow)
            db.session.commit()
            return jsonify(response = [{'messages':'You are now following '+ username}])
        else:
            return jsonify(response = [{'errors':'User not found'}])


#All Posts
@app.route('/api/posts/all', methods = ['GET'])
@login_required
def get_all_posts():
    error=None
    if request.method =='GET':
        posts=Posts.query.order_by(Posts.created_on.desc()).all()
        listposts=[]
        liked=False
        for i in range (0,len(posts)):
            count=Likes.query.filter_by(post_id=posts[i].id).all()
            user=Users.query.filter_by(id=posts[i].user_id).first();
            if Likes.query.filter_by(post_id=posts[i].id, user_id=current_user.id):
                liked=True

            post_data={
            'id':posts[i].id,
            'photo':posts[i].image_URI,#get_uploaded_image(posts[i].image_URI),
            'caption':posts[i].caption,
            'date_post':posts[i].created_on,
            'likes':len(count),
            'liked':liked,
            'username':user.user_name,
            'userphoto':user.profile_photo
            }
            listposts.append(post_data)
        return jsonify({'posts': listposts})
    else:
        return jsonify({'errors':error})


#Individual Post
@app.route('/api/posts/<int:post_id>', methods = ['GET'])
@login_required
def get_post(post_id):
    error=None
    if request.method=='GET':
        post=Posts.query.filter_by(id=post_id).first();
        user=Users.query.filter_by(id=post.user_id).first();
        count=Likes.query.filter_by(post_id=post_id).all()
        return jsonify({
        'post_id':post.id,
        'photo':post.post_URI,
        'caption':post.caption,
        'created_on':post.created_on,
        'likes':len(count),
        'username':user.username,
        'userphoto':user.profile_photo
        })
    else:
        return jsonify({'errors':error})


#Like Post
@app.route('/api/posts/<int:post_id>/like', methods =['POST'])
@login_required
@requires_auth
def like_post():
    if request.method == 'POST':
        """
        like=Likes(post_id,current_user.id)
        db.session.add(like)
        db.session.commit()   
        """    
        return jsonify(response= [{'messages':'Post successully liked'}])



# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages
    
#Get allowed file types
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in FileTypes
           
          
#Get uploaded images 
def get_uploaded_images():
    fileList = []
    rootdir = os.getcwd()
    print (rootdir)
    for subdir, dirs, files in os.walk(rootdir + '/static/images'):
        for file in files:
            fileList.append(os.path.join(subdir, file))
    return render_template('profiles.html', fileList=fileList)


# Flash errors from the form if validation fails
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error), 'danger')


def format_date_joined(date):
    """ Returns Month, Year from a given date """
    newdate = date.strftime("%B, %Y")
    return newdate
    
@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")




