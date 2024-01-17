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
let blockTemplate = {
    ExtraNonce1: '929e4bb4',
    ExtraNonce2_size: 4,
    previousblockhash: '83ed60ce078736fe15528d3f5ea5cfdd0ed72b04000a31440000000000000000',
    coinbase: [
    '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff5c0332410a192f5669614254432f4d696e6564206279206c6576616d75732f2cfabe6d6def4d71fab9c4856256f87621806274036feb16b79c411157a920716275e722951000000000000000108ad5ef13de0027ea',
    'ffffffff04ce4c6229000000001976a914536ffa992491508dca0354e52f32a3a7a679a53a88ac00000000000000002b6a2952534b424c4f434b3acac6189d090598816a3e1092b966aad3c6aef15e3c826a334cea7f21002fd6540000000000000000266a24b9e11b6d65ba1a6db71ac060e04c3cb5bf049af5478970ded266f93b2f5b89f86348c9fc0000000000000000266a24aa21a9edf2716abb1dd5ac06ad1fed7f6bde943fc1657a0fd53a1c11823a4ffb5cc823e400000000'
    ],
    merkleTree: [
    '628a4d82f4950e0d55407f231057e8524a27e724143667cfd6c4bb3bc323d75f',
    'e1ec3b078e79bd6da16899697e47a1eff05f27304baf7bf4fb3784145b452343',
    'dfac6e968c29d40b35f34474b081b3fb9a054497c8ce8cebfca36471e9b5f912',
    '35ea339bda0105cd0401e5f4dd89c511a41ea34117d839d6d3e32b575f4e4dc0',
    '97bd6bfb590b9cb2a6f388f3a4039a926ed0487f82f6215860443a4bef28fe10',
    '3126b182f4115fe6705c36a43737cd38eaf3e600add0de49bd6823c7f0fa6a11',
    '793fa91f40722794f2234fd5ab7904a94432f8376b5cef86e7440a457b3482c4',
    'd1370e331d8752b53e6b07d560a3d0b9f03569e2686e786739e3a96cc2ae7eb8',
    'e99e29d9953dea3642621c08e31bd78ab9a3648b630af7dcff2dd90bdbca08b8',
    '5655477db1423bef022382ccfe88d2c597f64bc69df6f4f520adca95a29f94aa',
    '3c719be7fbeed1101542c6420fde3f4e5fd773284effacf8f9f21e4a05e5d416'
    ],
    blockVersion: '20000000',
    nBits: '170cf4e3',
    nTime: '6036f006'
};



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
