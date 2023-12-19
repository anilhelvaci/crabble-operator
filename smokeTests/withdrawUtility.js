import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { initWatcher, toObjectRecord, logger } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const withdrawUtility = async () => {
    const ownerKey = process.env.OWNER || 'gov';
    const infoIndex = process.env.INFO_INDEX || 0;
    const withdrawUtilInfo = smokeConfig.withdrawUtils[infoIndex];
    const rentalInfo = smokeConfig.rentals[withdrawUtilInfo.rentalIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { brands } = toObjectRecord(stateRaw, ['brands']);
    const utilityAmount = AmountMath.make(brands[rentalInfo.utility.keyword], rentalInfo.utility.value);

    console.log({
        utilityAmount,
    });

    // Withdraw rental fee, id, previousOffer, proposal
    const info = offerSender.sendWithdrawUtilityOffer(
        {
            id: withdrawUtilInfo.offerId,
            previousOffer: rentalInfo.offerId,
            proposal: {
                want: {
                    Utility: utilityAmount,
                },
            },
        },
        ownerKey,
    );

    logger('[WithdrawUtility]', info);
};

withdrawUtility()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
