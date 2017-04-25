
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
  displayBabyDetails();
};

var timelineloader = function() {
  checkCurrentWeek();
  countdownActivate();
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
    profileloader();
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
            profileloader();
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
  //console.log(thedate);
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
              profileloader();
              location.reload();
              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }

    localStorage.setItem("username", username);
    

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

/*
*/

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
            document.getElementById("tdweeks").innerHTML = currentweek;
            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--tappable'> <div class='list__item__left list__item--material__left'> <label class='checkbox'> <input type='checkbox' id='"+results.rows.item(i).id+"' class='checkbox__input' name='c' onclick='check(this.id)' "+ results.rows.item(i).status +"> <div class='checkbox__checkmark'></div> </label></div> <label for='"+results.rows.item(i).id+"' class='list__item__center'>" + results.rows.item(i).activity + "</label> </li>");
            }

            for(x = 1; x < 43; x++) {
              if (x<10) {
                $("#weekly-todo-btn").append("<text class='circletext' id='tdweek"+x+"' onclick='displayToDo("+x+")'>0"+ x + "</text>");
              } 
              else {
                $("#weekly-todo-btn").append("<text class='circletext' id='tdweek"+x+"' onclick='displayToDo("+x+")'>"+ x + "</text>");
              }
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }


};

var check = function(id) {

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list WHERE id=?', [id], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0;i < len; i++) {
              
              if(results.rows.item(i).status == "NULL") {
                
                db.transaction(function(tx){
                  tx.executeSql('UPDATE weekly_list SET status = ? WHERE id = ?', ["checked", id]);
                });
      
              function querySuccess(tx, results){
                var len = results.rows.length;
                if(len > 0){
                    }
                else {
                 }
              }
    
              function errorCB(err){
                alert("Error" + err.code);  }
              }

              else if (results.rows.item(i).status == "checked") {

                db.transaction(function(tx){
                  tx.executeSql('UPDATE weekly_list SET status = ? WHERE id = ?', ["NULL", id]);
                });
      
              function querySuccess(tx, results){
                var len = results.rows.length;
                if(len > 0){
                    }
                else {
                 }
              }
    
              function errorCB(err){
                alert("Error" + err.code);  }
              }

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

//baby due date countdown

var countdownActivate = function() {

      var getDueDate = localStorage.getItem('duedate');
      var duedate = new Date(getDueDate);

      var countDownDate = new Date(duedate).getTime();

      // Update the count down every 1 second
      var x = setInterval(function() {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("demo").innerHTML = "<table width='90%' style='border: 1px solid #F6A67B; text-align: center;'> <tr class='customheader'> <td>" + days + "</td><td>"
      + hours + "</td><td>"
      + minutes + "</td><td>" + seconds 
      + "</td></tr> <tr><td>days</td><td>hours</td><td>minutes</td><td>seconds</td></tr></table>"
      ;

      // If the count down is finished, write some text 
      if (distance < 0) {
          clearInterval(x);
          document.getElementById("demo").innerHTML = "EXPIRED";
      }

      }, 1000);
}

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

//display to-do-lists

var displayToDo = function(x) {

  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list WHERE week = ?', [x], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            $("#tdweeks").empty();
            document.getElementById("tdweeks").innerHTML = x;
            $("#todolist").empty();

            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--tappable'> <div class='list__item__left list__item--material__left'> <label class='checkbox'> <input type='checkbox' id='"+results.rows.item(i).id+"' class='checkbox__input' name='c' onclick='check(this.id)' "+ results.rows.item(i).status +"> <div class='checkbox__checkmark'></div> </label></div> <label for='"+results.rows.item(i).id+"' class='list__item__center'>" + results.rows.item(i).activity + "</label> </li>");
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }


};

var playVideo = function() {

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list', [], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){

            var x=2;

            $("#myVideo").bind("ended",function(){
              

              function run() {
                  $("#myVideo source").attr("src","videos/video"+x+".mp4");
                  $("#myVideo")[0].load();
                  $("#myVideo")[0].play();
                  x++;
              }

              if(x!=5) {
                run();
              }
              else {
                document.getElementById("videoPlayer").innerHTML = ("<p> Exercise session completed </p>");

              }



          });
            
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }
  
};


var basicloader = function(){
  fn.load('basic_exercise.html');
  playVideo();
};

var displayBabyDetails = function(){

  var username = localStorage.getItem('username');
  var duedate = localStorage.getItem('duedate');
  var currentweek = localStorage.getItem('currentweek');
  date = new Date(duedate);

  var getMonthName = function(date) { var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ]; return monthNames[date.getMonth()]; };

  var birthdate = date.getMonth() + " " + getMonthName(date) + ", " + date.getFullYear();
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_info WHERE id = ?', [currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
    document.getElementById("appointbtn").setAttribute('checked','');
    document.getElementById("bbybtn").setAttribute('checked','checked');
    $("#appointlist").empty();
    $("#profilelist").empty();
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0; i < len; i++){
            if (currentweek > 22 ) {
                        $("#profilelist").append("<ons-list> <ons-list-item> <p> Expected Date </p> <span class='right'> <p class='largefont2'> "+ birthdate +" </p> </span> </ons-list-item> <ons-list-item> <p> Baby's Length </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).baby_length +"</p>  &nbsp; in </span> </ons-list-item> <ons-list-item> <p> Baby's Weight </p> <span class='right'> <p class='largefont2'>"+ results.rows.item(i).baby_weight +"</p> &nbsp;  lb </span>  </ons-list-item> </ons-list> ");
          }
            else {
                        $("#profilelist").append("<ons-list> <ons-list-item> <p> Expected Date </p> <span class='right'> <p class='largefont2'> "+ birthdate +" </p> </span> </ons-list-item> <ons-list-item> <p> Baby's Length </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).baby_length +"</p>  &nbsp; in </span> </ons-list-item> <ons-list-item> <p> Baby's Weight </p> <span class='right'> <p class='largefont2'>"+ results.rows.item(i).baby_weight +"</p> &nbsp;  oz </span> &nbsp; </ons-list-item> </ons-list> ");

            }
          }

          }

          else {

          }
  }

   function errorCB(err){
      alert("Error" + err.code);  }


};

var displayHospDetails = function(){

  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM user_hospital WHERE username = ?', [username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      $("#appointlist").empty();
      var len = results.rows.length;  
          if(len > 0){
            for(i = 0; i < len; i++){
              document.getElementById("profilelist").innerHTML = "<ons-list> <ons-list-item> <p> Hospital Name: </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).hosp_name +" </p> </span> </ons-list-item> <ons-list-item> <p> Doctor's Name: </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).doctor_name +"</p> </span> </ons-list-item> </ons-list> ";
            }
          }
  

          else {
            document.getElementById("profilelist").innerHTML = " <div align='center'> &nbsp; &nbsp; <ons-button style='margin: 50px;' onclick='showEditHosp()'> EDIT HOSPITAL DETAILS </ons-button> </div>";

          }
  }

   function errorCB(err){
      alert("Error" + err.code);  }


};

var displayAppointment = function() {

  //$("#appointbtn").attr("checked","checked");

  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM user_appointment WHERE username = ?', [username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      document.getElementById("appointbtn").setAttribute('checked','checked');

      $("#profilelist").empty();
      $("#appointlist").empty();

      document.getElementById("profilelist").innerHTML = "<ons-fab position='bottom right' ripple> <ons-icon icon='md-plus' onclick='showAppoint()'></ons-icon></ons-fab>";
      
      var len = results.rows.length;

      $("#ptitle").attr("value","Appointment "+(len+1)+" ")
          
          if(len > 0){
            for(i = len-1; i >= 0; i--){

              $("#appointlist").append("<ons-list> <ons-list-item> <div class='list__item__title'>"+ results.rows.item(i).appoint_title +" </div> <div class='list__item__subtitle'> Date : "+ results.rows.item(i).date +" &nbsp; Time: "+ results.rows.item(i).time +" </div> <span class='right'> <ons-icon icon='ion-close' size='24px, material:20px'></ons-icon> </span></ons-list-item> </ons-list> ");
            }
          }
  

          else {
            document.getElementById("appointlist").innerHTML = "<p align='center'> No appointment added yet. </p> ";

          }

  }

   function errorCB(err){
      alert("Error" + err.code);  }
};

var addappoint = function(){

  var date = $("#pdate").val();
  var time = $("#ptime").val();
  var title = $("#ptitle").val();
  var username = localStorage.getItem("username");

  function populateDB(tx){
    tx.executeSql('INSERT INTO user_appointment (username, date, time, appoint_title) VALUES(?,?,?,?)', [ username, date, time, title]);
    hideDialog('appointform');
    profileloader();
    displayAppointment();
  }
          
  function errorCB(err){
    alert("error");
  }
    
  function successCB(){
  }    
  
  db.transaction(populateDB,errorCB,successCB);
}

var showEditHosp = function() {
  showDialog('edithospital_form');
};

var showAppoint = function() {
  showDialog('appointform');
};

//edit user hospital details

var edithosp = function() {

  var username = localStorage.getItem('username');
  var hosp_name = $("#hosp_name").val();
  var doc_name = $("#doc_name").val();
        
  db.transaction(function (tx) {
    tx.executeSql('INSERT INTO user_hospital (username, hosp_name, doctor_name) VALUES(?,?,?)', [ username, hosp_name, doc_name]);
    });


  profileloader();

};









