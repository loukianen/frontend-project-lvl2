install:
	npm install
help:
	npx babel-node -- src/bin/gendiff.js -h
exs:
	npx babel-node -- src/bin/gendiff.js -f plain data/before.ini data/after.ini
t:
	npx babel-node -- src/testParams.js
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npx jest