const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');
const http = require('http');
const cookieParser = require('cookie-parser');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require("webpack-hot-middleware");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const session = require('express-session');

const swaggerDocument = YAML.load('./server/swagger/swagger.yaml');
const webpackConfig = require('../webpack.config');
const { queryHandler } = require('./handlers/queryHandler');
const queryExportHandler = require('./handlers/queryExportHandler');
const { frequencyHandler } = require('./handlers/frequencyHandler');
const frequencyExportHandler = require('./handlers/frequencyExportHandler');
const getFileByFrogIdHandler = require('./handlers/getFileByFrogIdHandler');
const addUserHandler = require('./handlers/createUserHandler');
const loginHandler = require('./handlers/loginHandler');
const logoutHandler = require('./handlers/logoutHandler');
const getFrogDataByIdHandler = require('./handlers/getFrogDataById');
const authenticationHandler = require('./handlers/authenticationHandler');
const authenticationMiddleware = require('./handlers/_utils/authenticationMiddleware');
const { initialize: initializeDatabase } = require('./db');
const config = require('./../config.json');


(async () => {
  bodyParserXml(bodyParser);

  const port = parseInt(process.env.PORT, 10) || 8080;

  const app = express();
  const server = http.createServer(app);

  const compiler = webpack(webpackConfig);

  app.use('/api', swaggerUi.serve);
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: config.SECRET, 
    resave: true,
    saveUninitialized: true,
    cookie: true
  }))


  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    next();
  });

  app.use(middleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }));

  app.use(hotMiddleware(compiler));

  await initializeDatabase();

  app.set('port', port);

  app.get('/api/documentation', swaggerUi.setup(swaggerDocument, { customCss: '.swagger-ui .topbar { display: none }' }));
  app.get('/frequency/:corpus/words/:offset', authenticationMiddleware, frequencyHandler);
  app.get('/frog/:corpus/:id', authenticationMiddleware, getFileByFrogIdHandler);
  app.get('/frog/:corpus/:id/file', authenticationMiddleware, getFrogDataByIdHandler);
  app.get('/query_export/:corpus', authenticationMiddleware, queryExportHandler);
  app.get('/frequency_export/:corpus', authenticationMiddleware, frequencyExportHandler);
  app.post('/cql_query/:corpus/:offset', authenticationMiddleware, queryHandler);
  app.get('/user/auth', authenticationHandler);
  app.post('/user/login', loginHandler);
  app.post('/user/logout',authenticationMiddleware, logoutHandler);
  app.post('/user/new', addUserHandler);

  server.listen(port, () => console.log(`server listening on port ${port}`));
})();