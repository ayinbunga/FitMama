

var weeklist1, weeklist2, weeklist3 = [];

weeklist1 = ["todo1","todo2", "todo3"];
weeklist2 = ["todo4","todo5", "todo6"];
weeklist3 = ["todo7","todo8", "todo9"];

var weeklisthead = [weeklist1,weeklist2,weeklist3];

var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);


	function populateDB(tx){
		tx.executeSql('DROP TABLE IF EXISTS weekly_list');	
		tx.executeSql('CREATE TABLE IF NOT EXISTS weekly_list(id INTEGER NOT NULL PRIMARY KEY, week, activity)');

		for(i=0; i<3; i++) {
			for( x=0; x<3; x++) {
			tx.executeSql('INSERT INTO weekly_list(week, activity) VALUES(?,?)', [i+1, weeklisthead[i][x] ]);
		}
		//tx.executeSql('INSERT INTO weekly_info(info) VALUES(?)', [week_2]);
		}
	}
					
	function errorCB(err){
		
		alert("error");
	}
		
	function successCB(){
						
	}		

	var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
	db.transaction(populateDB,errorCB,successCB);