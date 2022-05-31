import nacl from 'tweetnacl'
import { u8arryToHex, hexTou8array, b64uDec, b64uEnc } from './helper'
import { ParseKeyNonce } from '@/config'

export function createKeypair() {
    const pair = nacl.box.keyPair()
    return { publicKey: u8arryToHex(pair.publicKey), privateKey: u8arryToHex(pair.secretKey) }
}

function box(data, publicKey, secretKey) {
    data = hexTou8array(data)
    publicKey = hexTou8array(publicKey)
    secretKey = hexTou8array(secretKey)
    const res = nacl.box(data, hexTou8array(ParseKeyNonce), publicKey, secretKey)
    return u8arryToHex(res)
}

export function openBox(box, nonce, theirPubKey, mySecretKey) {
    box = hexTou8array(box)
    nonce = hexTou8array(nonce)
    theirPubKey = hexTou8array(theirPubKey)
    mySecretKey = hexTou8array(mySecretKey)
    const res = nacl.box.open(box, nonce, theirPubKey, mySecretKey)
    return u8arryToHex(res)
}

export function test() {
    const data = 'c74f2b721c92a076ccf4593235d9557ab9ece73e3d62ab682131b51a40cdd00d'

    const pair1 = createKeypair()
    const pair2 = createKeypair()

    const res = box(data, pair1.publicKey, pair2.privateKey)
    console.log(1, res);
    const res2 = openBox(res, ParseKeyNonce, pair2.publicKey, pair1.privateKey)
    console.log(2, res2);
}