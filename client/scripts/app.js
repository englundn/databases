// YOUR CODE HERE:
var app = {};
app.messageServer = 'http://127.0.0.1:3000/classes/messages';
app.userServer = 'http://127.0.0.1:3000/classes/users';
app.rooms = new Set();
app.username;
app.storage;
//================================initialize and rerender callout ==============================//
app.init = function() {
  app.username = window.location.search.match(/\?username([^\?])*/)[0].split('=')[1];
  $('#roomLabel').text('Tweet Feed');
  app.fetch();
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.messageServer,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received', data);
      app.storage = JSON.parse(data);
      app.displayTweets(app.storage);
      app.setRoomSelector(app.storage);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
};

app.filterFetch = function (filter) {
  var filteredData = _.filter(app.storage, function(message) {
    return message.roomname === filter;
  });
  this.displayTweets(filteredData);
};

//=============================parses and displays tweeets ===================================//
app.displayTweets = function(data) {
  var index = 0;
  console.log(Array.isArray(data));
  data.forEach(function(tweet) {
    if (!tweet.id_users || !tweet.message) {
      return;
    } else {
      if (index < 10) {
        tweet.message = tweet.message.replace(/[\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        tweet.username = tweet.id_users;
        $('#tweet' + index + ' .author').text(tweet.username);
        $('#tweet' + index + ' .tweetText').text(tweet.message);

        index++;
      }
    }
  });
};

// ========================= all methods that deal with Rooms =================================//
app.setRoomSelector = function(data) {
  data.forEach(function(tweet) {
    if (tweet.roomname) {
      if (!tweet.roomname.includes('<')) {
        app.rooms.add(tweet.roomname);
      } 
    }
  });

  $('#roomSelector').empty();
  this.rooms.forEach(function(room) {
    $('#roomSelector').append("<option value='" + room + "'>" + room + "</option>");
  });
  $('#roomSelector').append("<option value='newRoom'>New room...</option>");
  $('.roomInput').hide();

  $('.roomList').empty();
  this.rooms.forEach(function(room) {
    $('.roomList').append("<li value='" + room + "'>" + "<a href = '#' onclick = 'app.filterRoom(this)'><p>" + room + "</p></a></li>");
  });
};

app.makeRoom = function(room) {
  if (room === 'newRoom') {
    $('.roomInput').show();
  } else {
    $('.roomInput').hide();
  }

};

app.filterRoom = function(roomLink) {
  var roomName = roomLink.firstElementChild.innerHTML;
  app.filterFetch(roomName);
  $('#roomLabel').text(roomName);
};

// ========================= all methods that deal with Users =================================//

// app.filterUser = function(userLink) {
//   var userName = userLink.firstElementChild.innerHTML;
//   app.filterFetch('username', userName);
//   $('#roomLabel').text(userName);
// };

//============================posting methods ==================================================//

app.newPost = function () {
  var form = document.getElementById('form');
  var message = {};
  message.username = app.username;
  message.message = form.message.value;
  if (form.roomSelector.value === 'newRoom') {
    message.roomname = form.roomInput.value;
  } else {
    message.roomname = form.roomSelector.value;  
  }

  app.postUserName(message.username, this.postMessage, message);
};
app.postUserName = function(username, callback, message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.userServer,
    type: 'POST',
    data: JSON.stringify({username: username}),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      callback(message);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.postMessage = function(message) {
  console.log(message);
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.messageServer,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      app.fetch();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};


//initialize app
$(document).ready(function() {
  app.init();
  $('#userIdDisplay').text(app.username);
});
