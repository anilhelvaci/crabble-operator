import './installSesLockdown.js';
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";
import { execFileSync} from "child_process";
import { pollTx } from "./_agstate/yarn-links/agoric/src/lib/chain.js";

const askQuestion = async () => {
    const { watch, getState, marshaller } = makeChainWatcher('https://wallet.agoric.app/wallet/network-config');
    const offerSender = makeOfferSender(marshaller);

    watch();
    await getState();
    const { txhash } = offerSender.askPauseOffersQuestion({
        id: `pause-offers-prop-mem-1-${Date.now()}`,
        filters: ['make rental'],
        prevId: 'gov-mem-1',
        duration: 120n,
    }, 'mem1');

    const result = await pollTx(txhash, {
        execFileSync,
        delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
        rpcAddrs: ['http://localhost:26657']
    });

    console.log({
        result
    });
};

askQuestion().then(() => {
    console.log('Done, exiting.');
    process.exit(0);
})

