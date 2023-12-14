import { submitCoreEval } from "./commands";

const main = () => {
  const params = {
    rpc: "http://0.0.0.0:26657",
    chain_id: "agoriclocal",
    key: "gov1",
    deposit: "1000000ubld",
    gas: "auto",
    adjustment: "1.2",
    title: "Crabble-rc2",
    description: "Crabble core-eval for source contract",
  };

  const coreEvalList = [
    [
      "crabble-operator/assets/gov-permit.json",
      "crabble-operator/assets/govStarting.js",
    ],
    [
      "crabble-operator/assets/crabble-permit.json",
      "crabble-operator/assets/crabbleCoreEval.js",
    ],
  ];

  submitCoreEval(coreEvalList, params);
};

main();
