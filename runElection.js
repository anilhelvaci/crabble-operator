import './installSesLockdown.js';
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";
import { pollTx } from "./_agstate/yarn-links/agoric/src/lib/chain.js";
import { execFileSync } from "child_process";

const runElection = async () => {
    const { watch, getState, marshaller, getLatestQuestionHandle } = makeChainWatcher('https://wallet.agoric.app/wallet/network-config');
    const offerSender = makeOfferSender(marshaller);

    watch();
    await getState();

    const { txhash } = offerSender.askPauseOffersQuestion({
        id: `pause-offers-prop-mem-1-${Date.now()}`,
        filters: ['Make buyout offer'],
        prevId: 'gov-mem-1',
        duration: 60n,
    }, 'mem1');

    await pollTx(txhash, {
        execFileSync,
        delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
        rpcAddrs: ['http://localhost:26657']
    });

    const { active, questionHandle } = getLatestQuestionHandle();
    console.log('STATE:', active);
    offerSender.votePositive({
        id: `vote-mem-1-${Date.now()}`,
        prevId: 'mem-1',
        filters: ['Make buyout offer'],
        questionHandle,
    }, 'mem1');

    offerSender.votePositive({
        id: `vote-mem-2-${Date.now()}`,
        prevId: 'mem-2',
        filters: ['Make buyout offer'],
        questionHandle,
    }, 'mem2');

    console.log('STATE:', active);
    offerSender.votePositive({
        id: `vote-mem-3-${Date.now()}`,
        prevId: 'mem-3',
        filters: ['Make buyout offer'],
        questionHandle,
    }, 'mem3');
};

runElection().then(() => {
    console.log('We are done, exiting with code 0.');
    process.exit(0);
})