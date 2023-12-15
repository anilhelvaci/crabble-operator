import { vote } from "./commands.js";

const main = () => {
  const params = {
    rpc: "http://0.0.0.0:26657",
    chain_id: "agoriclocal",
    key: "gov3",
    deposit: "1000000ubld",
    gas: "auto",
    adjustment: "1.2",
    title: "Crabble-rc2",
    description: "Crabble core-eval for source contract",
  };

  vote(params);
};

main();


// agd query gov proposals --node "http://0.0.0.0:26657" --chain-id "agoriclocal"