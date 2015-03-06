var ejs= require('ejs');
var mysql = require('mysql');
var pool = [];

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : '',
	    database : 'test'
	});
	return connection;
}

/*function CreateConnectionsInPool(numberOfConnections){
	this.pool = [];
	for(var i=0;i<numberOfConnections;i++){
		this.pool.push(getConnection());
	}
}

var PoolOfConnection = new CreateConnectionsInPool(500);

CreateConnectionsInPool.prototype.getConnectionFromPool = function(){
	var connection = this.pool[this.currentConnection];
	this.currentConnection++;
	return connection;	
};*/

function createConnectionsInPool(numberOfConnections){
	//this.pool = [];
	for(var i=0;i<numberOfConnections;i++){
		pool.push(getConnection());
	}
	//this.currentConnection = 0;
}

var PoolOfConnection = new createConnectionsInPool(500);


createConnectionsInPool.prototype.getConnectionFromPool = function(){
	if(pool.length === 0){
		console.log("Full");
	}	
	//var connection = this.pool[this.currentConnection];
	//this.currentConnection++;
	console.log("Before Get Conn :: "+pool.length);
	var connection = pool.pop();
	console.log("After Get Conn :: "+pool.length);
	return connection;	
};

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery.toString);
	
	var connection = PoolOfConnection.getConnectionFromPool();
	//var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	console.log("Before push :: "+pool.length);
	pool.push(connection);
	console.log("After push :: "+pool.length);
}	

/*function insertAuthToken(callback, sqlQuery) {
	console.log("\nSQL Query::"+sqlQuery.toString);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			console.log("Fields : "+fields);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
}*/

exports.fetchData = fetchData;
//exports.insertAuthToken = insertAuthToken;