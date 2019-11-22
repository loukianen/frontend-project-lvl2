import path from 'path';
import fs from 'fs';
import program from 'commander';
import _ from 'lodash';
import pkg from '../package.json';

const getFullPath = (value) => {
  const valueParts = value.split('/');
  const fileName = valueParts.pop();
  const catalog = valueParts.join('/');
  return path.resolve(catalog, fileName);
};
const getDifference = (before, after) => {
  const difference = _.reduce(before, (acc, value, key) => {
    if (!_.has(after, [key])) {
      acc.push(`  - ${key}: ${before[key]}`);
    } else if (value === after[key]) {
      acc.push(`    ${key}: ${value}`);
    } else {
      acc.push(`  + ${key}: ${after[key]}`);
      acc.push(`  - ${key}: ${value}`);
    }
    return acc;
  }, []);
  return _.reduce(after, (acc, value, key) => {
    if (!_.has(before, [key])) acc.push(`  + ${key}: ${value}`);
    return acc;
  }, difference);
};
const genDiff = (path1, path2) => {
  const jsonBefore = JSON.parse(fs.readFileSync(path1));
  const jsonAfter = JSON.parse(fs.readFileSync(path2));
  const diffArr = getDifference(jsonBefore, jsonAfter);
  const res = `{\n${diffArr.join('\n')}\n}`;
  console.log(res);
  return res;
};
const start = () => {
  program.version(pkg.version);
  program.description('Compares two configuration files and shows a difference.');
  program.option('-f, --format [type]', 'Output format');
  program.arguments('<firstPath> <secondPath>');
  program.action((firstPath, secondPath) => genDiff(firstPath, secondPath));
  program.parse(process.argv);
};
export { start, getFullPath, getDifference };
export default genDiff;
