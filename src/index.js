import path from 'path';
import program from 'commander';
import pkg from '../package.json';
import parse from './parser';
import getDiffThree from './getDiffThree';
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
  program.option('-f, --format [type]', 'Output formats. Аvailable output types: plain, json.');
  program.arguments('<firstPath> <secondPath>');
  program.action((firstPath, secondPath, options) => {
    const res = genDiff(firstPath, secondPath, options.format);
    return res;
  });
  program.parse(process.argv);
};
export { start };
export default genDiff;
