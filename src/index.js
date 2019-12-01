import path from 'path';
import program from 'commander';
import _ from 'lodash';
import pkg from '../package.json';
import parse from './parser';
import nodeMakers from './nodeMakers';
import nodeMakeParams from './nodeMakeParams';
import getUsualFofmat from './formatters/usualFormatter';
import getPlainFofmat from './formatters/plainFormatter';
import getJsonFormat from './formatters/jsonFormatter';

const renders = { usual: getUsualFofmat, plain: getPlainFofmat, json: getJsonFormat };
const getFullFilePath = (filePath) => {
  const pathParts = filePath.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const fileCatalog = pathParts.slice(0, -1).join('/');
  return path.resolve(fileCatalog, fileName);
};
const makeNode = (nodeName, valueBefore, valueAfter, type) => {
  const node = nodeMakers[type]([valueBefore, valueAfter]);
  node.name = nodeName;
  return node;
};
const addStructure = (nodeChildren) => _.reduce(nodeChildren, (acc, value, key) => {
  const nodeType = _.isObject(value) ? 'childrenChanged' : 'constant';
  const newNode = makeNode(key, value, value, nodeType);
  const res = { newNode, ...acc };
  return res;
}, {});
const getDiffThree = (file1, file2) => {
  const keys = _.union(Object.keys(file2), Object.keys(file1)).sort();
  const res = keys.reduce((three, key) => {
    const value1 = file1[key];
    const value2 = file2[key];
    const currentParams = {
      file1HasKey: _.has(file1, key),
      file2HasKey: _.has(file2, key),
      value1IsObject: _.isObject(value1),
      value2IsObject: _.isObject(value2),
      valuesEqual: value1 === value2,
    };
    const nodeType = _.findKey(nodeMakeParams, (params) => _.isEqual(params, currentParams));
    return [makeNode(key, value1, value2, nodeType), ...three];
  }, []);
  // console.log(res);
  return res;
};
const genDiff = (path1, path2, format = 'usual') => {
  const dataBefore = parse(getFullFilePath(path1));
  const dataAfter = parse(getFullFilePath(path2));
  const diff = getDiffThree(dataBefore, dataAfter);
  const res = renders[format](diff);
  // console.log(res);
  return res;
};
const start = () => {
  program.version(pkg.version);
  program.description('Compares two configuration files and shows a difference.');
  program.option('-f, --format [type]', 'Output format');
  program.arguments('<firstPath> <secondPath>');
  program.action((firstPath, secondPath, options) => {
    const res = genDiff(firstPath, secondPath, options.format);
    return res;
  });
  program.parse(process.argv);
};
export {
  start, getDiffThree, makeNode, addStructure,
};
export default genDiff;
