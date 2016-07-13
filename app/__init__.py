# -*- coding: utf-8 -*
import os
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from flask.ext.admin import Admin
from flask.ext.babelex import Babel
from flask.ext.thumbnails import Thumbnail
from werkzeug.routing import BaseConverter
from flask.ext.mail import Mail
# from flask.ext.rq import RQ
from celery import Celery


app = Flask(__name__)
app.config.from_object(os.environ.get('FLASK_SETTINGS_MODULE', 'app.settings.development'))


class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]


app.url_map.converters['regex'] = RegexConverter


db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
# admin = Admin(app)
babel = Babel(app)
thumb = Thumbnail(app)
mail = Mail(app)
# rq = RQ(app)

def make_celery(app, name):
    celery = Celery(str(app.import_name) + '_' + name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

celery_mail = make_celery(app, 'mail')
celery_orders = make_celery(app, 'orders')


from app import models, views, admin_views
from models import User

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))
