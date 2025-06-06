/**
 * Module dependencies.
 */

const express = require('express')
  , routes = require('./routes')
  , hike = require('./routes/hike')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql2')
  , async = require('async')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , morgan = require('morgan')
  , errorhandler = require('errorhandler');

const { connect } = require('http2');

const app = express()

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


if (process.env.NODE_ENV === 'production') {
  console.log('Attempting to create connection to production database');
  app.set('connection', mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT}));  
} else {
  console.log('Attempting to create connection to development database');
  // TODO: Place local mysql connection information here. You need to have mysql running locally on your machine for this example to work
  app.set('connection', mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD}));

    // host: 'mysql',
    // user: 'root',
    // port: 3306,
    // password: 'password'}));
}

function init() {
  app.get('/', routes.index);
  // app.get('/users', user.index);
  app.get('/hikes', hike.index);
  app.post('/add_hike', hike.add_hike);

  // http.createServer(app).listen(app.get('port'), function(){
  //   console.log("Express server listening on port " + app.get('port'));
  // });

  http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
    console.log("Express server listening on port " + app.get('port'));
});

  if (process.env.NODE_ENV === 'development') {
    // only use in development environment
    app.use(morgan('dev'));
    app.use(errorhandler('dev'))
  }
}

const client = app.get('connection');
async.series([
  function connect(callback) {
    client.connect(callback);
    console.log('Connected!');
  },
  function clear(callback) {
    client.query('DROP DATABASE IF EXISTS mynode_db', callback);
  },
  function create_db(callback) {
    client.query('CREATE DATABASE mynode_db', callback);
  },
  function use_db(callback) {
    client.query('USE mynode_db', callback);
  },
  function create_table(callback) {
     client.query('CREATE TABLE HIKES (' +
                         'ID VARCHAR(40), ' +
                         'HIKE_DATE DATE, ' +
                         'NAME VARCHAR(40), ' +
                         'DISTANCE VARCHAR(40), ' +
                         'LOCATION VARCHAR(40), ' +
                         'WEATHER VARCHAR(40), ' +
                         'PRIMARY KEY(ID))', callback);
  },
  function insert_default(callback) {
    const hike = {HIKE_DATE: new Date(), NAME: 'Hazard Stevens',
          LOCATION: 'Mt Rainier', DISTANCE: '4,027m vertical', WEATHER:'Bad', ID: '12345'};
    client.query('INSERT INTO HIKES set ?', hike, callback);
  }
], function (err, results) {
  if (err) {
    console.log('Exception initializing database.');
    throw err;
  } else {
    console.log('Database initialization complete.');
    init();
  }
});

// const client = app.get('connection');

// async.series([
//   function connect(callback) {
//     client.connect(function(err) {
//       if (err) {
//         console.log('Error connecting to MySQL:', err);
//         callback(err);  // Calling callback with error if connection fails
//       } else {
//         console.log('Connected!');
//         callback(); // Calling callback without error on successful connection
//       }
//     });
//   },
//   function clear(callback) {
//     client.query('DROP DATABASE IF EXISTS mynode_db', function(err) {
//       if (err) {
//         console.log('Error clearing database:', err);
//         callback(err);
//       } else {
//         callback();  // No error, continue
//       }
//     });
//   },
//   function create_db(callback) {
//     client.query('CREATE DATABASE mynode_db', function(err) {
//       if (err) {
//         console.log('Error creating database:', err);
//         callback(err);
//       } else {
//         callback();  // No error, continue
//       }
//     });
//   },
//   function use_db(callback) {
//     client.query('USE mynode_db', function(err) {
//       if (err) {
//         console.log('Error using database:', err);
//         callback(err);
//       } else {
//         callback();  // No error, continue
//       }
//     });
//   },
//   function create_table(callback) {
//     client.query('CREATE TABLE HIKES (' +
//                  'ID VARCHAR(40), ' +
//                  'HIKE_DATE DATE, ' +
//                  'NAME VARCHAR(40), ' +
//                  'DISTANCE VARCHAR(40), ' +
//                  'LOCATION VARCHAR(40), ' +
//                  'WEATHER VARCHAR(40), ' +
//                  'PRIMARY KEY(ID))', function(err) {
//       if (err) {
//         console.log('Error creating table:', err);
//         callback(err);
//       } else {
//         callback();  // No error, continue
//       }
//     });
//   },
//   function insert_default(callback) {
//     const hike = {
//       HIKE_DATE: new Date(),
//       NAME: 'Hazard Stevens',
//       LOCATION: 'Mt Rainier',
//       DISTANCE: '4,027m vertical',
//       WEATHER: 'Bad',
//       ID: '12345'
//     };
//     client.query('INSERT INTO HIKES set ?', hike, function(err) {
//       if (err) {
//         console.log('Error inserting default hike:', err);
//         callback(err);
//       } else {
//         const hike2 = {
//           HIKE_DATE: new Date(),
//           NAME: 'Khadijah',
//           LOCATION: 'Brooklyn',
//           DISTANCE: '500m',
//           WEATHER: 'Sexy',
//           ID: '12346'
//         };
//         client.query('INSERT INTO HIKES set ?', hike2, function(err) {
//           if (err) {
//             console.log('Error inserting second hike:', err);
//             callback(err);
//           } else {
//             callback();  // No error, continue
//           }
//         });
//       }
//     });
//   }
// ], function (err, results) {
//   if (err) {
//     console.log('Exception initializing database.');
//     throw err;
//   } else {
//     console.log('Database initialization complete.');
//     init();  // Proceed to start the server
//   }
// });
