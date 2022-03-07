## Ecommerce site to test the streaming of data from different apps
<b>Tausi</b>: a Node JS application, that contains the main schema for the e-commerce website.
It acts as the entry point to the database. It contains the following schemas:
* cart
* product categories
* orders
* products
* transactions (mpesa transactions)
* users 

The database is a MongoDB database

<b>Test Data</b>: used to simulate data from a real customers and how a real e-commerce site would work. It does this by sending post requests to the tausi website. 
It contains:
* A MySQL database
* Python Scripts that retrieve the data from the DB and send JSON post requests to the tausi Node JS application.

It therefore has 2 containers:
<ol>
    <li>MySQL database</li>
    <li>Python Container</li>
</ol>

<b>Streams</b>: implementation of how data would move from the mongoDB to streaming platforms

<b>Batch</b>: Implementation of batch data processing