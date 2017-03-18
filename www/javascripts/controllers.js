
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


//sign up function

var signup = function() {

  var password = $("#signup_password").val();
  var username = $("#signup_username").val();
  var created = $.now();
  var NULL = "";
  
  if ( (username != NULL) && (password != NULL) ) {
      
    function populateDB(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, password)');
        tx.executeSql('INSERT INTO user(created, username, password) VALUES(?, ?, ?)', [created, username, password]);
        }
          
    function errorCB(err){
        alert("error");
        }
    
    function successCB(){
        fn.load('profile.html')
        }
        
    var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
    db.transaction(populateDB,errorCB,successCB);
    }

  else { 

    alert("Invalid input!");
    }
    
    
};

//login event.........

var login = function(){
  var username = $("#login_username").val();
  var password = $("#login_password").val();
  var NULL = "";
  
  localStorage.setItem("username", username);

  if ((username != NULL) && (password != NULL)) {
    
    $('document').ready(function(){
      var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user WHERE username=? and password=?', [username,password], querySuccess, errorCB);
      });
      
      function querySuccess(tx, results){
        var len = results.rows.length;
          if(len > 0){
            fn.load('profile.html')
              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }
    });
  }
  else { ons.notification.alert("Invalid input!") }
  
};