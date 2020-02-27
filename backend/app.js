const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./app_api/models/db');
require('./app_api/config/passport');

app.use(passport.initialize());
app.use('/api', routesApi)