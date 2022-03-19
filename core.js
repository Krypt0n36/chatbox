

function randomize(len){
	const pattern = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	let rstr = '';
	for(var i=0; i<len; i++){
		rstr += pattern[Math.floor(Math.random() * 62)];
	}
	return rstr;
}

function genToken(){
	pattern = '0123456789abcdef'
	token = '';
	for(var i=0; i<32; i++){
		token += pattern[Math.floor(Math.random() * 16)];
	}
	return token;
}

function sendOTAC(phone_number, otac){
	msgbody = `Your Texto verification code is ${otac}.`
	console.log('=========\n');
	console.log(msgbody)
	console.log('=========\n');

}

function genOTAC(){
	pattern = '0123456789'
	otac = '';
	for(var i=0; i<6; i++){
		otac += pattern[Math.floor(Math.random() * 6)];
	}
	return otac;
}

function checkExistance(db, phone_number, existsCallback, notExistsCallback){
	query = `SELECT phone_number FROM users WHERE phone_number='${phone_number}'`;
	db.query(query, (err, res)=>{
		if(res.rows.length > 0){
			existsCallback();
		}
		else{
			notExistsCallback();
		}
	})
}

module.exports = {genOTAC, sendOTAC, genToken, checkExistance, randomize}