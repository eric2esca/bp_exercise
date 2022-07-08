var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

var health = require('./routes/health');
var diagnosticScreener = require('./routes/diagnosticScreener');

var app = express();
app.use(cors());
app.use(helmet());

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/health', health); //In case we add a load balancer with health check requirements
app.use('/api/diagnosticScreener', diagnosticScreener); //Main route

//To host static react files with express
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`));
