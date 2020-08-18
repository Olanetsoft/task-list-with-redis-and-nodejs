const redis = require('redis');

// Create Redis client

const client = redis.createClient();

client.on('connect', () => {
    console.log('Redis Server Connected.. ')
});


exports.getAllTask = (req, res) => {
    const title = 'Task List';

    client.lrange('Tasks', 0, -1, (err, reply) => {
        res.render('index', {
            title,
            tasks: reply
        });
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