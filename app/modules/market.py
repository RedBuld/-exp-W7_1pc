# -*- coding: utf-8 -*-
from flask import Blueprint, render_template, redirect, abort, g, session, request, flash, url_for, session, Flask, jsonify
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask.ext.babelex import lazy_gettext, gettext as _, ngettext
from .. import app, db, babel
from ..models import User, Product, Category, Streets
from order import create_order
from ..forms import UserForm
from ..tools import check_rank_user, check_rank
from sqlalchemy import asc
import json

market_module = Blueprint('market_module', __name__)

global products_in_bag
products_in_bag = []
@market_module.route('/')
def index():
    categories_sh = Category.query.order_by(asc(Category.num)).limit(11)
    categories_all = Category.query.order_by(asc(Category.name))
    return render_template('market/index.html', categories_sh=categories_sh, categories_all=categories_all)

# минисписок категорий

@market_module.route('/cats')
def cats():
    categories_sh = Category.query.order_by(asc(Category.num)).limit(11)
    temp = {}
    for i in categories_sh:
        temp[i.num] = {}
        temp[i.num]["id"] = i.id
        temp[i.num]["name"] = i.name
        temp[i.num]["icon"] = i.icon
    #return render_template('market/cart.html', products = temp)
    return json.dumps(temp)

# список продуктов категории
@market_module.route('/cat/<int:category_id>')
def cat(category_id):
    products = Product.query.filter_by(category_id=category_id)
    return render_template('market/prd_page.html', products=products)

#информация продукта
@market_module.route('/prd/<int:product_id>')
def prd(product_id):
    product = Product.query.filter_by(id=product_id).limit(1)
    return render_template('market/product.html', product=product)

# кнопоньки
@market_module.route('/controls/<int:cat>')
def controls(cat):
    category = Category.query.filter_by(id=cat).limit(1)
    for i in category:
        name = i.name
    return render_template('market/controls.html', name=name)

# кнопоньки мини
@market_module.route('/controls_mini/<int:product_id>')
def controls_mini(product_id):
    product = Product.query.filter_by(id=product_id)
    return render_template('market/controls_mini.html', product=product)

# кнопоньки медиум
@market_module.route('/controls_medium')
def controls_medium():
    return render_template('market/controls_medium.html')

# основная секция
# добавление продукта в корзину
@market_module.route('/add_product/<int:product_id>')
def add_product(product_id):
    product = Product.query.filter_by(id=product_id)
    t = ''
    for i in product:
        t = i.id
    if t != '':
        products_in_bag.append(product_id)
        return 'true'
    else:
        return 'false'

# удаление продукта из корзины
@market_module.route('/delete_product/<int:product_id>')
def delete_product(product_id):
    t = ''
    try:
        t = products_in_bag.index(product_id)
        if t != '':
            del products_in_bag[t]
            return 'true'
    except ValueError:
        return 'false'

#корзина
@market_module.route('/cart')
def cart():
    temp = {}
    for i in products_in_bag:
        if i in temp:
            temp[i] += 1
        else:
            temp[i] = 1
    return render_template('market/cart.html', products = temp)

# оформление заказа
@market_module.route('/order_create', methods=['POST'])
def order_create():
    qwe = request.get_data()
    qwe = json.loads(qwe)
    order_key = create_order(u''+qwe['name'], u''+qwe['street']+u' д.'+qwe['house']+u' кв.'+qwe['apartment'], qwe['email'], qwe['phone'], products_in_bag)
    result = {}
    if order_key == '':
        result['status'] = 'false'
    else:
        result['status'] = 'true'
        result['key'] = order_key
    del products_in_bag[:]
    return json.dumps(result)

#
#@market_module.route('/add_streets')
#def add_streets():
#    streets_line = u"ЖК Молодежный,мкр. Тепличный,мкрн. 1-ПЗ-23,наб. 6 Армии,наб. Пречистенская,пер.  Полярный,пер.  Пролетарский 2-й,пер. 2-й Говоровский,пер. 2-йТурундаевский,пер. 3-й Говоровский,пер. Аллейный,пер. Ананьинский,пер. Ботанический,пер. Верхний,пер. Водников,пер. Главный,пер. Грязовецкий,пер. Дальний,пер. Движенческий,пер. Детский,пер. Долгий,пер. Доронинский 2-й,пер. Доронинский 3-й,пер. Доронинский 4-й,пер. Доронинский1-й,пер. Ершовский,пер. Железнодорожный,пер. Заболотный,пер. Завражский,пер. Западный,пер. Застроечный,пер. Индивидуальный,пер. Индустриальный,пер. Карьерный,пер. Клубный,пер. Кольцевой,пер. Конечный,пер. Крайний,пер. Кривой,пер. Линейный,пер. Локомотивный,пер. Лукьяновский,пер. Майский,пер. Маяковского,пер. Медуницинский,пер. Межевой,пер. Нагорный,пер. Некрасовский,пер. Никольский,пер. Новый,пер. Овражный,пер. Огородный,пер. Ольховый,пер. Парковый,пер. Паровозный,пер. Поселковый,пер. Почтовый,пер. Производственный,пер. Прудный,пер. Прядильный,пер. Прямой,пер. Раздельный,пер. Рыбный,пер. Рыночный,пер. Слесарный,пер. Содемский,пер. Средний,пер. Станционный,пер. Судоремонтный,пер. Техникумовский,пер. Технический,пер. Тихий,пер. Тихий 1-й,пер. Ткацкий,пер. Топливный,пер. Тополевый,пер. Трудовой,пер. Тупиковый,пер. Турундаевский 1-й,пер. Турундаевский 2-й,пер. Турундаевский 3-й,пер. Турундаевский 4-й,пер. Узкий,пер. Февральский,пер. Флотский,пер. Центральный,пер. Чернышевского,пер. Чехова,пер. Школьный,пер. Южная Роща,пер. Южный,пер. Янгосорский,пл. Бабушкина,пл. Кремлевская,пл. Революции,пл. Свободы,пл. Торговая,пл. Чайковского,пр. Победы,пр. Советский,пр-д Говоровский,пр-д Линейный,пр-д Осановский,туп. Грузовой,туп. Ленинградский,угл. Гончарная,ул.  Маяковского,ул. 1-ая Садовая,ул. 2-ая Кирилловская,ул. 2-ая Садовая,ул. 3 Интернационала,ул. 3-я Садовая,ул. 4-ая Полевая,ул. 4-ая Садовая,ул. 5-ая Садовая,ул. 6-ая Садовая,ул. 7-ая Садовая,ул. 8-ая Садовая,ул. Авксентьевского,ул. Ананьинская,ул. Архангельская,ул. Баранковская,ул. Батюшкова,ул. Беляева,ул. Береговая,ул. Благовещенская,ул. Болонина,ул. Бурмагиных,ул. Варенцовой,ул. Ветошкина,ул. Водников,ул. Возрождения,ул. Вологодская,ул. Воркутинская,ул. Воровского,ул. Восточная,ул. Гагарина,ул. Галкинская,ул. Геофизическая,ул. Герцена,ул. Гиляровского,ул. Говоровская,ул. Гоголя,ул. Горка,ул. Городской вал,ул. Горького,ул. Граничная,ул. Дальняя,ул. Дачная,ул. Детская,ул. Дзержинского,ул. Добролюбова,ул. Доронинская,ул. Дубровская,ул. Дьяконовская,ул. Евковская,ул. Емельянова,ул. Ершовская,ул. Железнодорожная,ул. Завражская,ул. Заливная,ул. Западная,ул. Заречная,ул. Засодимского,ул. Звездная,ул. Зеленая,ул. Зосимовская,ул. Ильюшина,ул. Индустриальная,ул. Казакова,ул. Каменный мост,ул. Канифольная,ул. Карла Маркса,ул. Кирова,ул. Кирпичная,ул. Клубова,ул. Козленская,ул. Колхозная,ул. Коминтерна,ул. Коммунистическая,ул. Комсомольская,ул. Конева,ул. Коничева,ул. Копанка,ул. Копрецовская,ул. Короткая,ул. Костромская,ул. Красноармейская,ул. Крюк,ул. Кубинская,ул. Кувшиновская,ул. Лаврова,ул. Левичева,ул. Леденцова,ул. Ленина,ул. Ленинградская,ул. Лермонтова,ул. Лесобиржа,ул. Лечебная,ул. Линейная,ул. Ловенецкого,ул. Луговая,ул. Лукьяновская,ул. Луначарского,ул. М.Поповича,ул. Малая Сибирская,ул. Малиновая,ул. Мальцева,ул. Машиностроительная,ул. Медуницинская,ул. Мелиораторов,ул. Мира,ул. Мишкольцская,ул. Можайского,ул. Молодежная,ул. Монастырская,ул. Московская,ул. Мохова,ул. Мудрова,ул. Набережная,ул. Народная,ул. Некрасова,ул. Никольская,ул. Новгородская,ул. Образцова,ул. Овражная,ул. Октябрьская,ул. Ольховая,ул. Орлова,ул. Осановская,ул. Открытая,ул. Панкратова,ул. Парковая,ул. Первомайская,ул. Петина,ул. Петрозаводская,ул. Пионерская,ул. Пирогова,ул. Планерная,ул. Подлесная,ул. Полевая,ул. Полярная,ул. Поселковая,ул. Почтовая,ул. Предтеченская,ул. Преображенского,ул. Пригородная,ул. Прилуцкая,ул. Присухонская,ул. Проектируемая,ул. Прокатова,ул. Пролетарская,ул. Промышленная ,ул. Профсоюзная,ул. Прядильщиков,ул. Псковская,ул. Пугачева,ул. Путейская,ул. Пушкинская,ул. Рабочая,ул. Разина,ул. Республиканская,ул. Рощинская,ул. Рубцова,ул. Рыбкино,ул. Рыбная,ул. С.Преминина,ул. Садовая,ул. Саммера,ул. Самойло,ул. Связи,ул. Северная,ул. Сиреневая,ул. Слободская,ул. Сметьевская,ул. Советская,ул. Сокольская,ул. Солнечная,ул. Солодунова,ул. Спирина,ул. Средняя,ул. Строителей,ул. Студенческая,ул. Судоремонтная,ул. Сухонская,ул. Текстильщиков,ул. Тендрякова,ул. Тепенькинская,ул. Техническая,ул. Тихая,ул. Товарная,ул. Трактористов,ул. Транспортная,ул. Трудовая,ул. Турундаевская,ул. Угловая,ул. Ударников,ул. Ульяновой,ул. Усадебная,ул. Фрязиновская,ул. Хлюстова,ул. Хорхоринская,ул. Цветочная,ул. Центральная,ул. Чапаева,ул. Челюскинцев,ул. Череповецкая,ул. Чернышевского,ул. Четряковская,ул. Чехова,ул. Чкалова,ул. Шараповская,ул. Шекснинская,ул. Шмидта,ул. Щетинина,ул. Элеваторная,ул. Энгельса,ул. Южакова,ул. Ягодная,ул. Ярославская,ул. Яшина,ул.Залинейная,шос. Белозерское,шос. Ленинградское,шос. Московское,шос. Ново-Архангельское,шос. Окружное,шос. Пошехонское,шос. Старое".split(',')
#    for i in streets_line:
#        streets = Streets()
#        streets.init(i)
#        db.session.add(streets)
#        db.session.commit()
#    return json.dumps(streets_line)
#

@market_module.route('/get_streets')
def get_streets():
    streets = Streets.query.all()
    temp = {}
    for i in streets:
        temp[i.id] = {}
        temp[i.id]["name"] = i.name
    return json.dumps(temp)

@app.context_processor
def my_utility_processor():

    def get_name(id):
        product = Product.query.filter_by(id=id)
        name = ''
        for i in product:
            name = i.name
        return name

    def get_sum(id,cnt):
        product = Product.query.filter_by(id=id)
        price = 0
        for i in product:
            price = i.price
        summ = cnt*price
        return summ

    return dict(get_name=get_name, get_sum=get_sum)