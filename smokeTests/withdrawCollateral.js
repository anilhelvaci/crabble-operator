import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { initWatcher, toObjectRecord, logger } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const withdrawCollateral = async () => {
    const ownerKey = process.env.OWNER || 'gov';
    const infoIndex = process.env.INFO_INDEX || 0;
    const withdrawColInfo = smokeConfig.withdrawCollaterals[infoIndex];
    const rentalInfo = smokeConfig.rentals[withdrawColInfo.rentalIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { brands } = toObjectRecord(stateRaw, ['brands']);
    const collateralAmount = AmountMath.make(brands[rentalInfo.collateral.keyword], rentalInfo.collateral.value);

    console.log({
        collateralAmount,
    });

    // Withdraw rental fee, id, previousOffer, proposal
    const info = offerSender.sendWithdrawCollateralOffer(
        {
            id: withdrawColInfo.offerId,
            previousOffer: rentalInfo.offerId,
            proposal: {
                want: {
                    Collateral: collateralAmount,
                },
            },
        },
        ownerKey,
    );

    logger('[WithdrawCollateral]', info);
};

withdrawCollateral()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
