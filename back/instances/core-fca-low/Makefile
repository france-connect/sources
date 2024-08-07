DKS_PATH := ../../../docker/docker-stack

mongo db:
	$(DKS_PATH) mongo-shell-core-fca-low

reset-db:
	$(DKS_PATH) reset-db-core-fca-low

start s:
	$(DKS_PATH) prune && $(DKS_PATH) up bdd-fca-low && $(DKS_PATH) start-all

start-offline so:
	$(DKS_PATH) prune && OFFLINE=1 $(DKS_PATH) up bdd-fca-low && $(DKS_PATH) start-all

start-min sm:
	$(DKS_PATH) prune && $(DKS_PATH) up min-fca-low && $(DKS_PATH) start-all

start-rie rie:
	$(DKS_PATH) prune && $(DKS_PATH) up min-fca-rie && $(DKS_PATH) start-all

restart r:
	$(DKS_PATH) start-all

stop:
	$(DKS_PATH) stop-all

log l:
	$(DKS_PATH) log core-fca-low

log-rie lrie:
	$(DKS_PATH) log core-fca-rie

bash b:
	$(DKS_PATH) exec core-fca-low bash

prepare p:
	$(DKS_PATH) exec core-fca-low yarn lint --fix && $(DKS_PATH) exec core-fca-low yarn prettier --write

prepare-full pf:
	$(DKS_PATH) exec core-fca-low yarn lint --fix &&\
	$(DKS_PATH) exec core-fca-low yarn prettier --write &&\
	cd $(FC_ROOT)/fc/quality/fca && yarn lint --fix && yarn prettier --write

doc:
	$(DKS_PATH) exec core-fca-low yarn doc

test-coverage tc:
	$(DKS_PATH) exec core-fca-low yarn test --coverage	

test t:
	$(DKS_PATH) exec core-fca-low yarn test	

quality tq:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn start:low

quality-hide tqh:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn test:low

quality-integration tqi:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && CYPRESS_TEST_ENV=integ01 yarn start:low

visual v:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn test:low:snapshot

update-visual:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn test:low:snapshot --env updateSnapshots=true

ci-legacy:
	$(MAKE) doc && $(MAKE) prepare && $(MAKE) test-coverage && $(MAKE) tqh && $(MAKE) v

halt:
	$(DKS_PATH) halt

## FC Exploitation

start-exploitation se:
	$(DKS_PATH) start exploitation-fca-low

log-exploitation le:
	$(DKS_PATH) log exploitation-fca-low

test-exploitation te:
	$(DKS_PATH) exec exploitation-fca-low yarn test	
