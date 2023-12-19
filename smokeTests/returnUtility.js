import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { initWatcher, toObjectRecord } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const returnUtility = async () => {
    const borrowerKey = process.env.BORROWER_KEY || 'gov';
    const infoIndex = process.env.INFO_INDEX || 0;
    const returnUtilInfo = smokeConfig.returns[infoIndex];
    const buyoutInfo = smokeConfig.buyouts[returnUtilInfo.buyoutIndex];
    const desiredRental = smokeConfig.rentals[returnUtilInfo.rentalIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { brands } = toObjectRecord(stateRaw, ['brands', 'instances']);

    const utilityAmount = AmountMath.make(brands[desiredRental.utility.keyword], desiredRental.utility.value);
    const collateralAmount = AmountMath.make(brands[desiredRental.collateral.keyword], desiredRental.collateral.value);
    console.log({
        utilityAmount,
        collateralAmount,
    });

    const info = offerSender.sendReturnUtilityOffer(
        {
            id: returnUtilInfo.offerId,
            previousOffer: buyoutInfo.offerId,
            proposal: {
                give: {
                    Utility: utilityAmount,
                },
                want: {
                    Collateral: collateralAmount,
                },
            },
        },
        borrowerKey,
    );

    logger('[ReturnUtility]', info);
};

returnUtility()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
