
//side menu controller

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.close = function() {
  var menu = document.getElementById('menu');
  menu.close();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
  //checkCurrentWeek();
};

var profileloader = function() {
  checkCurrentWeek();
  fn.load('profile.html');
};

var timelineloader = function() {
  checkCurrentWeek();
  displayinfo();
  fn.load('timeline.html');
};

var planloader = function() {
  checkCurrentWeek();
  displaylist();
  fn.load('plan.html');
  
};

var showDialog = function(id) {
  document
    .getElementById(id)
    .show();
};

var hideDialog = function(id) {
  document
    .getElementById(id)
    .hide();
};


//logout function

var logout = function() {
  localStorage.setItem("username", "");
  localStorage.setItem("currentweek", "");
  localStorage.setItem("lmp_date", "");
  localStorage.setItem("duedate","");
  localStorage.setItem("days","");
  fn.load('login.html');
}

//open up application

$('document').ready(function(){

  var username = localStorage.getItem('username');

  if (username != ""){
    var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
    fn.load('profile.html');
    checkCurrentWeek();
  }
  else {
    var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
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
        tx.executeSql('INSERT INTO user(created, username, password) VALUES(?, ?, ?)', [created, username, password]);
        }
          
    function errorCB(err){
        alert("error");
        }
    
    function successCB(){
        localStorage.setItem("username", username);
        fn.load('duedatecalc.html');
        }
        
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
        
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user WHERE username=? and password=?', [username,password], querySuccess, errorCB);
      });
      
      function querySuccess(tx, results){
        var len = results.rows.length;
          if(len > 0){
            checkCurrentWeek();
            fn.load('profile.html');
              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }
  }
  else { ons.notification.alert("Invalid input!") }
  
};


//calculate current week of pregnancy and storing user profile

var calcCurrentWeek = function() {

  var username = localStorage.getItem('username');
  var iconimg = "img/temp.JPG";
  var NULL = "";


  var thedate = $("#duedate").val();
  var today = new Date();
  var last_menstrual_period = new Date(thedate);
  
  last_menstrual_period.setDate ( last_menstrual_period.getDate() - 280 );

  var lmp_date = last_menstrual_period.getFullYear()+'-'+ last_menstrual_period.getMonth() +'-'+ last_menstrual_period.getDate();

  var estimated_gestational_age = today - last_menstrual_period;
  estimated_gestational_age = estimated_gestational_age/86400000;
  var weeks = parseInt(estimated_gestational_age/7);

  

  if (weeks > 42 || weeks < 0 ) {
    alert('The date you entered is not valid!');
  }
  else
  {
      db.transaction(function(tx){
        tx.executeSql('INSERT INTO user_profile(username, firstname, lastname, iconimg, lmp_date, duedate) VALUES(?, ?, ?, ?, ?, ?)', [username, NULL, NULL, iconimg, lmp_date, thedate]);
      });
      
      function querySuccess(tx, results){
        var len = results.rows.length;
          if(len > 0){
            fn.load('profile.html');
              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }

    localStorage.setItem("username", username);
    profileloader();
  }

};

//check current week for current user and display user info

var checkCurrentWeek = function () {

  var username = localStorage.getItem('username');

  //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user_profile WHERE username=?', [username], querySuccess, errorCB);
      });
      
      function querySuccess(tx, results){
      
        var len = results.rows.length;  
          if(len > 0){
            for(i = 0; i < len; i++){

              var lmp_date = results.rows.item(i).lmp_date;
              var firstname = results.rows.item(i).firstname;
              var lastname = results.rows.item(i).lastname;
              var duedate = results.rows.item(i).duedate;
              var url = results.rows.item(i).iconimg;
              var NULL = "";

              console.log(url);

              localStorage.setItem("lmp_date", lmp_date);
              localStorage.setItem("duedate", duedate);

              var today = new Date();
              var last_menstrual_period = new Date(duedate);

              last_menstrual_period.setDate ( last_menstrual_period.getDate() - 280 );
              var estimated_gestational_age = today - last_menstrual_period;
              estimated_gestational_age = estimated_gestational_age/86400000;

              var weeks = parseInt(estimated_gestational_age/7);

              var days = estimated_gestational_age % 7;
              days = Math.round(days*1)/1;

              localStorage.setItem("currentweek", weeks);
              localStorage.setItem("days", days);

              var currentweek = localStorage.getItem('currentweek');

              document.getElementById("weeks").innerHTML = currentweek;
              $('#profilepic').attr('src', url);

              if ( firstname != NULL || lastname != NULL ) {
                document.getElementById("current_user").innerHTML = firstname + " " + lastname;
              } else {
                document.getElementById("current_user").innerHTML = username;
                //$('#firstname').append(firstname);
              }
              

            }

          }

          else {

          }
      }
      
      function errorCB(err){
        alert("Error" + err.code);  }

};

//add new activity

var addactivity = function () {

  var username = localStorage.getItem('username');
  var currentweek = localStorage.getItem('currentweek');
  var new_activity = $("#new_activity").val();

  function populateDB(tx){
    //tx.executeSql('CREATE TABLE IF NOT EXISTS user_activity (username, week INTEGER, activity)');
    tx.executeSql('INSERT INTO user_activity (username, week, activity) VALUES(?,?,?)', [ username, currentweek, new_activity]);
    hideDialog('addform');
    planloader();
  }
          
  function errorCB(err){
    alert("error");
  }
    
  function successCB(){
  }    
  
  db.transaction(populateDB,errorCB,successCB);

}


//display baby info

var displayinfo = function() {

  var currentweek = localStorage.getItem('currentweek');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_info WHERE id=?', [currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0;i < len; i++) {
              document.getElementById("babyinfo").innerHTML = results.rows.item(i).info;
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }

};

//display to do lists

var displaylist = function() {

  var currentweek = localStorage.getItem('currentweek');
  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list WHERE week = ?', [currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--material'> <div class='list__item__left list__item--material__left'> <label class='checkbox checkbox--material'> <input type='checkbox' id='checkbox3' class='checkbox__input checkbox--material__input'> <div class='checkbox__checkmark checkbox--material__checkmark'></div> </label></div> <label for='checkbox3' class='list__item__center list__item--material__center'> <div class='list__item__title list__item--material__title'>" + results.rows.item(i).activity + "</div> </label> </li>");
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM user_activity WHERE username=? AND week=?', [username, currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--material'> <div class='list__item__left list__item--material__left'> <label class='checkbox checkbox--material'> <input type='checkbox' id='checkbox3' class='checkbox__input checkbox--material__input'> <div class='checkbox__checkmark checkbox--material__checkmark'></div> </label></div> <label for='checkbox3' class='list__item__center list__item--material__center'> <div class='list__item__title list__item--material__title'>" + results.rows.item(i).activity + "</div> </label> </li>");
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }

};

//edit user profile

var editprofile = function() {

var username = localStorage.getItem('username');
var firstname = $("#firstname").val();
var lastname = $("#lastname").val();
        
db.transaction(function (tx) {
        tx.executeSql('UPDATE user_profile SET firstname=?, lastname=? WHERE username = ?', [firstname, lastname, username]);
    });


profileloader();

};

//edit profile img

var editimg = function() {

  var username = localStorage.getItem('username');
  var url =  $('#profilepic').attr('src');


  db.transaction(function (tx) {
      tx.executeSql('UPDATE user_profile SET iconimg=?, WHERE username = ?', [url, username]);
    });

  hideDialog('editprofile_form');
  profileloader();

};






