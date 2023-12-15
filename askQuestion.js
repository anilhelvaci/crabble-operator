import './installSesLockdown.js';
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";

const askQuestion = async () => {
    const { watch, getState, marshaller } = makeChainWatcher('https://xnet.agoric.net/network-config');
    const offerSender = makeOfferSender(marshaller);

    watch();
    await getState();
    offerSender.askPauseOffersQuestion({
        id: `pause-offers-prop-mem-1-${Date.now()}`,
        filters: [],
        prevId: 'gov-mem-1',
        duration: 120n,
    }, 'mem1');
};

askQuestion().then(() => {
    console.log('Done, exiting.');
    process.exit(0);
})

