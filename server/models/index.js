var models = require('../models');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var db = require('../db');

var User = db.define('User', {
  id: {type: Sequelize.INTEGER, primaryKey: true},
  username: Sequelize.STRING
}, {timestamps: false});

var Message = db.define('Message', {
  id: {type: Sequelize.INTEGER, primaryKey: true},
  message: Sequelize.STRING,
  roomname: Sequelize.STRING,
  time: Sequelize.INTEGER,
  'id_users': {
    type: Sequelize.INTEGER,
    reference: {
      model: User,
      key: 'id'
    }
  }
}, {timestamps: false});

module.exports = {
  messages: {
    get: function (req, res) {
      db.query('SELECT * FROM messages;', function(err, rows) {
        if (err) {
          console.log(err, 'error in message get');
        } else {
          console.log(rows);
          res.end(JSON.stringify(rows));
        }
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      var username = req.body.username;
      var message = req.body.message;
      var roomname = req.body.roomname;
      var time = Math.floor(Date.now() / 1000);
      //(select id from users where name = "' + username + '")
      db.query('INSERT INTO messages (message, time, roomname, id_users) VALUES ("' + message + '", "' + time + '", "' + roomname + '", "1");', function(err, row) {
        if (err) {
          console.log(err, 'error in messages post');
        } else {
          console.log('success in messages post');
          console.log(row);
        }
        res.end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      User.sync()
        .then(function() {
          return res.end(JSON.stringify(User.findAll()));
        })
        .then(function() {
          // return db.close();
        })
        .catch(function(err) {
          // Handle any error in the chain
          console.error(err);
          res.end();
          return; 
        });
    },
    // function (req, res) {
    //   db.query('SELECT * FROM users;', function(err, rows) {
    //     if (err) {
    //       console.log(err, 'error in users get');
    //     } else {
    //       res.end(JSON.stringify(rows));
    //     }
    //   });
    post: function (req, res) {
      User.sync()
        .then(function() {
          // JSON.stringify(req.body.username)
          return User.create({username: 'Jean Valjean'});
        })
        .then(function() {
          res.end();
          // db.close();
        })
        .catch(function(err) {
          // Handle any error in the chain
          console.error(err);
          res.end();
          // db.close();
        });
    }
  }
};


    // function (req, res) {
    //   //query to see if username exists
    //   db.query('SELECT name FROM users WHERE name = "' + req.body.username + '";', function(err, row) {
    //     if (row.length) {
    //       res.end();
    //     } else {
    //       //if it doesn't exist run insert query
    //       db.query('INSERT INTO users (name) VALUES ("' + req.body.username + '");', function(err, row) {
    //         if (err) {
    //           console.log(err, 'error in row ');
    //         } else {
    //           console.log('success in users post');
    //         }
    //         res.end();
    //       });
    //     }
    //   });
    // }

