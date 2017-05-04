
//loader page animation

$(window).load(function() {
    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");;
});

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
  var currentweek = localStorage.getItem('currentweek')

  if (username != ""){
    var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
    profileloader();
    displayBabyDetails(currentweek);

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


  if ((username != NULL) && (password != NULL)) {

    localStorage.setItem("username", username);
        
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user WHERE username=? and password=?', [username,password], querySuccess, errorCB);
      });
      
      function querySuccess(tx, results){

      
  
        var len = results.rows.length;
          if(len > 0){
            checkCurrentWeek();
            profileloader();
            location.reload();

              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }
  }
  else { ons.notification.alert("Invalid input!") }

    //location.reload();
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
              
              }
        else {
          ons.notification.alert("Invalid input!") }
      }
    
      function errorCB(err){
        alert("Error" + err.code);  }

    localStorage.setItem("username", username);
    location.reload();
    

  }
};

//check current week for current user and display user info

var checkCurrentWeek = function () {

  var username = localStorage.getItem('username');

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

              displayBabyDetails(currentweek);


              if ( firstname != NULL || lastname != NULL ) {
                document.getElementById("current_user").innerHTML = firstname + " " + lastname;
              } else {
                document.getElementById("current_user").innerHTML = username;
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
};


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
    tx.executeSql('SELECT * FROM weekly_list WHERE week = ? AND username= ?', [currentweek, username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            document.getElementById("tdweeks").innerHTML = currentweek;
            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--tappable'> <div class='list__item__left list__item--material__left'> <label class='checkbox'> <input type='checkbox' id='"+results.rows.item(i).id+"' class='checkbox__input' name='c' onclick='check(this.id, itemfor"+ results.rows.item(i).id +".id)' "+ results.rows.item(i).status +"> <div class='checkbox__checkmark'></div> </label></div> <label for='"+results.rows.item(i).id+"' id='itemfor"+results.rows.item(i).id+"' class='list__item__center'>" + results.rows.item(i).activity + "</label> </li>");
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

var crossofflist = function(id){
};

var check = function(id, item_id) {

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

                //$("#"+item_id+"").css({'text-decoration': 'line-through'});
      
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

                //$("#"+item_id+"").css({'text-decoration': ''});
      
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

  /*if($("#"+id+"").is(':checked')){
  $("#"+item_id+"").css({
        'text-decoration': 'line-through'
  });
  }  
   else{
     $("#"+item_id+"").css({
        'text-decoration': ''
  });
   }*/
};


//edit user profile

var editprofile = function() {

  var username = localStorage.getItem('username');
  var firstname = $("#firstname").val();
  var lastname = $("#lastname").val();
  var newdate = $("#newduedate").val();
  
  ons.notification.confirm(
    {
    message: 'Are you sure?',
    
    callback: function() {
      
      db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user WHERE username=?', [username], querySuccess, errorCB);
      });

      function querySuccess(tx, results){
        var len = results.rows.length;  
          
          if(len > 0){
            for(i = 0;i < len; i++) {
              var password = results.rows.item(i).password; }
          }
          else {
          }


              //if(pwd == password){
                db.transaction(function (tx) {
                  tx.executeSql('UPDATE user_profile SET firstname=?, lastname=?, duedate=? WHERE username = ?', [firstname, lastname, newdate, username]);
                });
              
                profileloader();
              //}
              //else{
                //ons.notification.alert({
                  //    message: 'Wrong password'
                //});
      //}
      }
      
    function errorCB(err){
          alert("Error" + err.code);  }
    }
  });
};

var loadpic = function(){

  var username = localStorage.getItem('username');

  function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;

           //console.log(reader.result);
           
       }

       reader.onload = function (e) {
            $('#profilepic').attr('src', e.target.result);

            var newurl = $("#profilepic").attr('src');

            db.transaction(function (tx) {
              tx.executeSql('UPDATE user_profile SET iconimg=? WHERE username = ?', [newurl, username]);
          });

            
            
        }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL           
       } else {
           preview.src = "";
       }
  }

  previewFile();  //calls the function named previewFile()  
};

var editprofileview = function() {

  var username = localStorage.getItem('username');
  var duedate = localStorage.getItem('duedate');

  db.transaction(function(tx){
        tx.executeSql('SELECT * FROM user_profile WHERE username=?', [username], querySuccess, errorCB);
  });
      
  function querySuccess(tx, results){
    var len = results.rows.length;

    if(len > 0){
      for(i=0; i<len ; i++) {
      var firstname = results.rows.item(i).firstname;
      var lastname = results.rows.item(i).lastname;

      document.getElementById("pro_username").setAttribute('value', username);
      document.getElementById("newduedate").setAttribute('value', duedate);

      if(firstname != ""){
          $("#firstname").attr("value", results.rows.item(i).firstname);
          $("#firstname").attr("placeholder", ""); 
      }
        
      if(lastname != ""){
          $("#lastname").attr("value", results.rows.item(i).lastname);
          $("#lastname").attr("placeholder", "");
      }

      showDialog('editprofile_form');
      }
    }
    else {
    }
  }

  function errorCB(err){
    alert("Error" + err.code);  } 
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
};

//edit profile img

/*var editimg = function() {

  var username = localStorage.getItem('username');
  var url =  $('#profilepic').attr('src');


  db.transaction(function (tx) {
      tx.executeSql('UPDATE user_profile SET iconimg=?, WHERE username = ?', [url, username]);
    });

  hideDialog('editprofile_form');
  profileloader();
};*/

//display to-do-lists

var displayToDo = function(x) {

  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list WHERE week = ? AND username=?', [x, username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){
            $("#tdweeks").empty();
            document.getElementById("tdweeks").innerHTML = x;
            $("#todolist").empty();

            for(i = 0;i < len; i++) {
              $("#todolist").append("<li class='list__item list__item--tappable'> <div class='list__item__left list__item--material__left'> <label class='checkbox'> <input type='checkbox' id='"+results.rows.item(i).id+"' class='checkbox__input' name='c' onclick='check(this.id, itemfor"+ results.rows.item(i).id +".id)' "+ results.rows.item(i).status +"> <div class='checkbox__checkmark'></div> </label></div> <label for='"+results.rows.item(i).id+"' id='itemfor"+results.rows.item(i).id+"' class='list__item__center'>" + results.rows.item(i).activity + "</label> </li>");
            }
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }
};

//play video playlists

var playVideo = function(type) {

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list', [], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
          if(len > 0){

              var basic = ["Marching","Plie","Inner-Outer Thigh","Plank"];
              var stretching = ["Shoulder Circles","Trunk Twist", "Roll Down", "Lunges"];
              var yoga = ["Cobbler's Pose","Pelvic Tilt","Squat", "Side Lying"];
              var pilates = ["Spinal Twist", "Side Tap", "Cat Stretch", "Deep Breathing"];
              

            /*document.getElementById('timer').innerHTML =
                      02 + ":" + 30;
                      startTimer();

            function startTimer() {
                      var presentTime = document.getElementById('timer').innerHTML;
                      var timeArray = presentTime.split(/[:]+/);
                      var m = timeArray[0];
                      var s = checkSecond((timeArray[1] - 1));
                      if(s==59){m=m-1}
                      
                      if(m<0){
                        //alert('timer completed');
                      }
                      else {
                      
                      document.getElementById('timer').innerHTML = m + ":" + s;
                      }
                      setTimeout(startTimer, 1000);
            }

            function checkSecond(sec) {
                      if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
                      if (sec < 0) {sec = "59"};
                      return sec;
            }*/


            /*var counter = function(x){
                  var timeleft = x;
                  var downloadTimer = setInterval(function(){
                  
                  document.getElementById("progressBar").value = x - --timeleft;
                            if(timeleft <= 0)
                              clearInterval(downloadTimer);
                            
                  },1000);
            }*/

            //counter(21);

            //var a=1;
            //document.getElementById('video_no_id').setAttribute('value',a);

            $("#myVideo").bind("ended",function(){

              document.getElementById('video_type').setAttribute('value',type);

              
              var x = $("#video_no_id").val();

              console.log(x);


              function run() {

                //counter(21);

                  $("#myVideo source").attr("src","videos/"+type+"/video"+x+".mp4");
                  $("#myVideo")[0].load();
                  $("#myVideo")[0].play();

                  if(x!=4) {

                  if (type == "basic") {
                   document.getElementById('exer_name').innerHTML = basic[x];
                   document.getElementById('exer_name2').innerHTML = basic[x-1];
                  }

                 if (type == "stretching") {
                   document.getElementById('exer_name').innerHTML = stretching[x];
                   document.getElementById('exer_name2').innerHTML = stretching[x-1];
                 }

                 if (type == "yoga") {
                   document.getElementById('exer_name').innerHTML = yoga[x];
                   document.getElementById('exer_name2').innerHTML = yoga[x-1];

                 }

                 if (type == "pilates") {
                   document.getElementById('exer_name').innerHTML = pilates[x];
                   document.getElementById('exer_name2').innerHTML = pilates[x-1];
                 }

                 }
                 else {

                  if (type == "basic") {
                   document.getElementById('exer_name').innerHTML = "";
                  document.getElementById('exer_name2').innerHTML = basic[x-1];
                  }

                 if (type == "stretching") {
                   document.getElementById('exer_name').innerHTML = "";
                  document.getElementById('exer_name2').innerHTML = stretching[x-1];
                 }

                 if (type == "yoga") {
                   document.getElementById('exer_name').innerHTML = "";
                  document.getElementById('exer_name2').innerHTML = yoga[x-1];
                 }

                 if (type == "pilates") {
                   document.getElementById('exer_name').innerHTML = "";
                   document.getElementById('exer_name2').innerHTML = pilates[x-1];
                 }
                  
                 }
                
                x++;
                document.getElementById('video_no_id').setAttribute('value', x);
                

                  //var i = document.getElementById("myVideo").duration;
                  //console.log(i);

              }

              if(x!=5) {
                run();
              }
              else {
                document.getElementById("videoPlayer").innerHTML = ("<h3 style='margin-top: 200px;'> EXERCISE COMPLETED </h3>");
                document.getElementById('current-next').setAttribute('hidden','true');
                $("#play-pause").attr('icon','fa-play');
                var music = document.getElementById("music");
                music.pause();
              }

          });
            
          }

          else {

          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }
};


var stopcounter = function(x){
  var timeleft = x;
  var downloadTimer = setInterval(function(){
  
  document.getElementById("progressBar").value = x;
            if(timeleft <= 0)
              clearInterval(downloadTimer);
            
  }, 0);
}

var pause = function(){
  var video = document.getElementById("myVideo");
  var music = document.getElementById("music");
  //var value = $("#progressBar").val();
        
                if (video.paused == true) {
                // Play the video
                //counter(11-value);
                //console.log(value);
                video.play();

                if ($("#stopmusicicon").attr('icon') == "volume-up"){
                  music.play();
                }
                $("#play-pause").attr('icon','pause-circle-o');
                
                }
                else
                {
                  video.pause();
                  music.pause();
                  $("#play-pause").attr('icon','fa-play');
                  //stopcounter(value);
                }
}

var mute = function(){
  var video = document.getElementById("myVideo");
  
        
                if (video.muted == true) {
                
                video.muted = false;

                $("#narration").attr('icon','microphone');
                
                }
                else
                {
                  video.muted = true;
                  $("#narration").attr('icon','microphone-slash');
                }
};

var stopvid = function(value){
  var video = document.getElementById("myVideo");
        
   video.currentTime += value;
   
   $("#play-pause").attr('icon','pause-circle-o');
};

var revid = function(value){
  var video = document.getElementById("myVideo");
  video.currentTime += value;
  var x = $("#video_no_id").val();

  if (x != 2) {
  $("#video_no_id").attr('value',(x-2));  
  }
  else if ( x == 2 ) {
    $("#video_no_id").attr('value', (x-1));
  }

};



var stopmusic = function(){
  var music = document.getElementById("music");
  //var value = $("#progressBar").val();
        
                if (music.paused == true) {
                // Play the video
                //counter(11-value);
                //console.log(value);
                music.play();
                $("#stopmusicicon").attr('icon','volume-up');
                
                }
                else
                {
                  music.pause();
                  $("#stopmusicicon").attr('icon','volume-off');
                  //stopcounter(value);
                }
};

//load basic exercise page

var basicloader = function(){
  var type = "basic";
  fn.load('exercise.html');
  playVideo(type);
};

var stretchingloader = function(){
  var type = "stretching";
  fn.load('exercise.html');
  playVideo(type);
};

var pilatesloader = function(){
  var type = "pilates";
  fn.load('exercise.html');
  playVideo(type);
};

var yogaloader = function(){
  var type = "yoga";
  fn.load('exercise.html');
  playVideo(type);
};

// display baby details on user profile

var babyDetailscaller = function(){
  var currentweek = localStorage.getItem('currentweek');
  displayBabyDetails(currentweek);
};

var displayBabyDetails = function(currentweek){


  var username = localStorage.getItem('username');
  var duedate = localStorage.getItem('duedate');
  //var currentweek = localStorage.getItem('currentweek');
  date = new Date(duedate);

  var getMonthName = function(date) { var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ]; return monthNames[date.getMonth()]; };

  var birthdate = date.getDate() + " " + getMonthName(date) + ", " + date.getFullYear();
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_info WHERE id = ?', [currentweek], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
    
    $("#bbybtn").attr("checked","checked");

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

//display hospital details on user profile 

var displayHospDetails = function(){

  var username = localStorage.getItem('username');
        
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM user_hospital WHERE username = ?', [username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){

      $("#appointlist").empty();
      $("#profilelist").empty();

      var len = results.rows.length;  
          if(len > 0){
            for(i = 0; i < len; i++){
              $("#hosp_name").attr("value", results.rows.item(i).hosp_name);
              $("#hosp_name").attr("placeholder", "");
              $("#doc_name").attr("value", results.rows.item(i).doctor_name);
              $("#doc_name").attr("placeholder", "");
              document.getElementById("profilelist").innerHTML = "<ons-list> <ons-list-item> <p> Hospital Name: </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).hosp_name +" </p> </span> </ons-list-item> <ons-list-item> <p> Doctor's Name: </p> <span class='right'> <p class='largefont2'> "+ results.rows.item(i).doctor_name +"</p> </span> </ons-list-item> </ons-list> ";
              $("#profilelist").append("<ons-fab position='bottom right' ripple> <ons-icon icon='md-edit' onclick='showEditHosp()'></ons-icon></ons-fab>");

            }
          }
  

          else {
            document.getElementById("profilelist").innerHTML = " <div align='center'> &nbsp; &nbsp; <ons-button style='margin: 50px;' onclick='showEditHosp()'> EDIT HOSPITAL DETAILS </ons-button> </div>";

          }
  }

   function errorCB(err){
      alert("Error" + err.code);  }
};

//display appoinment details on user profile

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

//add new appointment

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
};

//load edit hospital form

var showEditHosp = function() {
  showDialog('edithospital_form');
};

//load add new appointment form

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

