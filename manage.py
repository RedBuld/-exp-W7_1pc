#!/usr/bin/env python
from flask.ext.script import Manager, Server
from flask.ext.migrate import Migrate, MigrateCommand

# from flask.ext.admin.contrib.sqla import ModelView
from flask.ext.gears import Gears

from gears_stylus import StylusCompiler
from gears_less import LESSCompiler
from gears_coffeescript import CoffeeScriptCompiler
from gears_sass import SASSCompiler
from gears_clean_css import CleanCSSCompressor
from gears_uglifyjs import UglifyJSCompressor

from app import app, db

migrate = Migrate(app, db)

gears = Gears(
    compilers={
        '.styl': StylusCompiler.as_handler(),
        '.less': LESSCompiler.as_handler(),
        '.coffee': CoffeeScriptCompiler.as_handler(),
        '.sass': SASSCompiler.as_handler(),
        '.scss': SASSCompiler.as_handler()
    },
    compressors={
        'text/css': CleanCSSCompressor.as_handler(),
        'text/javascript': UglifyJSCompressor.as_handler()
    },
)
gears.init_app(app)

manager = Manager(app)
manager.add_command('db', MigrateCommand)
manager.add_command('runserver', Server(host='0.0.0.0', port=80))

if __name__ == '__main__':
    manager.run()
