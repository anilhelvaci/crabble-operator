CHAINID=agoriclocal
USER1ADDR=$(shell agd keys show gov1 -a --keyring-backend="test")
ACCT_ADDR=$(USER1ADDR)
BLD=000000ubld

CRABBLE_ROOT=/workspace

ATOM_DENOM=ibc/BA313C4A19DFBF943586C0387E6B11286F9E416B4DD27574E6909CABE0E342FA
ATOM=000000$(ATOM_DENOM)

AGORIC_BIN_PATH=/usr/src/agoric-sdk

CONTRACT_NAME="contract"
GOVERNOR_NAME="governor"
ASSETS_FAUCET_NAME="assetsFaucet"

ASSETS_FAUCET_BUNDLE_ID = \"$(shell jq '.endoZipBase64Sha512' $(CRABBLE_ROOT)/bundles/bundle-$(ASSETS_FAUCET_NAME).json)\"

VALIDATOR = $(shell agd keys show -a validator --keyring-backend=test)

FAUCET_PERMIT = $(CRABBLE_ROOT)/contract/src/proposals/faucet-permit.json
ASSET_EVAL = $(CRABBLE_ROOT)/contract/src/proposals/assets-core-eval.js
EVAL_DEPOSIT = 10000000ubld
VOTE_OPTION = yes

balance-q: target = $(shell agd keys show $(TARGET) -a --keyring-backend="test")
balance-q:
	agd keys show $(target) -a --keyring-backend="test"
	agd query bank balances $(target)

GAS_ADJUSTMENT=1.2
SIGN_BROADCAST_OPTS=--keyring-backend=test --chain-id=$(CHAINID) \
		--gas=auto --gas-adjustment=$(GAS_ADJUSTMENT) \
		--yes -b block

WANT_VALUE=10000
GIVE_VALUE=5000
TO=$(USER1ADDR)
mint-ist:
	make FUNDS=$(GIVE_VALUE)$(ATOM) ACCT_ADDR=$(TO) fund-acct -f Makefile
	cd $(AGORIC_BIN_PATH) && \
		yarn --silent agops vaults open --wantMinted $(WANT_VALUE) --giveCollateral $(GIVE_VALUE) >/tmp/want4k.json && \
		yarn --silent agops perf satisfaction --executeOffer /tmp/want4k.json --from gov1 --keyring-backend=test
	sleep 3

FUNDS=321$(BLD)
fund-acct:
	agd tx bank send validator $(ACCT_ADDR) $(FUNDS) \
	  $(SIGN_BROADCAST_OPTS) \
	  -o json >,tx.json
	jq '{code: .code, height: .height}' ,tx.json

gov-q:
	agd query gov proposals --output json | \
		jq -c '.proposals[] | [.proposal_id,.voting_end_time,.status, .total_deposit]'

VOTE_OPTION=yes
vote: PROPOSAL= $(shell agd query gov proposals --output json | jq -c '.proposals | length')
vote:
	agd tx gov vote $(PROPOSAL) yes --from=$(VALIDATOR) $(SIGN_BROADCAST_OPTS) -o json > ,tx.json
	jq '{code: .code, height: .height}' ,tx.json

instance-q:
	agd query vstorage data published.agoricNames.instance -o json

publish-governor:
	agd tx swingset install-bundle @$(CRABBLE_ROOT)/assets/bundle-$(GOVERNOR_NAME).json --from gov1 $(SIGN_BROADCAST_OPTS)

publish-contract:
	agd tx swingset install-bundle @$(CRABBLE_ROOT)/assets/bundle-$(CONTRACT_NAME).json --from gov1 $(SIGN_BROADCAST_OPTS)

publish-assets-faucet:
	agd tx swingset install-bundle @$(CRABBLE_ROOT)/bundles/bundle-$(ASSETS_FAUCET_NAME).json --from gov1 $(SIGN_BROADCAST_OPTS)

publish-all: publish-contract publish-governor publish-assets-faucet
	sleep 3

clear-asset-proposal:
	sed -i 's_const assetsFaucetBundleID = \".*\"_const assetsFaucetBundleID = '' _' $(CRABBLE_ROOT)/contract/src/proposals/assets-core-eval.js

edit-asset-proposal: clear-asset-proposal
	sed -i "s_const assetsFaucetBundleID = ''_const assetsFaucetBundleID = $(ASSETS_FAUCET_BUNDLE_ID)_" $(CRABBLE_ROOT)/contract/src/proposals/assets-core-eval.js

asset-core-eval: edit-asset-proposal
	agd tx gov submit-proposal swingset-core-eval \
    		$(FAUCET_PERMIT) $(ASSET_EVAL) \
    		--title="Swingset core eval" --description="Evaluate $(ASSET_EVAL)" --deposit=$(EVAL_DEPOSIT) \
    		--from validator $(SIGN_BROADCAST_OPTS)
	sleep 3

gov-starter-core-eval:
	agd tx gov submit-proposal swingset-core-eval \
        		$(CRABBLE_ROOT)/assets/gov-permit.json $(CRABBLE_ROOT)/assets/govStarting.js \
        		--title="Swingset core eval" --description="Evaluate generic upgradable starter" --deposit=$(EVAL_DEPOSIT) \
        		--from validator $(SIGN_BROADCAST_OPTS)
	sleep 3

crabble-core-eval:
	agd tx gov submit-proposal swingset-core-eval \
        		$(CRABBLE_ROOT)/assets/crabble-permit.json $(CRABBLE_ROOT)/assets/crabbleCoreEval.js \
        		--title="Swingset core eval" --description="Start Crabble" --deposit=$(EVAL_DEPOSIT) \
        		--from validator $(SIGN_BROADCAST_OPTS)
	sleep 3

combined-core-eval:
	agd tx gov submit-proposal swingset-core-eval \
					$(CRABBLE_ROOT)/assets/gov-permit.json $(CRABBLE_ROOT)/assets/govStarting.js \
					$(CRABBLE_ROOT)/assets/crabble-permit.json $(CRABBLE_ROOT)/assets/crabbleCoreEval.js \
					--title="Swingset core eval" --description="Evaluate generic upgradable starter and start Crabble" --deposit=$(EVAL_DEPOSIT) \
					--from validator $(SIGN_BROADCAST_OPTS)
	sleep 3
