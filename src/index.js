import path from 'path';
import program from 'commander';
import _ from 'lodash';
import pkg from '../package.json';
import parse from './parser';
// import getUsualFofmat from '../formatters/usualFormatter';
// import getPlainFofmat from '../formatters/plainFormatter';

const render1 = (obj, indent = 2) => {
  const result = `${_.reduce(obj, (acc, value) => {
    if (value.children) {
      return `${acc}\n${' '.repeat(indent)}${value.option} ${value.name}: ${render1(value.children, indent + 4)}`;
    }
    return `${acc}\n${' '.repeat(indent)}${value.option} ${value.name}: ${value.value}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};
const render2 = (data) => {
  const iter = (obj, prefix = '') => {
    const result = _.reduce(obj, (acc, value, key) => {
      if (value.option === '+') {
        const valuePlus = !value.children ? value.value : '[complex value]';
        if (obj[key + 1] && obj[key + 1].name === value.name) {
          const valueMinus = obj[key + 1].value ? obj[key + 1].value : '[complex value]';
          return `${acc}Property '${prefix}${value.name}' was updated. From '${valueMinus}' to '${valuePlus}'\n`;
        }
        return `${acc}Property '${prefix}${value.name}' was added with value: ${valuePlus}\n`;
      }
      if (value.option === '-') {
        return (obj[key - 1] && obj[key - 1].name === value.name)
          ? acc
          : `${acc}Property '${prefix}${value.name}' was removed\n`;
      }
      if (value.children) {
        return `${acc}${iter(value.children, `${prefix}${value.name}.`)}`;
      }
      return acc;
    }, '');
    return result;
  };
  return iter(data).split('\n').filter((el) => el.length > 0).join('\n');
};
const render = { usual: render1, plain: render2 };
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
const lodashReduce = _.reduce;
export { start, getFullPath, lodashReduce };
export default genDiff;
