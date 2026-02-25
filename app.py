from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from slugify import slugify
from pathlib import Path
import os
import pytz
from datetime import datetime, timezone

from config import Config
from models import db, User, Post, CATEGORIES
from forms import LoginForm, PostForm


def create_app():
    app = Flask(__name__, instance_relative_config=True, static_folder='static', template_folder='templates')
    app.config.from_object(Config)

    # Asegurar carpetas necesarias
    Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)
    Path(app.instance_path).mkdir(parents=True, exist_ok=True)

    # Inicializar extensiones
    db.init_app(app)

    login_manager = LoginManager(app)
    login_manager.login_view = 'admin_login'

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    # --- Filtro Jinja: convertir UTC -> America/Managua ---
    @app.template_filter('to_nicaragua')
    def to_nicaragua(dt):
        """Convierte una fecha/hora (UTC o naive) a la zona horaria de Nicaragua."""
        if dt is None:
            return None
        nicaragua_tz = pytz.timezone("America/Managua")
        # Si viene sin tzinfo, asumimos UTC
        if getattr(dt, "tzinfo", None) is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(nicaragua_tz)

    # --- Utilidad para validar extensiones de archivo ---
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[-1].lower() in app.config['ALLOWED_EXTENSIONS']

    # ----------------- Rutas Públicas -----------------

    @app.route('/')
    def index():
        q = request.args.get('q', '').strip()
        categories = request.args.getlist('cat')
        query = Post.query

        if categories:
            query = query.filter(Post.category.in_(categories))

        if q:
            like = f"%{q}%"
            query = query.filter(
                (Post.title.ilike(like)) |
                (Post.summary.ilike(like)) |
                (Post.content.ilike(like))
            )

        featured = Post.query.filter_by(is_featured=True)\
                             .order_by(Post.created_at.desc())\
                             .limit(5).all()

        posts = query.order_by(Post.created_at.desc()).limit(30).all()

        return render_template(
            'index.html',
            posts=posts,
            featured=featured,
            sel_categories=categories,
            q=q,
            CATEGORIES=CATEGORIES
        )

    @app.route('/categoria/<cat>')
    def category(cat):
        if cat not in CATEGORIES:
            flash('Categoría no encontrada', 'warning')
            return redirect(url_for('index'))
        posts = Post.query.filter_by(category=cat).order_by(Post.created_at.desc()).all()
        return render_template('category.html', posts=posts, category=cat, CATEGORIES=CATEGORIES)

    @app.route('/noticia/<slug>')
    def detail(slug):
        post = Post.query.filter_by(slug=slug).first_or_404()
        related = Post.query.filter(
            Post.category == post.category,
            Post.id != post.id
        ).order_by(Post.created_at.desc()).limit(6).all()
        return render_template('detail.html', post=post, related=related, CATEGORIES=CATEGORIES)

    # ----------------- Rutas Admin -----------------

    @app.route('/admin/login', methods=['GET', 'POST'])
    def admin_login():
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(username=form.username.data).first()
            if user and user.check_password(form.password.data):
                login_user(user)
                flash('Bienvenido', 'success')
                return redirect(url_for('admin_dashboard'))
            flash('Credenciales inválidas', 'danger')
        return render_template('admin/login.html', form=form)

    @app.route('/admin/logout')
    @login_required
    def admin_logout():
        logout_user()
        flash('Sesión cerrada', 'info')
        return redirect(url_for('index'))

    @app.route('/admin')
    @login_required
    def admin_dashboard():
        total = Post.query.count()
        por_cat = {c: Post.query.filter_by(category=c).count() for c in CATEGORIES}
        recents = Post.query.order_by(Post.created_at.desc()).limit(10).all()
        return render_template('admin/dashboard.html', total=total, por_cat=por_cat, recents=recents, CATEGORIES=CATEGORIES)

    @app.route('/admin/publicar', methods=['GET', 'POST'])
    @login_required
    def admin_create():
        form = PostForm()
        if form.validate_on_submit():
            # Guardar imagen
            file = form.image.data
            filename = None
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

            # Generar slug único
            base_slug = slugify(form.title.data)
            slug = base_slug
            i = 1
            while Post.query.filter_by(slug=slug).first():
                slug = f"{base_slug}-{i}"
                i += 1

            post = Post(
                title=form.title.data,
                slug=slug,
                summary=form.summary.data or "",
                content=form.content.data,
                category=form.category.data,
                is_featured=form.is_featured.data,
                image_filename=filename
            )
            db.session.add(post)
            db.session.commit()
            flash('Noticia publicada', 'success')
            return redirect(url_for('admin_list'))

        return render_template('admin/post_form.html', form=form, action='Publicar', CATEGORIES=CATEGORIES)

    @app.route('/admin/editar/<int:post_id>', methods=['GET', 'POST'])
    @login_required
    def admin_edit(post_id):
        post = Post.query.get_or_404(post_id)
        form = PostForm(obj=post)
        if form.validate_on_submit():
            post.title = form.title.data
            post.summary = form.summary.data or ""
            post.content = form.content.data
            post.category = form.category.data
            post.is_featured = form.is_featured.data

            file = form.image.data
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                post.image_filename = filename

            # Actualizar slug si cambió el título
            base_slug = slugify(post.title)
            slug = base_slug
            i = 1
            while slug != post.slug and Post.query.filter_by(slug=slug).first():
                slug = f"{base_slug}-{i}"
                i += 1
            post.slug = slug

            db.session.commit()
            flash('Noticia actualizada', 'success')
            return redirect(url_for('admin_list'))

        return render_template('admin/post_form.html', form=form, action='Actualizar', CATEGORIES=CATEGORIES)

    @app.route('/admin/noticias')
    @login_required
    def admin_list():
        cat = request.args.get('cat')
        query = Post.query
        if cat in CATEGORIES:
            query = query.filter_by(category=cat)
        posts = query.order_by(Post.created_at.desc()).all()
        return render_template('admin/posts_list.html', posts=posts, CATEGORIES=CATEGORIES)

    @app.route('/admin/eliminar/<int:post_id>', methods=['POST'])
    @login_required
    def admin_delete(post_id):
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        flash('Noticia eliminada', 'info')
        return redirect(url_for('admin_list'))

    # Servir imágenes subidas
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app


# Punto de entrada
if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
