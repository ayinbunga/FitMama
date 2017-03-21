
var week = [41];

week[0]= "week1";
week[1]= "week2";
week[2]= "week3";
week[3]= "week4";
week[4]= "week5";
week[5]= "week6";
week[6]= "week7";
week[7]= "week8";
week[8]= "week9";
week[9]= "week10";
week[10]= "week11";
week[11]= "week12";
week[12]= "week13";
week[13]= "week14";
week[14]= "week15";
week[15]= "week16";
week[16]= "week17";
week[17]= "week18";
week[18]= "week19";
week[19]= "week20";
week[20]= "week21";
week[21]= "week22";
week[22]= "week23";
week[23]= "week24";
week[24]= "week25";
week[25]= "week26";
week[26]= "week27";
week[27]= "week28";
week[28]= "week29";
week[29]= "week30";
week[30]= "week31";
week[31]= "week32";
week[32]= "week33";
week[33]= "week34";
week[34]= "week35";
week[35]= "week36";
week[36]= "week37";
week[37]= "week38";
week[38]= "week39";
week[39]= "week40";
week[40]= "week41";
week[41]= "week42";


var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);


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

	var db = openDatabase('fitmama', '1', 'fitmama', 2 * 1024 * 1024);
	db.transaction(populateDB,errorCB,successCB);


		

