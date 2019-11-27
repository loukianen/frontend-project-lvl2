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
const getConsts = (firstFile, secondFile, format = 'usual') => {
  const variants = {};
  variants.usual = (fail1, fail2) => {
    const expectResult = fs.readFileSync(etalon, 'utf8');
    const result = genDiff(fail1, fail2);
    const wrongResult = `${expectResult}}`;
    return [expectResult, result, wrongResult];
  };
  variants.plain = (fail1, fail2) => {
    const expectResult = fs.readFileSync(etalonPlain, 'utf8');
    const result = genDiff(fail1, fail2, 'plain');
    const wrongResult = `${expectResult}}`;
    return [expectResult, result, wrongResult];
  };
  return variants[format](firstFile, secondFile, format)
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
  getConsts(fileJson1, fileJson2, 'plain'),
  getConsts(fileYml1, fileYml2, 'plain'),
  getConsts(fileIni1, fileIni2, 'plain'),
])('getDiffUsual%# json, yml, ini', (expRes, res, wrong) => {
  expect(res).toBe(expRes);
  expect(res).not.toBe(wrong);
}, 10);
/*])('getDiff%# json, yml, ini', (expRes, res, wroRes) => {
  expect(res).toEqual(expect.arrayContaining(expRes));
  expect(expRes).toEqual(expect.arrayContaining(res));
  expect(wroRes).not.toEqual(expect.arrayContaining(expRes));
});*/
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1