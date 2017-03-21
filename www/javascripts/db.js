
// initiate fitmama websql database
 
 var db = null;
 var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE IF EXISTS user');
		//tx.executeSql('DROP TABLE IF EXISTS user_profile');
		//tx.executeSql('DROP TABLE IF EXISTS user_activity');
		//tx.executeSql('DROP TABLE IF EXISTS weekly_info');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, password)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_profile(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username, firstname, lastname, iconimg, lmp_date, duedate)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_info(id INTEGER NOT NULL PRIMARY KEY, info)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_list(week INTEGER, activity)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_activity (username, week INTEGER, activity)');
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

  function populateDB(tx){
    tx.executeSql('DROP TABLE IF EXISTS weekly_list');  
    tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_list(week INTEGER, activity)');

    for(i=0; i<42; i++) {
      for( x=0; x < 3; x++) {
      	tx.executeSql('INSERT INTO weekly_list(week, activity) VALUES(?,?)', [i+1, weeklisthead[i][x] ]);
    	}
    
    }
  }
          
  function errorCB(err){
    
    alert("error");
  }
    
  function successCB(){
            
  }   

  db.transaction(populateDB,errorCB,successCB);

});

