import { submitCoreEval } from "./commands.js";

const main = () => {
  const params = {
    rpc: "http://0.0.0.0:26657",
    chain_id: "agoriclocal",
    key: "gov3",
    deposit: "10000000ubld",
    gas: "auto",
    adjustment: "1.2",
    title: "Crabble-rc2",
    description: "Crabble_core-eval_for_source_contract",
  };

  const coreEvalList = [
    [
      "./assets/gov-permit.json",
      "./assets/govStarting.js",
    ],
    [
      "./assets/crabble-permit.json",
      "./assets/crabbleCoreEval.js",
    ],
  ];

  submitCoreEval(coreEvalList, params);
};

main();
