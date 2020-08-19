const express = require('express');
const router = express.Router();


const controller = require('../controller/controller');

router.get('/', controller.getAllTask);

router.post('/task/add', controller.addTask);

router.post('/task/delete', controller.deleteTask);

router.post('/call/add', controller.nextCall);

module.exports = router;