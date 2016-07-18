const express = require('express');
const bunyanExpress = require('express-bunyan-logger');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request-promise');

function startServer(config, log) {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.set('views', 'views');
  app.set('view engine', 'pug');

  app.use('/public', express.static(path.join(__dirname, 'public')));

  app.use(bunyanExpress({
    logger: log,
    excludes: ['body', 'short-body', 'req-headers', 'res-headers', 'incoming'],
    format: ':res[statusCode] :method :url'
  }));

  app.get('/api/movies', (req, res, next) => {
    request({ uri: `${config.jackie}/movies`, json: true}).then(data => {
      res.send(data);
    }).catch(next);
  });

  app.post('/api/add-movie', (req, res, next) => {
    request({
      method: 'POST',
      uri: `${config.jackie}/add-movie`,
      body: req.body,
      json: true
    }).then(() => {
      res.sendStatus(201);
    }).catch(next);
  });

  app.get('/', (req, res) => {
    res.render('index');
  });

  app.listen(config.port, () => {
    log.info(`${config.name} server started: listening on port ${config.port}`);
  });

}

module.exports = startServer;