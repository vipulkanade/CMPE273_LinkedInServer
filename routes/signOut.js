var mysql = require("./mysql");

function signOut(req, res) {
	var authToken = req.headers.authorization;
	
	var deleteAuthToken = "Update test.sign_in_table SET authToken ='"+ null +"'"+" where authToken='"+ authToken+"'";
	
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {
				req.session.destroy();
				res.header('Access-Control-Allow-Origin', 'http://localhost:3232');
				res.header("Access-Control-Allow-Credentials", true);
				
				res.send({
				  "status":true,
				  "error" : "none"
				});
				console.log("Token Deleted Succesfully");	
		}
	}, deleteAuthToken);
}

exports.signOut = signOut;