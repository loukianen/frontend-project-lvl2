import fs from 'fs';
import genDiff from '../src/';
// import {getFullPath, getDifference} from '../src/';

const firstFile = `${__dirname}/__fixtures__/before.json`;
const secondFile = `${__dirname}/__fixtures__/after.json`;
const etalon = `${__dirname}/__fixtures__/etalon`;
const expectResult = fs.readFileSync(etalon, 'utf8').split('\n');
const result = genDiff(firstFile, secondFile).split('\n');
const wrongResult = genDiff(firstFile, secondFile).split('\n').slice(1);
/* test('getFullPath', () => {
  expect(getFullPath('/home/lkf/projects/frontend-project-lvl2/data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('./data/before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/data/before.json');
  expect(getFullPath('../../data/before.json')).toBe('/home/lkf/data/before.json');
  expect(getFullPath('before.json')).toBe('/home/lkf/projects/frontend-project-lvl2/before.json');
})*/
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1
test('getDifference', () => {
  expect(result).toEqual(expect.arrayContaining(expectResult));
  expect(expectResult).toEqual(expect.arrayContaining(result));
})
test('getDifference', () => {
  expect(wrongResult).not.toEqual(expect.arrayContaining(expectResult));
})