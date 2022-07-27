import {ethers} from "ethers";
import {notify} from "@/utils/notify";

export function onCopy(msg) {
  navigator.clipboard.writeText(msg).then(() => {
    notify({
      message: 'Copied!',
      duration: 5000,
      type: 'success'
    })
  }, (e) => {
    console.log(e)
  })
}
export function copyAddress(address) {
  if (ethers.utils.isAddress(address)) {
    navigator.clipboard.writeText(address).then(() => {
      notify({
        message: 'Copied address:'+address,
        duration: 5000,
        type: 'success'
      })
    }, (e) => {
      console.log(e)
    })
  }
}
