from datetime import datetime
import requests
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import psycopg2
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, MetaData
from sqlalchemy.orm import sessionmaker
import time
from decouple import config

databaseconn = config('DATABASE_URL')

app = Flask(__name__)

Base = declarative_base()
DATABASE_URI = "postgresql+"+databaseconn
herokupgsqlengine = create_engine(DATABASE_URI)
Session = sessionmaker(herokupgsqlengine)  
session = Session()
orderlist = []

class Orders(Base):
    __tablename__ = 'drinkorders'
    ordernum = Column(Integer, primary_key = True)
    date = Column(String, nullable = False)
    cashorcardnum = Column(Integer, nullable = False)
    expdate = Column(Integer, nullable=False)
    total = Column(Float, nullable=False)
    orderprocessedtime = Column(String, nullable=True)
    
    def __init__(self, ordernum, date, cashorcardnum, expdate, total, orderprocessedtime):
        self.ordernum = ordernum
        self.date = date
        self.cashorcardnum = cashorcardnum
        self.expdate = expdate
        self.total = total
        self.orderprocessedtime = orderprocessedtime
    
class ItemsForOrders(Base):
    __tablename__ = 'OrderItemList'
    id = Column(Integer, primary_key = True, autoincrement=True)
    ordernum = Column(Integer, ForeignKey("drinkorders.ordernum"))
    drinkdate = Column(String, nullable = False)
    drink = Column(String, nullable = False)
    drinkprice = Column(Integer, nullable=False)
    qty = Column(Integer, nullable=False)
    subtotal = Column(Integer, nullable=False)
    orderprocessedtime = Column(String, nullable=True)
    
    def __init__(self, ordernum, drinkdate, drink, drinkprice, qty, subtotal, orderprocessedtime):
        self.ordernum = ordernum
        self.drinkdate = drinkdate
        self.drink = drink
        self.drinkprice = drinkprice
        self.qty = qty
        self.subtotal = subtotal
        self.orderprocessedtime = orderprocessedtime

def deletetables(theengine):
    OrdersTable = Base.metadata.tables['drinkorders']
    Base.metadata.drop_all(bind=theengine)
    DrinkTable = Base.metadata.tables['OrderItemList']
    Base.metadata.drop_all(bind=theengine)
 
#deletetables(herokupgsqlengine)
    
#Base.metadata.create_all(herokupgsqlengine)

def gettime():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return current_time

@app.route("/")
def hello_world():
    return render_template("asking.html")

@app.route('/processorder', methods = ['POST'])
def insertdata(): #this will insert data into both classes
    finalizedorder = request.get_json('finalizedorder')
    ordertime = gettime()
    
    neworderdata = Orders(finalizedorder[0][1], finalizedorder[0][0], finalizedorder[2][1], finalizedorder[2][2], finalizedorder[2][3], ordertime)#ordernum, cashcard, expdate, total, time
    session.add(neworderdata)
    session.commit()
    session.close()
    
    for eachdrink in finalizedorder[1]:
        EachItemInOrder = ItemsForOrders(finalizedorder[0][1], finalizedorder[0][0], eachdrink[0], eachdrink[1], eachdrink[2], eachdrink[3], ordertime)
        session.add(EachItemInOrder)
        session.commit()
        session.close()

    return "Received the package, mate."

@app.route('/firstcount', methods = ['GET'])
def getordercount():
    orders = session.query(Orders).all()
    for order in orders:
        orderlist.append([order.date, order.ordernum, order.cashorcardnum, order.expdate, order.total])
    newordernumber = len(orderlist)
    return jsonify(newordernumber)

@app.route('/orderlistandcount', methods = ['GET'])
def getallorders():
    orders = session.query(Orders).all()
    for order in orders:
        orderlist.append([order.date, order.ordernum, order.cashorcardnum, order.expdate, order.total])
    newordernumber = len(orderlist)
    infobuffet = [orderlist, newordernumber]
    return jsonify(infobuffet)
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', '5000')) #This line is specifically for launching on Heroku.
