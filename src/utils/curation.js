import { ethers } from  'ethers'
import { u8arryToHex } from './helper'

export const randomCurationId = () => {
    let id = ethers.utils.randomBytes(6)
    id = u8arryToHex(id);
    return id;
}