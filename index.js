const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { initConnection } = require('./databasing.js');
const { genOTAC, sendOTAC, checkExistance, randomize } = require('./core.js');
const crypto = require('crypto');
const cors = require('cors');
const fs = require('fs');
const {print_success, print_alert, print_wait} = require('./logging.js');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.static('static'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded());

const db = initConnection();

function sendResp(res, retCode, payload = {}) {
	res.send(Object.assign({}, { status: retCode }, payload));
}


app.get('/', (req, res) => {
	res.send('HELLO WORLD');
})

// Authentication end-points

app.get('/auth', (req, res) => {
	const public_key = req.query.public_key;
	const signature = req.query.signature;
	
})

app.post('/signIn', (req, res)=>{
	const identifier = req.query.identifier; // hashed username
	const public_key = req.query.public_key;
	// check if identifier already used
	db.query(`SELECT identifier FROM users WHERE identifier='${identifier}'`, (err0, ret0)=>{
		if(err0){
			sendResp(res, -1);
		}else{
			if(ret0.rows.length > 0){
				sendResp(res, -2, {label:'Username is already taken.'}); // username is taken
			}else{

				// Username is not taken
				db.query(`INSERT INTO users (identifier, public_key) VALUES ('${identifier}','${public_key}')`,(err1, ret1)=>{
					if(err1){
						sendResp(res, -3);
					}else{
						sendResp(res, 1);
					}
				})
			}

		}
	})
})
app.post('/register', (req, res)=>{
	const identifier = req.body.identifier;
	const publicKey = req.body.publicKey;
	const encPrivateKey = req.body.encPrivateKey;
	console.log(identifier)
	console.log('-'*64)
	console.log(publicKey)
	console.log('-'*64)
	console.log(encPrivateKey)
	res.send('ok')
})

app.post('/storeKeyPair', (req, res)=>{
	const identifier = req.body.identifier;
	const publicKey = req.body.publicKey;
	const encPrivateKey = req.body.encPrivateKey;
	
	print_wait(`Storing keys pairs for ${identifier}..`);

	// check if identifier already exists
	db.query(`SELECT identifier FROM users WHERE identifier='${identifier}'`, (err0, ret0) => {
		if(ret0.rows.length > 0){
			print_alert('Username (Identifier) already exists.')

			res.send({status:-1, label:'Username (Identifier) already exists.'})
		}else{
			db.query(`INSERT INTO users (identifier) VALUES ('${identifier}')`, (err1, ret1)=>{
				if(err1){
					print_alert('Database error.')
					res.send({status:-2, label:'Database error.'});
				}else{
					fs.writeFile(`keys/${identifier}.publicKey`, publicKey, err=>{
						if(err){
							print_alert('Error saving public key.')

							res.send({status:-3, label:'Error saving public key.'});
						}else{
							fs.writeFile(`keys/${identifier}.privateKey`, encPrivateKey, err=>{
								if(err){
									print_alert('Error saving private key.')	
									res.send({status:-4, label:'Error saving private key.'});
								}else{
									print_success(` Finished Storing keys pairs for ${identifier}..`);
									res.send({status:1})

								}
							})
						}
					})
					
				}
			})
		}
	});

})


app.get('/pullKeyPair', (req, res)=>{
	const identifier = req.query.identifier;
	db.query(`SELECT identifier FROM users WHERE identifier='${identifier}'`, (err0, ret0) => {
		if(ret0.rows.length == 0){
			res.send({status:0, label:'Username does not exist.'})
		}else{
			// read key pairs
			fs.readFile(`keys/${identifier}.publicKey`, 'utf8', (err,publicKey)=>{
				if(err){
					res.send({status:-1, label:'Error while reading public key.'});
				}else{
					fs.readFile(`keys/${identifier}.privateKey`, 'utf8',(err1,privateKey)=>{
						if(err1){
							res.send({status:-2, label:'Error while reading private key.'});
						}
						else{
							res.send({status:1, publicKey:publicKey, privateKey:privateKey});
						}
					})

				}

			})
		}
	})

})

// Generate and return a suggested message
app.get('/auth/getSugmsg', (req, res) => {
	const uIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const gid = crypto.createHash('md5').update(uIp).digest('hex');
	const sugmsg = randomize(16);

	//check if already exists in database
	db.query(`SELECT identifier FROM visitors WHERE identifier='${gid}'`, (err0, ret0) => {
		if (err0) {
			sendResp(res, -1);
			console.log(err0)
		}
		else {
			if (ret0.rows.length == 0) {
				// Does not exist
				// save in database
				db.query(`INSERT INTO visitors (identifier) VALUES ('${gid}')`, (err1, ret1) => {
					if (err1) {
						sendResp(res, -2);
						console.log(err1);
					} else {
						// save sugmsg in the database
						db.query(`UPDATE visitors SET sugmsg='${sugmsg}' WHERE identifier='${gid}'`, (err2, ret2) => {
							if (err2) {
								console.log(err2);
								sendResp(res, -1);
							} else {
								sendResp(res, 1, { sugmsg: sugmsg });
							}
						});
					}
				});
			} else {
				// save sugmsg in the database
				db.query(`UPDATE visitors SET sugmsg='${sugmsg}' WHERE identifier='${gid}'`, (err1, ret1) => {
					if (err1) {
						console.log(err1);
						sendResp(res, -1);
					} else {
						sendResp(res, 1, { sugmsg: sugmsg });
					}
				});

			}
		}
	})

})





app.listen(port, () => {
	console.log('Server started at port 8080..');
})