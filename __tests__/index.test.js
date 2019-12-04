import fs from 'fs';
import genDiff from '../src/';

const fileJson1 = `${__dirname}/__fixtures__/before.json`;
const fileJson2 = `${__dirname}/__fixtures__/after.json`;
const fileYml1 = `${__dirname}/__fixtures__/before.yml`;
const fileYml2 = `${__dirname}/__fixtures__/after.yml`;
const fileIni1 = `${__dirname}/__fixtures__/before.ini`;
const fileIni2 = `${__dirname}/__fixtures__/after.ini`;
const etalon = `${__dirname}/__fixtures__/etalon`;
const etalonPlain = `${__dirname}/__fixtures__/etalonPlain`;
const etalonJson = `${__dirname}/__fixtures__/etalonJson`;
const getConsts = (firstFile, secondFile, format = 'usual') => {
  const variants = {};
  variants.usual = etalon;
  variants.plain = etalonPlain;
  variants.json = etalonJson;
  const expectResult = fs.readFileSync(variants[format], 'utf8');
  const result = genDiff(firstFile, secondFile, format);
  const wrongResult = `${expectResult}}`;
  return [expectResult, result, wrongResult];
};
test.each([
  getConsts(fileJson1, fileJson2),
  getConsts(fileYml1, fileYml2),
  getConsts(fileIni1, fileIni2),
])('getDiffUsual%# json, yml, ini', (expRes, res, wrong) => {
  expect(res).toBe(expRes);
  expect(res).not.toBe(wrong);
}, 10);
test.each([
  getConsts(fileIni1, fileIni2, 'plain'),
])('getDiffPlain%# json, yml, ini', (expRes, res, wrong) => {
  expect(res).toBe(expRes);
  expect(res).not.toBe(wrong);
}, 10);
test.each([
  getConsts(fileYml1, fileYml2, 'json'),
])('getDiffJson%# json, yml, ini', (expRes, res, wrong) => {
  expect(res).toBe(expRes);
  expect(res).not.toBe(wrong);
}, 10);
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1