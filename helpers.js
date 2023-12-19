import { makeChainWatcher } from './chainWatcher.js';
import { makeOfferSender } from './offers.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
harden(sleep);

const toObjectRecord = (rawObject, keywords) => {
    const records = {};
    [...keywords].forEach(keyword => {
        records[keyword] = Object.fromEntries(rawObject[keyword]);
    });

    return harden({
        ...rawObject,
        ...records,
    });
};
harden(toObjectRecord);

const initWatcher = async networkConfig => {
    const result = await fetch(networkConfig);
    const {
        chainName,
        rpcAddrs: [rpc],
    } = await result.json();
    console.log('result', { chainName, rpc });

    const chainWatcher = makeChainWatcher(networkConfig);
    const offerSender = makeOfferSender(chainWatcher.marshaller, rpc, chainName);

    return harden({
        offerSender,
        chainWatcher,
    });
};
harden(initWatcher);

const logger = (tag, message) => {
    console.log('[OFFER_SENDER]', tag, message);
};
harden(logger);

export { sleep, toObjectRecord, initWatcher, logger };
