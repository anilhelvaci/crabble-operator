import './installSesLockdown.js';
import { initWatcher, toObjectRecord, logger } from './helpers.js';

const exerciseGovInvitations = async () => {
    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        chainWatcher: { watch, getState },
        offerSender,
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { instances } = toObjectRecord(stateRaw, ['instances']);

    console.log('Exercise governor invitations...');
    await offerSender.sendExerciseInvOffer(
        {
            id: 'gov-mem-1',
            instance: instances['CrabbleGovernor'],
            description: 'Crabble Governance Invitation Handler',
        },
        'mem1',
    );

    await offerSender.sendExerciseInvOffer(
        {
            id: 'gov-mem-2',
            instance: instances['CrabbleGovernor'],
            description: 'Crabble Governance Invitation Handler',
        },
        'mem2',
    );

    await offerSender.sendExerciseInvOffer(
        {
            id: 'gov-mem-3',
            instance: instances['CrabbleGovernor'],
            description: 'Crabble Governance Invitation Handler',
        },
        'mem3',
    );

    console.log('Exercise committee invitations...');
    await offerSender.sendExerciseInvOffer(
        {
            id: 'mem-1',
            instance: instances['CrabbleCommittee'],
            description: 'Voter0',
        },
        'mem1',
    );

    await offerSender.sendExerciseInvOffer(
        {
            id: 'mem-2',
            instance: instances['CrabbleCommittee'],
            description: 'Voter1',
        },
        'mem2',
    );

    await offerSender.sendExerciseInvOffer(
        {
            id: 'mem-3',
            instance: instances['CrabbleCommittee'],
            description: 'Voter2',
        },
        'mem3',
    );
};

exerciseGovInvitations()
    .then(() => {
        logger('[EXERCISE_INVITATIONS - Success]', 'We are done, exiting with code 0.');
        process.exit(0);
    })
    .catch(err => {
        logger('[EXERCISE_INVITATIONS - Error]', err);
        process.exit(1);
    });
