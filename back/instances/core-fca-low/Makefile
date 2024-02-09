DKS_PATH := ../../../docker/docker-stack

mongo db:
	$(DKS_PATH) mongo-shell-core-fca-low

reset-db:
	$(DKS_PATH) reset-db-core-fca-low

start s:
	$(DKS_PATH) prune && $(DKS_PATH) up bdd-fca-low && $(DKS_PATH) start-all

restart r:
	$(DKS_PATH) start-all

stop:
	$(DKS_PATH) stop-all

log l:
	$(DKS_PATH) log core-fca-low

bash b:
	$(DKS_PATH) exec core-fca-low bash

prepare p:
	$(DKS_PATH) exec core-fca-low yarn lint --fix && $(DKS_PATH) exec core-fca-low yarn prettier --write

doc:
	$(DKS_PATH) exec core-fca-low yarn doc

test-coverage tc:
	$(DKS_PATH) exec core-fca-low yarn test --coverage	

test t:
	$(DKS_PATH) exec core-fca-low yarn test	

quality tq:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn start:low

quality-headless tqh:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn start:low

visual v:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn test:low:snapshot

update-visual:
	cd $(FC_ROOT)/fc/quality/fca && yarn install && yarn test:low:snapshot --env updateSnapshots=true

ci:
	$(MAKE) doc && $(MAKE) prepare && $(MAKE) test-coverage && $(MAKE) tl && $(MAKE) tqh && $(MAKE) v

test-legacy tl:
	cd $(FC_ROOT)/fc/back  && yarn run test:e2e:core-fca-low
