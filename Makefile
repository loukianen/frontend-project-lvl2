install:
	npm install
help:
	npx babel-node -- src/bin/gendiff.js -h
exs:
	npx babel-node -- src/bin/gendiff.js -f json __fixtures__/before.ini __fixtures__/after.ini
t:
	npx babel-node -- src/testParams.js
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npx jest