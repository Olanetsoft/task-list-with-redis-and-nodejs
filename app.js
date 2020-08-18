const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

//adding the route configuration 
const allRoutes = require('./routes/route');

const app = express();

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

app.use(allRoutes);


// Port config 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}...`);
});

module.exports = app;