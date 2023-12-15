import { publishContract } from "./commands.js";

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

  const bundleContract = "@/operator/assets/bundle-contract.json";
  const bundleGov = "@/operator/assets/bundle-governor.json";

  publishContract(bundleContract, params);
  publishContract(bundleGov, params);
};

main();
