const crypto = require('crypto');

sha256 = function(buffer){
    var hash1 = crypto.createHash('sha256');
    hash1.update(buffer);
    return hash1.digest();
};

sha256d = function(buffer){
    return sha256(sha256(buffer));
};

reverseBuffer = function(buff){
    var reversed = new Buffer.alloc(buff.length);
    for (var i = buff.length - 1; i >= 0; i--)
        reversed[buff.length - i - 1] = buff[i];
    return reversed;
};

reverseHex = function(hex){
    return reverseBuffer(Buffer.from(hex, 'hex')).toString('hex');
};

serializeCoinbase = function(coinbase1, coinbase2, extraNonce1, extraNonce2){
    var coinbase =  coinbase1+
                    extraNonce1+
                    extraNonce2+
                    coinbase2;
    return Buffer.from(coinbase, 'hex');
};

MerkleRootWithCoinbase = function(merkleTree,coinbaseHash){
    var hash = coinbaseHash;
    merkleTree.forEach(a => {
        hash = sha256d(Buffer.from(hash + a,'hex')).toString('hex')
    });
    return hash
}

convertPreviousblockhash = function(previousblockhash){
    return previousblockhash.match(/.{1,8}/g).reverse().join('')
}

blockHeader = function(blockVersion, previousblockhash, merkleRoot, nTime, nBits, nonce){
    previousblockhash = convertPreviousblockhash(previousblockhash)
    var hash =  reverseHex(blockVersion)+
                reverseHex(previousblockhash)+
                merkleRoot+
                reverseHex(nTime)+
                reverseHex(nBits)+
                reverseHex(nonce);
    return Buffer.from(hash, 'hex');
};

// blockTemplate is received from pool (mining.notify)
let blockTemplate;



// extraNonce2,nTime and nonce is received from miner (mining.submit)
let extraNonce2 = "301a0000"
let nTime = "6036f00a"
let nonce = "e4abf319"

let coinbaseBuffer = serializeCoinbase(blockTemplate.coinbase[0], blockTemplate.coinbase[1], blockTemplate.ExtraNonce1, extraNonce2);
let coinbaseHash = sha256d(coinbaseBuffer);
console.log(coinbaseHash.toString('hex'))
// result: a97941791004f1ad8fe01d9e1a0116b932e65c37b7de2bd29ebd238c0705aa72

let merkleRoot = MerkleRootWithCoinbase(blockTemplate.merkleTree,coinbaseHash.toString('hex'));
console.log(merkleRoot.toString('hex'))
// result: 7c1a57f3f75d94e3f1014afca791101e80eebed18b3bca014f798e7399f3ceef

let headerBuffer = blockHeader(blockTemplate.blockVersion, blockTemplate.previousblockhash, merkleRoot, nTime, blockTemplate.nBits, nonce);

console.log(headerBuffer.toString('hex'))
// result: 00000020ce60ed83fe3687073f8d5215ddcfa55e042bd70e44310a0000000000000000007c1a57f3f75d94e3f1014afca791101e80eebed18b3bca014f798e7399f3ceef0af03660e3f40c1719f3abe4

let headerHash = sha256d(headerBuffer);
console.log(headerHash.toString('hex'))
// result: 5edd9d1f993bb74a4f1b5fcd3ab48140df048af0c3bfa43c16c1000000000000

let headerHashReversed = reverseBuffer(headerHash);
console.log(headerHashReversed)
// result: 000000000000c1163ca4bfc3f08a04df4081b43acd5f1b4f4ab73b991f9ddd5e
