
// initiate fitmama websql database
 
 var db = null;
 var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE IF EXISTS user');
		//tx.executeSql('DROP TABLE IF EXISTS user_profile');
		//tx.executeSql('DROP TABLE IF EXISTS weekly_info');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, created unique, username UNIQUE, password)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS user_profile(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username, lmp_date, duedate)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_info(id INTEGER NOT NULL PRIMARY KEY, info)');
		


	});


$('document').ready(function(){
	var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
		
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

