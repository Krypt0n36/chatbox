# chatbox
"Dance like nobody is watching, dance like everybody is"

End-to-end, real-time, plug-and-play


Chatbox is a combination of cryptographic methods that enables clients to inter-communicate via a broadcasting server and without revealing any unencrypted/plain text data.

Chatbox heavily relies on cryptography to avoid central trust.

. Hashing algorithms SHA256.
. Asymetric(Public key / Private key) cryptography AES256.
. Digital signature (Json Web Tokens).
. RSA key exchange.

With all these techniques combined, its possible to reach maximum anonymity when exchanging messages with another client even tho the server is the middleman.

Trust cryptography not centralisation.



## END-POINTS DOCUMENTATION

### /register [POST]
####Params :
  - identifier : Identifier, username hash using SHA256.
  - publicKey : RSA public key (including header)
  - savePrivateKey : Binary, (0:No, 1:Yes). Save private key in the keypair clauster.
  - encPrivateKey (Required if savePrivateKey is used): Encrypted private key, encryption algorithm may varry depends on the client (AES256 is suggested).
 
####Response (JSON):
  - status : Status or return code.
  - label : Status detials

####Possible return codes:
  - 1  : Success.
  - -1 : Username/identifier is taken (Already reserved in the database).
  - -2 : Database error encountered during registring username in the database.
  - -3 : Error writing Public key to file in the keypairs clauster.
  - -4 : Error writing Private key to file in the keypairs clauster.
  
Notice : Negative return codes represents errors.
