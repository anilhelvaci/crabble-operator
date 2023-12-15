import "./installSesLockdown.js";
import { makeChainWatcher } from "./chainWatcher.js";
import { makeOfferSender } from "./offers.js";
import { makeCrabbleFlowOffers } from "./crabbleFlow.js";

/*
  Order:
    createAuctionRental
    bid
    acceptBid
    borrow
    returnUtility

  Frequency:
    Moderate: 10 mins, 5 tx per min = 50 tx = 10 cycles
    Increased: 10 mins, 10 tx per min = 100 tx = 20 cycles

  StartIndex = 1 number above current rental index on vStorage
*/

const exerciseAuctionFlow = async (startIndex, cycles) => {
  const { watch, getState, marshaller } = makeChainWatcher(
    "https://xnet.agoric.net/network-config"
  );
  const offerSender = makeOfferSender(marshaller);

  watch();
  const {
    instances: rawInstances,
    brands: rawBrands,
    issuers: rawIssuers,
    rentals: rawRentals,
  } = await getState();
  const instances = Object.fromEntries(rawInstances);
  const brands = Object.fromEntries(rawBrands);
  const issuers = Object.fromEntries(rawIssuers);
  const rentals = Object.fromEntries(rawRentals);

  const getRentalHandle = (index) => {
    return rentals[`rental${index}`].rentalHandle;
  };

  const crabbleOffers = makeCrabbleFlowOffers(
    offerSender,
    instances,
    brands,
    issuers
  );

  let waitingPeriod = 0;

  if (cycles === 10) {
    waitingPeriod = 10 * 100;
  } else {
    waitingPeriod = 5 * 100;
  }
  const delay = () =>
    new Promise((resolve) => setTimeout(resolve, waitingPeriod));

  console.log("Exercise Auction Create Rental...");

  for (let i = startIndex; i < startIndex + cycles; i++) {
    console.log(`Start Auction flow cycle: ${i - startIndex} ...`);

    crabbleOffers.createAuctionRental(`createRental-${i}`, "gov1");
    await delay();

    crabbleOffers.bid(`bid-${i}`, getRentalHandle(i), "gov1");
    await delay();

    crabbleOffers.acceptBid(
      `acceptBid-${i}`,
      `createRental-${i}`,
      `bid-${i}`,
      "gov1"
    );
    await delay();

    crabbleOffers.borrow(`borrow-${i}`, `bid-${i}`, "gov1");
    await delay();

    crabbleOffers.returnUtility(`auction-return-${i}`, `bid-${i}`, "gov1");
    await delay();

    console.log(`Cycle finished`);
  }
};

exerciseAuctionFlow(startIndex, cycles).then(() => process.exit(0));
