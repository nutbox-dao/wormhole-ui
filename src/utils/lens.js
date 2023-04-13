import { LensClient, development } from "@lens-protocol/client";
import { signMessage } from './web3/web3'

const lensClient = new LensClient({
  environment: development
});

export const auth = async (address) => {
    try {
    // const challenge = await lensClient.authentication.generateChallenge(address);
    // console.log(1, challenge);
    // const signature = await signMessage(challenge, address);
    // console.log(2, signature);
    // const res = await lensClient.authentication.authenticate(address, signature);
    // console.log(3, res);
    const authed = await lensClient.authentication.isAuthenticated();
    console.log(4, authed);
    // const feed = await getFeed(address);
    // console.log(5, feed);
    lensClient.explore.profiles({
        profileId: address
    })
    }catch(e) {
        console.log('error', e)
    }
}

export const getFeed = async (address) => {
    const result = await lensClient.feed.fetch({
        profileId: address
      });
    return result
}

