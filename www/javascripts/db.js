
// initiate fitmama websql database
 
 var db = null;
 var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE IF EXISTS user');
		//tx.executeSql('DROP TABLE IF EXISTS user_profile');
		//tx.executeSql('DROP TABLE IF EXISTS weekly_list');
		//tx.executeSql('DROP TABLE IF EXISTS weekly_info');
		//tx.executeSql('DROP TABLE IF EXISTS user_hospital');
		//tx.executeSql('DROP TABLE IF EXISTS exercise_history');
		//tx.executeSql('DROP TABLE IF EXISTS user_appointment');

		tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, password)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_profile(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username, firstname, lastname, iconimg, lmp_date, duedate, baby_weight, baby_length)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_hospital(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, hosp_name, doctor_name)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_appointment(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username, date, time, appoint_title)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_info(id INTEGER NOT NULL PRIMARY KEY, info)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_list(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, week INTEGER, activity, status, username)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS exercise_history (username, date, time, type, exercise)');
	});


//check how many users registered

$('document').ready(function(){
		
	db.transaction(function(tx){
			tx.executeSql('SELECT * FROM user', [], querySuccess, errorCB);	
	});
	
	function querySuccess(tx, results){
			var len = results.rows.length;
				if(len > 0){
					
					console.log("Currently have "+len+" users registered");
					}
				
				else{
					console.log("No users registered yet");
					localStorage.setItem("username", "");
				}
				
		}
		function errorCB(err){
		 alert("Error" + err.code);
		}
});


//store weekly info

$('document').ready(function(){

  function populateDB(tx){
    tx.executeSql('DROP TABLE IF EXISTS weekly_info');  
    tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_info(id INTEGER NOT NULL PRIMARY KEY, info)');

  for(i=1; i<=42; i++) {
    tx.executeSql('INSERT INTO weekly_info(id, info) VALUES(?,?)', [i, week[i-1]]);
    //tx.executeSql('INSERT INTO weekly_info(info) VALUES(?)', [week_2]);
    }
  }
          
  function errorCB(err){
    alert("error");
  }
    
  function successCB(){
  }    
  
  db.transaction(populateDB,errorCB,successCB);

});

//store weekly to do lists

$('document').ready(function(){

  var username = localStorage.getItem('username');

  if(username != "") {
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM weekly_list WHERE username=?', [username], querySuccess, errorCB);
  });

  function querySuccess(tx, results){
      var len = results.rows.length;  
        if(len == 0){
            
            function populateDB(tx){
            	for(i=0; i<42; i++) {
            		for( x=0; x < weeklisthead[i].length; x++) {
            			tx.executeSql('INSERT INTO weekly_list(week, activity, status, username) VALUES(?,?,?,?)', [i+1, weeklisthead[i][x], "NULL", username ]);
    				}
    
    			}
  			}
          
  			function errorCB(err){
  				alert("error");
  			}
    
  			function successCB(){
            }   

  			db.transaction(populateDB,errorCB,successCB);
        }

        else {
          }
  }
      
  function errorCB(err){
      alert("Error" + err.code);  }
  }
  else{

  }

});

