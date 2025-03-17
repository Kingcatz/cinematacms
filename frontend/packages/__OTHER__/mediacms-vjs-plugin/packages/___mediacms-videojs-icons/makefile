install:
	npm install

update:
	npm update --dev

clean-installation: clean-build 
	node ./scripts/rmrf.js ./node_modules

reset-installation: clean-installation install

build:
	npm run build

.PHONY : build

clean-build:
	npm run clean:build

package: build
	npm pack
