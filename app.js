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

});

app.post('/task/add', (req, res) => {
    const { task } = req.body;

    client.rpush('Tasks', task, (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log("Task added")
        res.redirect('/');
    });
});

app.post('/task/delete', (req, res) => {
    const taskToDelete  = req.body.tasks;

    client.lrange('Tasks', 0, -1, (err, tasks) => {
        for (var i = 0; i < tasks.length; i++) {
            if (taskToDelete.indexOf(tasks[i]) > -1) {
                client.lrem('Tasks', 0, tasks[i], () => {
                    if (err) {
                        console.log(err);
                    }
                    console.log("Task removed");
                });
            };
        };
        
        res.redirect('/');
    });
});



// Port config 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

module.exports = app;