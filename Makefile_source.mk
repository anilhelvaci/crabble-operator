CHAIN_ID = agoric-mainfork-1

SDK_ROOT = $(shell cd ./agoric-sdk >/dev/null && pwd)
ROOT=$(shell cd ./ >/dev/null && pwd)

AGCH = "$(SDK_ROOT)/bin/agd"oı
AGORIC = "$(SDK_ROOT)/packages/agoric-cli/bin/agoric"

DEV_RPC='https://devnet.rpc.agoric.net:443'
RPC=https://xnet.rpc.agoric.net:443
EVAL_DEPOSIT = 1000000ubld
DEV_CHAIN_ID=agoricdev-21

OFFER=agoricOffer
MEM=mem1

SIGN_BROADCAST_OPTS=--keyring-backend=test --chain-id=$(CHAIN_ID) \
		--gas=auto --gas-adjustment=1.2 \
		--yes -b block --node $(RPC) --output json

update-ref-list:
	$(AGORIC) deploy $(HELPER_ROOT)/updateReferenceList.js
	sleep 3

update-asset-list:
	$(AGORIC) deploy $(HELPER_ROOT)/updateAssetList.js
	sleep 3

init-refs: update-asset-list update-ref-list

exercise-voter-invite:
	MEM=1 node $(HELPER_ROOT)/buildExerciseVoterInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=2 node $(HELPER_ROOT)/buildExerciseVoterInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem2 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=3 node $(HELPER_ROOT)/buildExerciseVoterInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem3 --keyring-backend=test --offer=$(OFFER)
	sleep 3

exercise-mem-invite:
	MEM=1 node $(HELPER_ROOT)/buildExerciseMemberInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=2 node $(HELPER_ROOT)/buildExerciseMemberInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem2 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=3 node $(HELPER_ROOT)/buildExerciseMemberInviteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem3 --keyring-backend=test --offer=$(OFFER)
	sleep 3

add-asset-question:
	$(AGORIC) deploy $(HELPER_ROOT)/updateReferenceList.js
	OFFER_ID=$(OFFER_ID) KEYWORD=$(KEYWORD) MEM=1 node $(HELPER_ROOT)/buildAddNewAssetOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)

vote-asset-question:
	$(AGORIC) deploy $(HELPER_ROOT)/updateReferenceList.js
	CONFIG_INDEX=$(CONFIG_INDEX) MEM=1 KEYWORD=$(KEYWORD) node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	CONFIG_INDEX=$(CONFIG_INDEX) MEM=2 KEYWORD=$(KEYWORD) node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem2 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	CONFIG_INDEX=$(CONFIG_INDEX) MEM=3 KEYWORD=$(KEYWORD) node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem3 --keyring-backend=test --offer=$(OFFER)
	sleep 3

pause-offer-question:
	$(AGORIC) deploy $(HELPER_ROOT)/updateReferenceList.js
	OFFER_ID=$(OFFER_ID) MEM=1 CONFIG_INDEX=$(CONFIG_INDEX) node $(HELPER_ROOT)/buildPauseOffersPropOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)

vote-pause-offer:
	$(AGORIC) deploy $(HELPER_ROOT)/updateReferenceList.js
	MEM=1 CONFIG_INDEX=$(CONFIG_INDEX)  node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem1 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=2 CONFIG_INDEX=$(CONFIG_INDEX) node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem2 --keyring-backend=test --offer=$(OFFER)
	sleep 3
	MEM=3 CONFIG_INDEX=$(CONFIG_INDEX) node $(HELPER_ROOT)/buildVoteOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGORIC) wallet send --from mem3 --keyring-backend=test --offer=$(OFFER)
	sleep 3

fund-app-users:
	$(AGORIC) deploy $(HELPER_ROOT)/updateAssetList.js
	CONFIG_INDEX=$(CONFIG_INDEX) node $(HELPER_ROOT)/buildFaucetOfferSpec.js >| $(OFFER)
	cat $(OFFER)
	$(AGCH) tx swingset wallet-action \"$(cat $(OFFER))\" --allow-spend --from $(ACC) --keyring-backend=test --node=$(DEV_RPC) --chain-id=$(DEV_CHAIN_ID) --yes
	sleep 3

add-new-asset: add-asset-question vote-asset-question

pause-offers: pause-offer-question vote-pause-offer

combined-core-eval:
	agd tx gov submit-proposal swingset-core-eval \
					$(CRABBLE_ROOT)/assets/gov-permit.json $(CRABBLE_ROOT)/assets/govStarting.js \
					$(CRABBLE_ROOT)/assets/crabble-permit.json $(CRABBLE_ROOT)/assets/crabbleCoreEval.js \
					--title="Swingset core eval" --description="Evaluate generic upgradable starter and start Crabble" --deposit=$(EVAL_DEPOSIT) \
					--from gov1 $(SIGN_BROADCAST_OPTS)
	sleep 3

vote-dev:
	agd tx gov vote $(VOTE_PROPOSAL) yes --from gov1 $(SIGN_BROADCAST_OPTS)

deposit:
	agd tx gov deposit $(VOTE_PROPOSAL) $(EVAL_DEPOSIT) --from gov1 $(SIGN_BROADCAST_OPTS)