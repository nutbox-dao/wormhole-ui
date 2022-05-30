import nacl from 'tweetnacl'
import { u8arryToHex, hexTou8array } from './helper'

export function createKeypair() {
    const pair = nacl.box.keyPair()
    return { publicKey: u8arryToHex(pair.publicKey), privateKey: u8arryToHex(pair.secretKey) }
}

export function openBox(box, nonce, theirPubKey, mySecretKey) {
    return nacl.box.open(box, nonce, theirPubKey, mySecretKey)
}