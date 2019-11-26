import fs from 'fs';
import genDiff from '../src/';

const fileJson1 = `${__dirname}/__fixtures__/before.json`;
const fileJson2 = `${__dirname}/__fixtures__/after.json`;
const fileYml1 = `${__dirname}/__fixtures__/before.yml`;
const fileYml2 = `${__dirname}/__fixtures__/after.yml`;
const fileIni1 = `${__dirname}/__fixtures__/before.ini`;
const fileIni2 = `${__dirname}/__fixtures__/after.ini`;
const etalon = `${__dirname}/__fixtures__/etalon`;
const getConsts = (firstFile, secondFile) => {
  const expectResult = fs.readFileSync(etalon, 'utf8').split('\n');
  const result = genDiff(firstFile, secondFile).split('\n');
  const wrongResult = genDiff(firstFile, secondFile).split('\n').slice(1);
  return [expectResult, result, wrongResult];
};
test.each([
  getConsts(fileJson1, fileJson2),
  getConsts(fileYml1, fileYml2),
  getConsts(fileIni1, fileIni2),
])('getDiff%# json, yml, ini', (expRes, res, wroRes) => {
  expect(res).toEqual(expect.arrayContaining(expRes));
  expect(expRes).toEqual(expect.arrayContaining(res));
  expect(wroRes).not.toEqual(expect.arrayContaining(expRes));
});
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1