import '../installSesLockdown.js';
import smokeConfig from './smoke.config.js';
import { initWatcher, toObjectRecord, logger } from '../helpers.js';
import { AmountMath } from '../_agstate/yarn-links/@agoric/ertp/src/index.js';

const withdrawRentalFee = async () => {
    const ownerKey = process.env.OWNER || 'gov';
    const rentalDuration = process.env.RENTAL_DURATION || 1n;
    const infoIndex = process.env.INFO_INDEX || 0;
    const withdrawFeeInfo = smokeConfig.withdrawFees[infoIndex];
    const rentalInfo = smokeConfig.rentals[withdrawFeeInfo.rentalIndex];

    const networkConfig = 'https://main.agoric.net/network-config';
    const {
        offerSender,
        chainWatcher: { watch, getState },
    } = await initWatcher(networkConfig);

    watch();
    const stateRaw = await getState();
    const { brands } = toObjectRecord(stateRaw, ['brands', 'instances']);
    const rentalFeeAmount = AmountMath.make(
        brands[rentalInfo.rentalFeePerUnit.keyword],
        rentalInfo.rentalFeePerUnit.value * rentalDuration,
    );

    console.log({
        rentalFeeAmount,
    });

    // Withdraw rental fee, id, previousOffer, proposal
    const info = offerSender.sendWithdrawRentalFeeOffer(
        {
            id: withdrawFeeInfo.offerId,
            previousOffer: rentalInfo.offerId,
            proposal: {
                want: {
                    RentalFee: rentalFeeAmount,
                },
            },
        },
        ownerKey,
    );

    logger('[WithdrawFee]', info);
};

withdrawRentalFee()
    .then(() => {
        console.log('Done');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
