import './installSesLockdown.js';
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";

const runElection = async () => {
    const { watch, getState, marshaller, getLatestQuestionHandle } = makeChainWatcher('https://xnet.agoric.net/network-config');
    const offerSender = makeOfferSender(marshaller);

    watch();
    await getState();

    const { active, questionHandle } = getLatestQuestionHandle();
    console.log('STATE:', active);
    offerSender.votePositive({
        id: `vote-mem-1-${Date.now()}`,
        prevId: 'mem-1',
        filters: [],
        questionHandle,
    }, 'mem1');

    offerSender.votePositive({
        id: `vote-mem-2-${Date.now()}`,
        prevId: 'mem-2',
        filters: [],
        questionHandle,
    }, 'mem2');

    console.log('STATE:', active);
    offerSender.votePositive({
        id: `vote-mem-3-${Date.now()}`,
        prevId: 'mem-3',
        filters: [],
        questionHandle,
    }, 'mem3');
};

runElection().then(() => {
    console.log('We are done, exiting with code 0.');
    process.exit(0);
})