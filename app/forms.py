from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SubmitField
from wtforms.validators import Required, Email,Length, EqualTo, DataRequired
from flask_wtf.file import FileField, FileAllowed, FileRequired

FileTypes = set(['png', 'jpg', 'jpeg', 'gif'])

class LoginForm(FlaskForm):

	username = StringField('Username', validators = [DataRequired('Please provide an email address')])
	password = PasswordField('Password', validators = [DataRequired()])

class RegistrationForm(FlaskForm):
	first_name = StringField('First Name', validators=[Length(min=1,max=20,message=('Enter a first name between 1 and 20 characters')),DataRequired('Please enter your First Name')])
	last_name = StringField('Last Name', validators=[Length(min=1,max=20,message=('Enter a last name between 1 and 20 characters )')),DataRequired('Please enter your Last Name')])
	username = StringField('Username', validators=[Length(min=1,max=20,message=('Enter a username between 1 and 20 characters')),DataRequired('Please enter your username')])
	email = StringField('Email Address', validators=[Email(message='Invalid Email'),DataRequired('Please enter your email address')])
	password = PasswordField('Enter Password',validators=[DataRequired('Enter a Password'),EqualTo('check_password',message=('Passwords do not match'))])
	check_password=PasswordField('Repeat Password',validators=[DataRequired('Re-enter password')])
	location = StringField('Location', validators = [DataRequired('Please enter your location')])
	biography = TextAreaField('Biography', validators=[DataRequired('Tell us about yourself'), Length(max=200)])
	photo = FileField('photo', validators=[FileRequired(),FileAllowed(FileTypes, 'File not allowed')])
	submit = SubmitField('Register')
	
class PostsForm(FlaskForm):
	photo = FileField('photo', validators=[FileAllowed(FileTypes, 'File not allowed')])
	caption = TextAreaField('Caption', validators = [DataRequired(),Length(max=100)])



		