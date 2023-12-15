import { publishContract, submitCoreEval, vote } from "./commands.js";

const main = () => {
  const params = {
    rpc: "http://0.0.0.0:26657",
    chain_id: "agoriclocal",
    key: "validator",
    deposit: "10000000ubld",
    gas: "auto",
    adjustment: "1.2",
    title: "Crabble-rc2",
    description: "Crabble_core-eval_for_source_contract",
  };

  const bundleContract = "@/operator/assets/bundle-contract.json";
  const bundleGov = "@/operator/assets/bundle-governor.json";

  const coreEvalList = [
    ["./assets/gov-permit.json", "./assets/govStarting.js"],
    ["./assets/crabble-permit.json", "./assets/crabbleCoreEval.js"],
  ];

  publishContract(bundleContract, params);
  publishContract(bundleGov, params);
  submitCoreEval(coreEvalList, params);
  vote(params);
};

main();

// agd query gov proposals --output json | jq -c '.proposals[] | [.proposal_id,.total_deposit,.final_tally_result,.status]'