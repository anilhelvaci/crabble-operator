import { AmountMath } from "../_agstate/yarn-links/@agoric/ertp/src/index.js";
import scenarioConfigs from "./scenarioConfigs.js";

const BASE_OFFER_IDs = harden({
    ADHOC: {
        CREATE_RENTAL: 'create-adhoc-rental',
        BUYOUT_RENTAL: 'buyout-adhoc-rental',
        RETURN_UTIL: 'return-adhoc-utility',
        WITHDRAW_FEE: 'withdraw-fee-adhoc',
        WITHDRAW_UTIL: 'withdraw-util-adhoc',
    },
    AUCTION: {
        CREATE_RENTAL: 'create-auction-rental',
        BID: 'bid-auction',
        ACCEPT_BID: 'accept-bid-auction',
        BORROW_RENTAL: 'borrow-auction-rental',
        RETURN_UTIL: 'return-auction-utility',
        WITHDRAW_FEE: 'withdraw-fee-adhoc',
        WITHDRAW_UTIL: 'withdraw-util-adhoc',
    }
});

const INSTANCE_KEYWORDS = harden({
    crabble: 'Crabble',
});

const getAmounts = (brands, turn) => {
    const utilityAmount = AmountMath.make(
        brands["CrabbleCollection"],
        harden(scenarioConfigs.content[0].value(turn))
    );

    const collateralAmountFungible = AmountMath.make(
        brands["CrabbleIST"],
        harden(scenarioConfigs.content[1].value)
    );

    const collateralAmountNonFungible = AmountMath.make(
        brands[scenarioConfigs.content[1].keyword],
        harden(scenarioConfigs.content[0].value(turn))
    );

    const rentalFeePerUnitAmount = AmountMath.make(
        brands["CrabbleIST"],
        harden(scenarioConfigs.content[1].value)
    );

    const rentalFeeAmount = AmountMath.make(
        brands["CrabbleIST"],
        harden(
            scenarioConfigs.buyouts[0].rentingDuration *
            scenarioConfigs.content[1].value
        )
    );

    return harden({
        utilityAmount,
        collateralAmountNonFungible,
        collateralAmountFungible,
        rentalFeePerUnitAmount,
        rentalFeeAmount,
    });
};

export {
    BASE_OFFER_IDs,
    INSTANCE_KEYWORDS,
    getAmounts,
}