import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { INSTANCE_KEYWORDS } from '../loadTests/constants.js';
import { initWatcher, toObjectRecord } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const buyoutRental = async () => {
    const borrowerKey = process.env.BORROWER_KEY || 'gov';
    const rentalCount = process.env.RENTAL_COUNT || 0;
    const infoIndex = process.env.INFO_INDEX || 0;
    const buyoutInfo = smokeConfig.buyouts[infoIndex];
    const desiredRental = smokeConfig.rentals[buyoutInfo.rentalIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState, getRental },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { instances, brands } = toObjectRecord(stateRaw, ['brands', 'instances']);
    const { rentalHandle } = await getRental(`rental${rentalCount}`);
    console.log({
        instances,
        brands,
        rentalHandle,
    });

    const utilityAmount = AmountMath.make(brands[desiredRental.utility.keyword], desiredRental.utility.value);
    const rentalFeeAmount = AmountMath.make(
        brands[desiredRental.rentalFeePerUnit.keyword],
        desiredRental.rentalFeePerUnit.value * buyoutInfo.rentingDuration,
    );
    const collateralAmount = AmountMath.make(brands[desiredRental.collateral.keyword], desiredRental.collateral.value);
    console.log({
        utilityAmount,
        rentalFeeAmount,
        collateralAmount,
    });

    const info = offerSender.sendBuyOutOffer(
        {
            id: buyoutInfo.offerId,
            instance: INSTANCE_KEYWORDS.crabble,
            rentalHandle,
            proposal: {
                give: {
                    Collateral: collateralAmount,
                    RentalFee: rentalFeeAmount,
                },
                want: {
                    Utility: utilityAmount,
                },
            },
            rentingDuration: buyoutInfo.rentingDuration,
        },
        borrowerKey,
    );

    logger('[BuyOutRental]', info);
};

buyoutRental()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
