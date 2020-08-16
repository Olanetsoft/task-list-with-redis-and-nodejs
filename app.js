const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();

// Create Redis client

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis Server Connected.. ')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// This line below is required to parse the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Global Middleware registered
// Using morgan only in development
if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
};

app.get('/', (req, res) => {
    const title = 'Task List';

    client.lrange('Tasks', 0, -1, (err, reply) => {
        res.render('index', {
            title,
            tasks: reply
        });
    });


})


// Port config 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

module.exports = app;