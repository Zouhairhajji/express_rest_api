const express = require("express"),
  bodyParser = require("body-parser"),
  helmet = require('helmet')
  cors = require("cors"),
  pg_lib = require("pg"),
  morgan = require("morgan");

// defining the Express app
const app = express();

app.use(helmet());
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(cors()); // enabling CORS for all requests
app.use(
  morgan("combined", {
    skip: (req, res) => {
      var ignored_endpoints = ['/api-docs', '/auth']
      return ignored_endpoints.map(e => req.originalUrl.startsWith(e) ).includes(true) 
    }
  })
);

// add routes
var auth = require("./src/routes/AuthRoute");
app.use("/auth", auth);

var monit = require("./src/routes/MonitRoute");
app.use("/monit", monit);

// add middleware page not exists

// add error middleware
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    date: Date.now(),
    message: "something broke"
  });
});

// load schedulers
require("./src/schedulers/AuthScheduler");
require("./src/schedulers/DefaultScheduler");

// load swagger
var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// start server
var server_port = 3000;
app.listen(server_port, () =>
  console.log(`Server Started on port ${server_port}`)
);
