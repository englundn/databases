var mysql = require('mysql');

// Create a database connection and export it from this file.

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chat'
});

connection.connect(function(err) {
  if (err) {
    console.log(err, 'error');
  } else {
    console.log('success!');
  }
});

// connection.end(function(err) {
//   console.log(err, 'error');
// });

module.exports = connection;
// You will need to connect with the user "root", no password,
// and to the database "chat".


