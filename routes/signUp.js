var ejs = require("ejs");
var mysql = require("./mysql");
var jwt = require('jwt-simple');

function signUpUser(req, res) {
	var userSignUp = "INSERT INTO test.sign_in_table (usrname, First_Name, Last_Name, email, paswd) VALUES " 
					+ "(" + "'" + req.param("firstName") + "'"+","
					+ "'" + req.param("firstName") + "'"+","+ "'" 
					+ req.param("lastName") + "'"+","
					+ "'" + req.param("emailID") + "'"+","
					+ "'" + req.param("password") + "'"+")";
	console.log("Sign Up Query Log : " + userSignUp.toString());
	
	mysql.fetchData(function(err,results){
		if(err) {
			throw err;
		} else {
			
				console.log(results);
				var expires = 700000;
				var token = jwt.encode({
				  iss: req.param("emailID"),
				  exp: expires
				}, "anystringshouldwork");
				
				req.session.usrname = req.param("emailID");
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
			
		}
	}, userSignUp);
}

exports.signUpUser = signUpUser;