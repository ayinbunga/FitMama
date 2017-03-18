
//side menu controller

window.fn = {};

    window.fn.open = function() {
      var menu = document.getElementById('menu');
      menu.open();
    };

    window.fn.load = function(page) {
      var content = document.getElementById('content');
      var menu = document.getElementById('menu');
      content.load(page)
      .then(menu.close.bind(menu));
    };

//login function

var login = function() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if (username === 'bob' && password === 'secret') {
    ons.notification.alert('Congratulations!');
  }
  else {
    ons.notification.alert('Incorrect username or password.');
  }
};