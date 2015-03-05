var user;
var mysql = require("./mysql");

function userInfo (req, res) {
	
	console.log("Headers: : " + JSON.stringify(req.headers));
	console.log("Session: : " + JSON.stringify(req.session));
	console.log("Token: : " + req.session.token);
	if (req.session.token === req.headers.authorization) {
		var getUser = "SELECT * FROM test.sign_in_table where email='"+req.session.email+"'";
		console.log("Query Log : " + getUser.toString());
		
		mysql.fetchData(function(err,results){
			if(err) {
				throw err;
			} else {
				if (results.length > 0){
					console.log(results);
					user = results[0];
					req.session.user = user;
					
					//To Over Come CORS
					res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
					res.header("Access-Control-Allow-Credentials", true);
					
					res.json({
					  "user": user,
					  "status":true,
					  "error" : "none"
					});
					console.log("User Found Succesfully");	
				} else {
					console.log("User Not Login");
					req.session.destroy();;
					
					//To Over Come CORS
					res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
					res.header("Access-Control-Allow-Credentials", true);
					
					res.json({
						"status":false,
						"error" : "User Not Valid"
					});
				}
			}
		}, getUser);
	} else {
		console.log("Session Not Present");	
		
		res.json({
		  "status":false,
		  "error" : "none"
		});
	}
}

exports.userInfo = userInfo;
