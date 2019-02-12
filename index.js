var app = require('express')();

var bodyParser = require('body-parser');

var cors = require('cors');

var port = process.env.PORT || 1337;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, function(){
	console.log('at port 3000')
});

var UserDetails = {"users":[]}

var CryptoJS = require("crypto-js");

var fs = require('fs');

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'krisshadhikari@gmail.com',
        pass: '9676509456'
    }
});

app.post('/forgot_password', function(req, res){
	
	console.log(req.body);
	
const mailOptions = {
  from: 'krisshadhikari@gmail.com', // sender address
  to: req.body.email, // list of receivers
  subject: 'Subject of your email', // Subject line
  html: 'Please reset your password at http://hayeslocums.com/forgotpassword'// plain text body
};
	
	transporter.sendMail(mailOptions, function (err, info) {
		if(err){
			console.log(err)
			res.status(400).send(err);
		}
		else{
			console.log(info);
			res.status(200).send({'success':'Mail has been sent'})
		}
	})
})

//geeta@hk.com
//hkhkhk

app.use('/login', function(req, res){
	if(req.method == 'POST'){
		//console.log('loggedIN', req.body);
		fs.readFile('userdetails.json', 'utf8', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
				console.log(req.body.email_address)
				console.log(CryptoJS.AES.decrypt(req.body.password, 'secret key 123').toString(CryptoJS.enc.Utf8))
				for(i=0; i<JSON.parse(data).users.length; i++){
					if(req.body.email_address == JSON.parse(data).users[i].email_address){
						pass = JSON.parse(data).users[i].password;
					console.log(CryptoJS.AES.decrypt(pass, 'secret key 123').toString(CryptoJS.enc.Utf8), 'password')
						if(CryptoJS.AES.decrypt(req.body.password, 'secret key 123').toString(CryptoJS.enc.Utf8) == CryptoJS.AES.decrypt(pass, 'secret key 123').toString(CryptoJS.enc.Utf8)){
						console.log('loggedIn');
							res.status(200).send({'loggedIn': true});
							break;
						}
						else if(i==JSON.parse(data).users.length-1){
							res.status(400).send({'loggedIn': false});
						}
					}
					else if(i==JSON.parse(data).users.length-1){
						res.status(400).send({'loggedIn': false});
					}
				}
			}
		})
	}
	else{
		res.status(200).send('Login')
	}
})

app.use('/registration', function(req, res){
	if(req.method == 'POST'){

		//UserDetails.users.push(req.body.users);
		//console.log(UserDetails);
		
		fs.readFile('userdetails.json', 'utf8', function readFileCallback(err, data){
			if (err){
				console.log(err);
			} else {
				console.log(data)
				console.log(JSON.parse(data).users)
				//console.log(data.users)
				
			obj = JSON.parse(data); //now store it an object
			
			req.body.users.id = obj.users.length;
			console.log(req.body)
			obj.users.push(req.body.users); //add some data
			json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('userdetails.json', json, 'utf8', function(err, data){
				if(err){
					
				}
				else{
					console.log(data, 'data after writing file');
					res.status(200).send(req.body);					
				}
			});
		}});
	}
	else{
		res.status(200).send("No GET API's for Registration");
	}
})