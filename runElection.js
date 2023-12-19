import './installSesLockdown.js';
import { initWatcher, logger, sleep } from './helpers.js';

const runElection = async () => {
    const filters = ['Make bid offer'];
    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        chainWatcher: { watch, getLatestQuestionHandle, getState },
        offerSender,
    } = await initWatcher(networkConfig);

    watch();
    await getState();

    const questionInfo = await offerSender.askPauseOffersQuestion(
        {
            id: `pause-offers-prop-mem-1-${Date.now()}`,
            filters,
            prevId: 'gov-mem-1',
            duration: 180n,
        },
        'mem1',
    );

    logger('[RUN_ELECTION - Question Asked]', questionInfo);
    await sleep(1000);

    const { active, questionHandle } = getLatestQuestionHandle();
    console.log('STATE:', active);
    await offerSender.votePositive(
        {
            id: `vote-mem-1-${Date.now()}`,
            prevId: 'mem-1',
            filters,
            questionHandle,
        },
        'mem1',
    );
    logger('[RUN_ELECTION]', 'mem1 voted');
    await sleep(1000);

    await offerSender.votePositive(
        {
            id: `vote-mem-2-${Date.now()}`,
            prevId: 'mem-2',
            filters,
            questionHandle,
        },
        'mem2',
    );
    logger('[RUN_ELECTION]', 'mem2 voted');
    await sleep(1000);

    await offerSender.votePositive(
        {
            id: `vote-mem-3-${Date.now()}`,
            prevId: 'mem-3',
            filters,
            questionHandle,
        },
        'mem3',
    );
    logger('[RUN_ELECTION]', 'mem3 voted');
};

runElection()
    .then(() => {
        logger('[RUN_ELECTION - Success]', 'We are done, exiting with code 0.');
        process.exit(0);
    })
    .catch(err => {
        logger('[RUN_ELECTION - Error]', err);
        process.exit(1);
    });
