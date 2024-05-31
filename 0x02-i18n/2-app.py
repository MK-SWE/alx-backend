#!/usr/bin/env python3
"""
    Basic Flask app
"""
from flask import (
    Flask,
    render_template,
    request
)
from flask_babel import Babel


class Config(object):
    """
        config the babel object
    """
    LANGUAGES = ['en', 'fr']
    BABEL_DEFAULT_LOCALE = 'en'
    BABEL_DEFAULT_TIMEZONE = 'UTC'

app = Flask(__name__)
app.config.from_object(Config)
babel = Babel(app)


@babel.localeselector
def get_locale():
    """
        Set the best max locale
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """Render Basic Home page"""
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run()