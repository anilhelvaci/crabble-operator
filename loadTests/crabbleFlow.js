import "./installSesLockdown.js";
import { AmountMath } from "@agoric/ertp";
import scenarioConfigs from "./loadTests/scenarioConfigs.js";

const makeCrabbleFlowOffers = async (
  offerSender,
  instances,
  brands,
  issuers
) => {
  const utilityAmount = AmountMath.make(
    brands["CrabbleCollection"],
    harden(scenarioConfigs.content[2])
  );

  const collateralAmount = AmountMath.make(
    brands["CrabbleIST"],
    harden(scenarioConfigs.content[1])
  );

  const rentalFeePerUnitAmount = AmountMath.make(
    brands["CrabbleIST"],
    harden(scenarioConfigs.content[1])
  );

  const rentalFeeAmount = AmountMath.make(
    brands["CrabbleIST"],
    harden(
      scenarioConfigs.rentals.buyouts[0].rentingDuration *
        scenarioConfigs.content[1]
    )
  );

  const adHocRentalConfig = {
    utilityAmount,
    collateralAmount,
    rentalFeePerUnitAmount,
    ...scenarioConfigs.rentals[0].rentalConfig,
  };

  const auctionRentalConfig = {
    utilityAmount,
    collateralAmount: undefined,
    rentalFeePerUnitAmount: undefined,
    rentingTier: "Auction",
    ...scenarioConfigs.rentals[0].rentalConfig,
  };

  const bidConfig = {
    collateralIssuer: issuers["CrabbleIST"],
    rentalFeeIssuer: issuers["CrabbleIST"],
    collateralAmount,
    rentalFeePerUnitAmount,
    ...scenarioConfigs.bids[0].bidConfig,
  };

  const createAdHocRental = (rentalId, from) => {
    offerSender.sendCreateRentalOffer(
      {
        id: rentalId,
        instance: instances["Crabble"],
        proposal: { give: { Utility: utilityAmount } },
        rentalConfig: adHocRentalConfig,
      },
      from
    );
  };

  const createAuctionRental = (rentalId, from) => {
    offerSender.sendCreateRentalOffer(
      {
        id: rentalId,
        instance: instances["Crabble"],
        proposal: { give: { Utility: utilityAmount } },
        rentalConfig: auctionRentalConfig,
      },
      from
    );
  };

  const buyOut = (offerId, rentalHandle, from) => {
    offerSender.sendBuyOutOffer(
      {
        id: offerId,
        instance: instances["Crabble"],
        rentalHandle,
        proposal: {
          give: { Collateral: collateralAmount, RentalFee: rentalFeeAmount },
          want: { Utility: utilityAmount },
        },
        rentingDuration: scenarioConfigs.rentals.buyouts[0].rentingDuration,
      },
      from
    );
  };

  const bid = (offerId, rentalHandle, from) => {
    offerSender.sendBuyOutOffer(
      {
        id: offerId,
        instance: instances["Crabble"],
        rentalHandle,
        bidConfig,
      },
      from
    );
  };

  const acceptBid = (offerId, rentalId, bidId, from) => {
    offerSender.sendAcceptBidOffer(
      {
        id: offerId,
        previousOffer: rentalId,
        offerArgs: {
          bidId,
          acceptedWaitingPeriod: 60n * 60n,
        },
      },
      from
    );
  };

  const borrow = (offerId, rentalId, from) => {
    offerSender.sendBorrowOffer(
      {
        id: offerId,
        previousOffer: rentalId,
        proposal: {
          give: {
            Collateral: collateralAmount,
            RentalFee: rentalFeeAmount,
          },
          want: {
            Utility: utilityAmount,
          },
        },
      },
      from
    );
  };

  const returnUtility = (offerId, buyOutId, from) => {
    offerSender.sendReturnUtilityOffer(
      {
        id: offerId,
        previousOffer: buyOutId,
        proposal: {
          give: {
            Utility: utilityAmount,
          },
          want: {
            Collateral: collateralAmount,
          },
        },
      },
      from
    );
  };

  const withdrawUtility = (offerId, rentalId, from) => {
    offerSender.sendWithdrawUtilityOffer(
      {
        id: offerId,
        previousOffer: rentalId,
        proposal: {
          want: { Utility: utilityAmount },
        },
      },
      from
    );
  };

  const withdrawCollateral = (offerId, rentalId, from) => {
    offerSender.sendWithdrawCollateralOffer(
      {
        id: offerId,
        previousOffer: rentalId,
        proposal: {
          want: { Collateral: collateralAmount },
        },
      },
      from
    );
  };

  const withdrawRentalFee = (offerId, rentalId, from) => {
    offerSender.sendWithdrawRentalFeeOffer(
      {
        id: offerId,
        previousOffer: rentalId,
        proposal: {
          want: { RentalFee: rentalFeeAmount },
        },
      },
      from
    );
  };

  return harden({
    createAdHocRental,
    createAuctionRental,
    buyOut,
    bid,
    acceptBid,
    borrow,
    returnUtility,
    withdrawUtility,
    withdrawCollateral,
    withdrawRentalFee,
      utilityAmount,
      collateralAmount,
      rentalFeePerUnitAmount,
      rentalFeeAmount
  });
};
harden(makeCrabbleFlowOffers);

export { makeCrabbleFlowOffers };
