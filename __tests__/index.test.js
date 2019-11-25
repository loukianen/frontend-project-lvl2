import fs from 'fs';
import genDiff from '../src/';
// import {getFullPath, getDifference} from '../src/';

const fileJson1 = `${__dirname}/__fixtures__/before.json`;
const fileJson2 = `${__dirname}/__fixtures__/after.json`;
const fileYml1 = `${__dirname}/__fixtures__/before.yml`;
const fileYml2 = `${__dirname}/__fixtures__/after.yml`;
const etalon = `${__dirname}/__fixtures__/etalon`;
const getConsts = (firstFile, secondFile) => {
  const expectResult = fs.readFileSync(etalon, 'utf8').split('\n');
  const result = genDiff(firstFile, secondFile).split('\n');
  const wrongResult = genDiff(firstFile, secondFile).split('\n').slice(1);
  return [expectResult, result, wrongResult];
};
const constsJson = getConsts(fileJson1, fileJson2);
const constsYml = getConsts(fileYml1, fileYml2);
test('getDiffJsonTrue', () => {
  expect(constsJson[1]).toEqual(expect.arrayContaining(constsJson[0]));
  expect(constsJson[0]).toEqual(expect.arrayContaining(constsJson[1]));
})
test('ggetDiffJsonFalse', () => {
  expect(constsJson[2]).not.toEqual(expect.arrayContaining(constsJson[0]));
})
test('getDiffYmlTrue', () => {
  expect(constsYml[1]).toEqual(expect.arrayContaining(constsYml[0]));
  expect(constsYml[0]).toEqual(expect.arrayContaining(constsYml[1]));
})
test('ggetDiffYmlFalse', () => {
  expect(constsYml[2]).not.toEqual(expect.arrayContaining(constsYml[0]));
})

/* test('getFullPath', () => {
  expect(getFullPath('/home/lkf/projects/frontend-project-lvl2/data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('./data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('../../data/before.json')).toBe('/home/lkf/data/before.json');
  expect(getFullPath('before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/before.json');
})*/
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1