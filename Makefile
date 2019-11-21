install:
	npm install
start:
	npx babel-node src/bin/gendiff
publish:
	npm publish --dry-run
lint:
	npx eslint .
test:
	npx jest
gendiff:
	npx babel-node src/bin/gendiff
1:
	node dist/genDiff.js