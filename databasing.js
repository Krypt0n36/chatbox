const {Client} = require('pg');



function initConnection(){
	const client = new Client({
	user:'ffpklxoliimcff',
	host:'ec2-54-220-243-77.eu-west-1.compute.amazonaws.com',
	database:'d6iegmb7jt7htp',
	password:'3c9eb63c4113d4aa45085c648b8690860e10f35ac673b86c95e18e8efb5ffcea',
	ssl:{rejectUnauthorized:false},
	port:5432
	})
	client.connect();
	console.log('Connection successfully..');
	return client;
}


module.exports = {initConnection}
//const client = new Client({connectionString});