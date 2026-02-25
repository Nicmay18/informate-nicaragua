from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, BooleanField, PasswordField, FileField
from wtforms.validators import DataRequired, Length
from models import CATEGORIES

class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])

class PostForm(FlaskForm):
    title = StringField('Título', validators=[DataRequired(), Length(max=200)])
    summary = StringField('Resumen (opcional)', validators=[Length(max=300)])
    content = TextAreaField('Contenido', validators=[DataRequired()])
    category = SelectField('Categoría', choices=[(c, c.title()) for c in CATEGORIES], validators=[DataRequired()])
    is_featured = BooleanField('Destacar en portada')
    image = FileField('Imagen destacada (opcional)')