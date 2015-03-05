
var usrname, paswd;

var ejs = require("ejs");
var mysql = require("./mysql");
var jwt = require('jwt-simple');


function afterLogin (req, res) {
	if (!req.session) {
		console.log("Already login");
		// To over come CORS Error
		res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
		res.header("Access-Control-Allow-Credentials", true);
		
		res.send({
		  "status":true,
		  "error" : "none"
		});
	} else {
		var getUser = "SELECT * FROM test.sign_in_table where email='"+req.param("email")+"'";
		console.log("Query Log : " + getUser.toString());
		
		mysql.fetchData(function(err,results){
			if(err) {
				throw err;
			} else {
				if (results.length > 0){
					console.log(results);
					var expires = 700000;
					var token = jwt.encode({
					  iss: req.param("username"),
					  exp: expires
					}, "anystringshouldwork");
					//var insertAuthToken = "Update test.sign_in_table SET authToken ='"+ token +"'"+" where userID='"+ results[0].userID+"'";
					//console.log("Update Query Log : " + insertAuthToken.toString());
					var user = results[0];
					console.log("\n Results[0]: " + user + "\n\n");
					//Resolving CORS Error
					/*mysql.insertAuthToken(function(err, results) {
						if (err) {
							throw err;
						} else {*/
								console.log("Auth Token Set");
								console.log("name : "+user.usrname +" Toekn: " + token);
								// set session parameters
								req.session.email = user.email;
								req.session.token = token;

								// To over come CORS Error
								res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
								res.header("Access-Control-Allow-Credentials", true);
								
								res.send({
								  token : token,
								  "status":true,
								  "error" : "none"
								});
								console.log("valid login");	
						//}
					//}, insertAuthToken);
				} else {
					console.log("Invalid Login");
					// To over come CORS Error
					res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
					res.header("Access-Control-Allow-Credentials", true);
					
					res.json({
						"status":false,
						"error" : "User Not Valid"
					});
				}
			}
		}, getUser);
	}
}

exports.afterLogin = afterLogin;