
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
  fn.load('plan.html');
  displaylist();
};

var showPopover = function(target) {
  document
    .getElementById('popover')
    .show(target);
};

var hidePopover = function() {
  document
    .getElementById('popover')
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
    console.log(weeklisthead[0][0].length);
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
        tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, password)');
        tx.executeSql('INSERT INTO user(created, username, password) VALUES(?, ?, ?)', [created, username, password]);
        }
          
    function errorCB(err){
        alert("error");
        }
    
    function successCB(){
        localStorage.setItem("username", username);
        fn.load('duedatecalc.html');
        }
        
    //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
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
    
    //$('document').ready(function(){
      //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
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
    //});
  }
  else { ons.notification.alert("Invalid input!") }
  
};


//calculate current week of pregnancy and storing due date

var calcCurrentWeek = function() {

  var username = localStorage.getItem('username');
  var thedate = $("#duedate").val();

  var today = new Date();
  var last_menstrual_period = new Date(thedate);
  last_menstrual_period.setDate ( last_menstrual_period.getDate() - 280 );

  var lmp_date = last_menstrual_period.getFullYear()+'-'+ last_menstrual_period.getMonth() +'-'+ last_menstrual_period.getDate();
  
  //console.log(lmp_date);

  var estimated_gestational_age = today - last_menstrual_period;
  estimated_gestational_age = estimated_gestational_age/86400000;

  var weeks = parseInt(estimated_gestational_age/7);

  if (weeks > 42 || weeks < 0 ) {
    alert('Error!');
  }
  else
  {
    //$('document').ready(function(){
      //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
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
    //});

    localStorage.setItem("username", username);
    profileloader();
  }

};


//display baby info

var displayinfo = function() {

  var currentweek = localStorage.getItem('currentweek');

  //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
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

  //var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_info WHERE id=?', [currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--material'> <div class='list__item__left list__item--material__left'> <label class='checkbox checkbox--material'> <input type='checkbox' id='checkbox3' class='checkbox__input checkbox--material__input'> <div class='checkbox__checkmark checkbox--material__checkmark'></div> </label></div> <label for='checkbox3' class='list__item__center list__item--material__center'> <div class='list__item__title list__item--material__title'>" + results.rows.item(i).info + "</div> </label> </li>")
              //$("#todo-list").listview('refresh');
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }

};
    

//checkCurrentWeek

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
              var duedate = results.rows.item(i).duedate;

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

              document.getElementById("current_user").innerHTML = username;
              document.getElementById("weeks").innerHTML = currentweek;

            }

          }

          else {

          }
      }
      
      function errorCB(err){
        alert("Error" + err.code);  }

};

//store weekly info


