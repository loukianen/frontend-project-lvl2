import path from 'path';
import program from 'commander';
import _ from 'lodash';
import pkg from '../package.json';
import parse from './parser';

const getFullPath = (value) => {
  const valueParts = value.split('/');
  const fileName = valueParts.pop();
  const catalog = valueParts.join('/');
  return path.resolve(catalog, fileName);
};
const addIndent = (obj) => {
  if (!_.isObject(obj)) return obj;
  return _.reduce(obj, (acc, value, reduceKey) => {
    const newKey = `  ${reduceKey}`;
    acc[newKey] = addIndent(value);
    return acc;
  }, {});
};
const getDiffThree = (file1, file2) => {
  const three = {};
  const keys = new Set([...Object.keys(file2), ...Object.keys(file1)].sort());
  keys.forEach((key) => {
    const answers = { file1: _.has(file1, key), file2: _.has(file2, key) };
    if (answers.file1 === true && answers.file2 === true) {
      if (file1[key] === file2[key]) {
        three[`  ${key}`] = file1[key];
      } else if (_.isObject(file1[key]) && _.isObject(file2[key])) {
        three[`  ${key}`] = getDiffThree(file1[key], file2[key]);
      } else {
        three[`+ ${key}`] = addIndent(file2[key]);
        three[`- ${key}`] = addIndent(file1[key]);
      }
    } else if (answers.file2 === true) {
      three[`+ ${key}`] = addIndent(file2[key]);
    } else {
      three[`- ${key}`] = addIndent(file1[key]);
    }
  });
  return three;
};
const render = (obj, indent = 2) => {
  const result = `${_.reduce(obj, (acc, value, key) => {
    if (_.isObject(value)) {
      return `${acc}\n${' '.repeat(indent)}${key}: ${render(value, indent + 4)}`;
    }
    return `${acc}\n${' '.repeat(indent)}${key}: ${value}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};
const genDiff = (path1, path2) => {
  const dataBefore = parse(path1);
  const dataAfter = parse(path2);
  const diff = getDiffThree(dataBefore, dataAfter);
  const res = render(diff);
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
export { start, getFullPath };
export default genDiff;
