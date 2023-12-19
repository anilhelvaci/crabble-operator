import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { INSTANCE_KEYWORDS } from '../loadTests/constants.js';
import { initWatcher, toObjectRecord, logger } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const createRental = async () => {
    const ownerKey = process.env.OWNER_KEY || 'gov1';
    const infoIndex = process.env.INFO_INDEX || 0;
    const rentalInfo = smokeConfig.rentals[infoIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { instances, brands } = toObjectRecord(stateRaw, ['brands', 'instances']);
    console.log({
        instances,
        brands,
    });

    const utilityAmount = AmountMath.make(brands[rentalInfo.utility.keyword], rentalInfo.utility.value);
    const rentalFeePerUnitAmount = AmountMath.make(
        brands[rentalInfo.rentalFeePerUnit.keyword],
        rentalInfo.rentalFeePerUnit.value,
    );
    const collateralAmount = AmountMath.make(brands[rentalInfo.collateral.keyword], rentalInfo.collateral.value);
    console.log({
        utilityAmount,
        rentalFeePerUnitAmount,
        collateralAmount,
    });

    const info = await offerSender.sendCreateRentalOffer(
        {
            id: rentalInfo.offerId,
            instance: instances[INSTANCE_KEYWORDS.crabble],
            proposal: {
                give: {
                    Utility: utilityAmount,
                },
            },
            rentalConfig: {
                utilityAmount,
                rentalFeePerUnitAmount,
                collateralAmount,
                ...rentalInfo.rentalConfig,
            },
        },
        ownerKey,
    );

    logger('[CreateRental]', info);
};

createRental()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
