import "./installSesLockdown.js";
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";
import { makeCrabbleFlowOffers } from "./crabbleFlow.js";

const exerciseAdHocFlow = async () => {
  const { watch, getState, marshaller } = makeChainWatcher(
    "https://xnet.agoric.net/network-config"
  );
  const offerSender = makeOfferSender(marshaller);

  watch();
  const {
    instances: rawInstances,
    brands: rawBrands,
    issuers: rawIssuers,
  } = await getState();
  const instances = Object.fromEntries(rawInstances);
  const brands = Object.fromEntries(rawBrands);
  const issuers = Object.fromEntries(rawIssuers);

  const crabbleOffers = makeCrabbleFlowOffers(
    offerSender,
    instances,
    brands,
    issuers
  );

  console.log("Exercise Ad-Hoc Create Rental...");

  crabbleOffers.createAdHocRental("createRental-1", "gov1");
  crabbleOffers.buyOut("buyout-1", "!!!!!rentalHandle", "gov1");
  crabbleOffers.withdrawUtility("withdraw-utility-1", "createRental-1", "gov1");
  crabbleOffers.withdrawCollateral(
    "withdraw-collateral-1",
    "createRental-1",
    "gov1"
  );
  crabbleOffers.withdrawRentalFee(
    "withdraw-rental-fee-1",
    "createRental-1",
    "gov1"
  );
  crabbleOffers.createAuctionRental("createRental-2", "gov1");
  crabbleOffers.bid("bid-1", "!!!!!rentalHandle", "gov1");
  crabbleOffers.acceptBid("acceptBid-1", "createRental-2", "bid-1", "gov1");
};

exerciseAdHocFlow().then(() => process.exit(0));
