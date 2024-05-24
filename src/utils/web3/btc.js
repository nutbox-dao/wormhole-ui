

export async function connectUnisat() {
    if (typeof window.unisat === 'undefined'){
        console.log('UniSat Wallet is not installed!');
        window.open('https://chromewebstore.google.com/detail/unisat-wallet/ppbibelpcjmhbdihakflkdcoccbgbkpo?hl=zh-CN&utm_source=ext_sidebar', '__blank')
    }

    try {
        const unisat = window.unisat;
         // switch network
         await unisat.switchNetwork('livenet')
        const accounts = await unisat.requestAccounts()
        const btcPubkey = await unisat.getPublicKey()
        return {
            btcAddrees: accounts[0],
            btcPubkey
        }

    } catch (e) {
        console.log(45545, e)
        throw 'get address from wallet fail:'
    }
}

export async function signMessage(message) {
    const wallet = window.unisat;
    return await wallet.signMessage(message)
}