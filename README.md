# BarRegisterApp
A simple app to use for processing drink orders at a bar.

- [Overview](#overview)
- [Built With](#built-with)
- [Features](#features)

## Overview
 ![BarRegisterScreen](https://user-images.githubusercontent.com/49132327/189694095-abb93f9d-7293-4a78-aaef-5d90dc50827b.PNG)

I coded this project in order to get familiar with Heroku and to understand how relational databases work. Learning about the files needed for running a Heroku app was a bit of a journey but definitely worthwhile to learn. I've also learned how to make and work in a virtual environment, which I've come to love working with. I strongly recommend making a virtual environment first before running the project and downloading all dependencies in the requirements.txt. This can be done in the command line by changing directory ("cd") to the directory of your virtualenv and entering "pip install -r requirements.txt".

### Built With
This project was made with
Flask: https://flask.palletsprojects.com/en/2.2.x/
JQuery: https://jquery.com/download/ - I used ajax requests to the BarRegister.py server for order entering and retrieval.
I am using a Postgresql database on Heroku and SQLAlchemy in the Python file to query the database.

## Features
<!-- TODO: List what specific 'user problems' that this application solves. -->
I have an extensive history in customer service and have come across systems that I believed could be made better for the service agents that were using them. I've decided to start with attempting to develop a simple register system for bartenders to use to process drink orders.

You may click the button "ADD NEW ORDER" to start a new order, which is connected to function AddNewOrder() and creates a new NewOrder() class object. This is then placed into the currentorder variable. All further methods are called from that variable.

The SaveToPending and PendingToCurrent functions are for later functions I would like to add to the project, having a list of pending orders for customers who are drinking but have not yet closed their orders. You may comment these out if you'd like.

You may click the buttons in the Drink List to add them to your current order. These are connected to eventListeners which call the AddDrinktoNewOrder() class method.

Click on the quantity or price of your drink in order to change them. These are connected to the ModifyQtyDrink() and ModifyPriceDrink() class methods.

Click the "FINALIZE ORDER" button to send your order to the database. This is connected to the FinalizeOrder() function, which sends the currentorder class object through an ajax request to be sent to the Postgresql database, to the Orders and ItemsForDrinks classes.. A Flask view then returns all current orders in the database, which is displayed in the "FINALIZED ORDERS" box.
