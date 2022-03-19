const crypto = require('crypto');
const fs = require('fs');




function generateKeyPair(){
    const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength:2048,
        publicKeyEncoding:{
            type:'spki',
            format:'der'
        },
        privateKeyEncoding:{
            type:'pkcs8',
            format:'der',
        }
    })
    return {publicKey:publicKey.toString('base64'), privateKey:privateKey.toString('base64')}
}

function sign(data, privateKey){
    privateKey = crypto.createPrivateKey({
        key:Buffer.from(privateKey, 'base64'),
        type:'pkcs8',
        format:'der'
    })
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey).toString('base64');

    return signature
}

function verify(signature, data, publicKey){
    publicKey = crypto.createPublicKey({
        key: Buffer.from(publicKey, 'base64'),
        type:'spki',
        format:'der'
    })
    const v = crypto.createVerify("SHA256");
    v.update(data);
    v.end();

    const result = v.verify(publicKey, Buffer.from(signature, 'base64'));

    return result;
}



const {publicKey, privateKey} = generateKeyPair();
const signature = sign('Hello', privateKey);
console.log(signature);
//const passphrase = 'Kryptos'
//const key = crypto.pbkdf2Sync(passphrase, 'salt', 10000, 128, 'sha256');

/*
crypto.generateKeyPair('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'top secret'
    }
  }, (err, publicKey, privateKey) => {
    // Handle errors and use the generated key pair.
    
}); 
*/

//console.log(signature);

/*
const result = verify(signature, 'Hell2o', publicKey);
console.log(result);

*/