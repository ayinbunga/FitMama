

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

//logout function

var logout = function() {
  localStorage.setItem("username", "");
  fn.load('login.html');
}

$('document').ready(function(){

  var username = localStorage.getItem('username');

  if (username != ""){
    fn.load('profile.html');
  }
  else {
    fn.load('login.html');
  }

});


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
        localStorage.setItem("username", username);
        fn.load('duedatecalc.html')
        }
        
    var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
    db.transaction(populateDB,errorCB,successCB);
    }

  else { 

    alert("Invalid input!");
    }
    
    
};

//login function

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


//calculate current week of pregnancy

var calcCurrentWeek = function() {

  var username = localStorage.getItem('username');
  var thedate = $("#duedate").val();

  var today = new Date();
  var last_menstrual_period = new Date(thedate);
  last_menstrual_period.setDate ( last_menstrual_period.getDate() - 280 );

  var lmp_date = last_menstrual_period.getFullYear()+'-'+ last_menstrual_period.getMonth() +'-'+ last_menstrual_period.getDate();
  
  console.log(lmp_date);

  var estimated_gestational_age = today - last_menstrual_period;
  estimated_gestational_age = estimated_gestational_age/86400000;

  var weeks = parseInt(estimated_gestational_age/7);

  if (weeks > 42 || weeks < 0 ) {
    alert('Error!');
  }
  else
  {
    var days = estimated_gestational_age % 7;
    days = Math.round(days*1)/1;

    var result = weeks + 'weeks and ' + days + ' /7 days ';

    if (days == 0) { var result = weeks + ' weeks exactly '}
    if (days == 7) { var result = weeks+1 + ' weeks exactly '}

    $('document').ready(function(){
      var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
      db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_profile(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username, lmp_date, duedate)');
                  tx.executeSql('INSERT INTO user_profile(username, lmp_date, duedate) VALUES(?, ?, ?)', [username, lmp_date, thedate]);
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

    fn.load('profile.html');
  }

    console.log(result);
}

