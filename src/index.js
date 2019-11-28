import path from 'path';
import program from 'commander';
import _ from 'lodash';
import pkg from '../package.json';
import parse from './parser';
import getUsualFofmat from './formatters/usualFormatter';
import getPlainFofmat from './formatters/plainFormatter';
import getJsonFormat from './formatters/jsonFormatter';

const render = { usual: getUsualFofmat, plain: getPlainFofmat, json: getJsonFormat };
const getFullPath = (value) => {
  const valueParts = value.split('/');
  const fileName = valueParts.pop();
  const catalog = valueParts.join('/');
  return path.resolve(catalog, fileName);
};
const addStructure = (obj) => {
  if (!_.isObject(obj)) return obj;
  return _.reduce(obj, (acc, value, reduceKey) => {
    const newNode = {};
    newNode.name = reduceKey;
    newNode.option = ' ';
    if (_.isObject(value)) {
      newNode.children = addStructure(value);
    } else {
      newNode.value = value;
    }
    return { newNode, ...acc };
  }, {});
};
const getDiffThree = (file1, file2) => {
  const keys = Array.from(new Set([...Object.keys(file2), ...Object.keys(file1)])).sort();
  return keys.reduce((three, key) => {
    const answers = { file1: _.has(file1, key), file2: _.has(file2, key) };
    const threeNode = {};
    const threeNodeMinus = {};
    if (answers.file1 === true && answers.file2 === true) {
      if (file1[key] === file2[key]) {
        threeNode.name = key;
        threeNode.value = file1[key];
        threeNode.option = ' ';
      } else if (_.isObject(file1[key]) && _.isObject(file2[key])) {
        threeNode.name = key;
        threeNode.option = ' ';
        threeNode.children = getDiffThree(file1[key], file2[key]);
      } else {
        threeNode.name = key;
        threeNode.option = '+';
        if (_.isObject(file2[key])) {
          threeNode.children = addStructure(file2[key]);
        } else {
          threeNode.value = file2[key];
        }
        threeNodeMinus.name = key;
        threeNodeMinus.option = '-';
        if (_.isObject(file1[key])) {
          threeNodeMinus.children = addStructure(file1[key]);
        } else {
          threeNodeMinus.value = file1[key];
        }
      }
    } else if (answers.file2 === true) {
      threeNode.name = key;
      threeNode.option = '+';
      if (_.isObject(file2[key])) {
        threeNode.children = addStructure(file2[key]);
      } else {
        threeNode.value = file2[key];
      }
    } else {
      threeNodeMinus.name = key;
      threeNodeMinus.option = '-';
      if (_.isObject(file1[key])) {
        threeNodeMinus.children = addStructure(file1[key]);
      } else {
        threeNodeMinus.value = file1[key];
      }
    }
    return [...three, threeNode, threeNodeMinus].filter((el) => Object.keys(el).length > 0);
  }, []);
};
const genDiff = (path1, path2, format = 'usual') => {
  const dataBefore = parse(getFullPath(path1));
  const dataAfter = parse(getFullPath(path2));
  const diff = getDiffThree(dataBefore, dataAfter);
  const res = render[format](diff);
  console.log(res);
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
export { start, getFullPath };
export default genDiff;
