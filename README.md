# Infórmate al instante Nicaragua (Flask)

Proyecto de noticias con panel de administración (crear/editar/eliminar) y filtros por categorías (combos).

## Requisitos
- Python 3.10+
- pip

## Instalación
```bash
cd informate_nicaragua
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Ejecutar (desarrollo)
```bash
export FLASK_APP=app.py           # Windows PowerShell: $env:FLASK_APP="app.py"
flask --app app.py init-db        # crea la BD y el usuario admin (admin/admin123)
flask --app app.py run
```
Abre http://127.0.0.1:5000 y entra al panel en /admin (usuario: admin, contraseña: admin123).

## Publicación
- Puedes subirlo a Railway, Render, Fly.io o un VPS.
- Configura la variable SECRET_KEY y, si deseas, usa una BD MySQL cambiando SQLALCHEMY_DATABASE_URI en `config.py`.
- Sirve `static/` con el servidor (nginx, etc.) y define `UPLOAD_FOLDER` para imágenes.

## Notas
- Categorías disponibles: nacionales, internacionales, deportes, sucesos.
- Editor enriquecido: CKEditor (CDN).
- Subida de imágenes a `static/uploads/`.