from wtforms import Form, BooleanField, TextField, PasswordField, validators
from app import app, db
from datetime import datetime
from sqlalchemy import bindparam
import hashlib, re, random, string

products_to_users = db.Table('products_to_users',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id')),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('count', db.Integer)
)

class User(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    username = db.Column('username', db.String(250), index=True)
    password = db.Column('password', db.String(250))
    email = db.Column('email', db.String(100), unique=True, index=True)
    registered_on = db.Column('registered_on', db.DateTime)
    locale = db.Column('locale', db.String(5))

    rank = db.Column('rank', db.Integer)
    phone = db.Column('phone', db.String(12))
    coord = db.Column('coord', db.Text)
    coord_date = db.Column('coord_date', db.DateTime)
    orders = db.relationship('Order', backref='driver', lazy='dynamic')

    def init(self, username, password, email, locale, rank, phone):
        self.username = username
        self.set_password(password)
        self.set_email(email)
        self.locale = locale
        self.registered_on = datetime.now()
        self.rank = rank
        self.set_phone(phone)

    def set_password(self, password):
        m = hashlib.md5()
        m.update(password)
        m = m.hexdigest()
        self.password = m[:-len(m)+250]

    def set_email(self, email):
        self.email = str(email).lower()

    def set_phone(self, phone):
        try:
            if phone[0] + phone[1] == '+7':
                phone = phone[2:]
        except Exception, e:
            pass
        phone = re.sub('[+,:;!@#$\-\/)(\n\r\s+]', '', phone)
        if len(phone) == 10:
            phone = '+7' + phone
        self.phone = phone

    def set_pos(self, coord):
        self.coord = coord
        self.coord_date = datetime.now()

    def is_authenticated(self):
        return True
 
    def is_active(self):
        return True
 
    def is_anonymous(self):
        return False
 
    def get_id(self):
        return unicode(self.id)
 
    def __repr__(self):
        return '<User %r>' % (self.username)

    def get_phone(self):
        if len(self.phone) == 6:
            return '%s-%s-%s' % (self.phone[:2], self.phone[2:4], self.phone[4:6])
        if len(self.phone) == 11:  
            return '%s(%s)%s-%s-%s' % (self.phone[:1], self.phone[1:4], self.phone[4:7], self.phone[7:9], self.phone[9:12])
        if len(self.phone) == 12:  
            return '%s(%s)%s-%s-%s' % (self.phone[:2], self.phone[2:5], self.phone[5:8], self.phone[8:10], self.phone[10:13])
        return self.phone

    def get_products_all(self):
        a = db.session.query(products_to_users).filter_by(user_id=self.id).all()
        b = Product.query.filter(Product.id.in_([x.product_id for x in a])).all()
        c = []
        for i in a:
            for g in b:
                if g.id == i[0]:
                    for j in xrange(i[2]):
                        c.append(g)
        return c

    def get_products(self):
        a = db.session.query(products_to_users).filter_by(user_id=self.id).all()
        b = Product.query.filter(Product.id.in_([x.product_id for x in a])).all()
        c = []
        for i in b:
            for j in a:
                if i.id == j[0]:
                    i.count = j[2]
                    c.append(i)
        return c

    def get_products_count(self):
        a = db.session.query(products_to_users).filter_by(user_id=self.id).all()
        i = 0
        for j in a:
            i += 1*j[2]
        return i

    def add_product(self, product_id):
        a = db.session.query(products_to_users).filter_by(user_id=self.id, product_id=product_id).first()
        if a is None:
            s = products_to_users.insert().values(product_id=product_id, user_id=self.id, count=1)
            db.session.execute(s)
            db.session.commit()
        else:
            p = Product.query.get(product_id)
            if p.visible or a[2] < 0:
                s = products_to_users.update().values(count=a[2]+1).where(products_to_users.c.product_id==product_id).\
                    where(products_to_users.c.user_id==self.id)
                if a[2] == -1:
                    s = products_to_users.delete().where(products_to_users.c.product_id==product_id).\
                        where(products_to_users.c.user_id==self.id)
                db.session.execute(s)
                db.session.commit()

    def remove_product(self, product_id):
        a = db.session.query(products_to_users).filter_by(user_id=self.id, product_id=product_id).first()
        if a is None:
            s = products_to_users.insert().values(product_id=product_id, user_id=self.id, count=-1)
            db.session.execute(s)
            db.session.commit()
        else:
            p = Product.query.get(product_id)
            if p.visible or a[2] > 0:
                s = products_to_users.update().values(count=a[2]-1).where(products_to_users.c.product_id==product_id).\
                    where(products_to_users.c.user_id==self.id)
                if a[2] == 1:
                    s = products_to_users.delete().where(products_to_users.c.product_id==product_id).\
                        where(products_to_users.c.user_id==self.id)
                db.session.execute(s)
                db.session.commit()
# /*-------------------------------------------------------------------------*/


products_to_orders = db.Table('products_to_orders',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id')),
    db.Column('order_id', db.Integer, db.ForeignKey('order.id')),
    db.Column('count', db.Integer)
)

class Shop(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    address = db.Column('address', db.String(250), index=True)
    name = db.Column('name', db.String(250), index=True)

    def init(self, name, address):
        self.name = name
        self.address = address

class Category(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    num = db.Column('num', db.Integer, index=True)
    name = db.Column('name', db.String(250), index=True)
    products = db.relationship('Product', backref='category', lazy='dynamic')
    visible = db.Column('visible', db.Boolean)
    icon = db.Column('icon', db.String(250), index=True)

    def init(self, name, num, visible, icon):
        self.name = name
        self.num = num
        self.visible = visible
        self.icon = icon


class Product(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(250), index=True)
    memo = db.Column('memo', db.Text)
    img = db.Column('img', db.Text)
    price = db.Column('price', db.Integer)
    category_id = db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
    visible = db.Column('visible', db.Boolean)

    def init(self, name, memo, img, price):
        self.name = name
        self.memo = memo
        self.img = img
        self.price = price
        self.visible = True
        

class Order(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(250), index=True)
    phone = db.Column('phone', db.String(12))
    email = db.Column('email', db.String(250), index=True)
    address = db.Column('address', db.String(250), index=True)
    registered_on = db.Column('registered_on', db.DateTime)
    take_time = db.Column('take_time', db.DateTime)
    status = db.Column('status', db.Integer) # 0 - in air, 1 - active, 2 - achieved, 3 - no driver
    need_market = db.Column('need_market', db.Boolean)
    driver_id = db.Column('driver_id', db.Integer, db.ForeignKey('user.id'))
    re_count = db.Column('re_count', db.Integer)
    key = db.Column('key', db.String(6))

    def init(self, name, phone, email, address):
        self.name = name
        self.phone = phone
        self.email = email
        self.address = address
        self.registered_on = datetime.now()
        self.status = 0
        self.need_market = False
        self.re_count = 0
        s = string.digits + string.ascii_uppercase
        self.key = ''.join(random.choice(s) for x in range(6))

    def get_phone(self):
        if len(self.phone) == 6:
            return '%s-%s-%s' % (self.phone[:2], self.phone[2:4], self.phone[4:6])
        if len(self.phone) == 11:  
            return '%s(%s)%s-%s-%s' % (self.phone[:1], self.phone[1:4], self.phone[4:7], self.phone[7:9], self.phone[9:12])
        if len(self.phone) == 12:  
            return '%s(%s)%s-%s-%s' % (self.phone[:2], self.phone[2:5], self.phone[5:8], self.phone[8:10], self.phone[10:13])
        return self.phone
        
    def get_products_all(self):
        a = db.session.query(products_to_orders).filter_by(order_id=self.id).all()
        b = Product.query.filter(Product.id.in_([x.product_id for x in a])).all()
        c = []
        for i in a:
            for g in b:
                if g.id == i[0]:
                    for j in xrange(i[2]):
                        c.append(g)
        return c

    def get_products(self):
        a = db.session.query(products_to_orders).filter_by(order_id=self.id).all()
        b = Product.query.filter(Product.id.in_([x.product_id for x in a])).all()
        c = []
        price = 0
        for i in b:
            for j in a:
                if i.id == j[0]:
                    i.count = j[2]
                    price += i.price*i.count
                    c.append(i)
        return {'products': c, 'price': price}

    def get_products_count(self):
        a = db.session.query(products_to_orders).filter_by(order_id=self.id).all()
        i = 0
        for j in a:
            i += 1*j[2]
        return i

class Streets(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(250), index=True, unique=True)

    def init(self, name):
        self.name = name

class Upload(db.Model):
    url = db.Column('url', db.String(250), index=True, unique=True, primary_key=True)
    registered_on = db.Column('registered_on', db.DateTime)

    def init(self, url):
        self.url = url
        self.registered_on = datetime.now()