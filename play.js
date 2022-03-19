const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const passphrase = 'Passme';
const privateKey = crypto.createHash('SHA256').update(passphrase).digest('hex');
const publicKey = crypto.createHash('SHA256').update(privateKey).digest('hex');

const signature = jwt.sign({foo:'bar'}, privateKey);


console.log(signature);