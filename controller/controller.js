const redis = require('redis');

// Create Redis client

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis Server Connected.. ')
});


exports.getAllTask = (req, res) => {
    const title = 'Task List';

    client.lrange('Tasks', 0, -1, (err, reply) => {
        client.hgetall('call', (err, call) => {
            res.render('index', {
                title,
                tasks: reply,
                call: call
            });
        })

    });

};

exports.addTask = (req, res) => {
    const { task } = req.body;

    client.rpush('Tasks', task, (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log("Task added")
        res.redirect('/');
    });
};

exports.deleteTask = (req, res) => {
    const taskToDelete = req.body.tasks;

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
};

exports.nextCall = (req, res) => {
    const newCall = {};

    newCall.name = req.body.name;
    newCall.company = req.body.company;
    newCall.phone = req.body.phone;
    newCall.time = req.body.time;

    client.hmset('call',
        [
            'name', newCall.name,
            'company', newCall.company,
            'phone', newCall.phone,
            'time', newCall.time
        ],
        (err, reply) => {
            if (err) {
                console.log(err);
            };
            console.log(reply)
            res.redirect('/');
        }
    );
};