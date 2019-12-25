import fs from 'fs';
import path from 'path';
import getData from './parsers';
import getDiffTree from './getDiffTree';
import getFormattedDiff from './formatters';

const readData = (filePath) => fs.readFileSync(filePath, 'utf8');
const genDiff = (path1, path2, format = 'usual') => {
  const content1 = readData(path1);
  const content2 = readData(path2);
  const contentType1 = path.extname(path1).slice(1);
  const contentType2 = path.extname(path2).slice(1);
  const data1 = getData(content1, contentType1);
  const data2 = getData(content2, contentType2);
  const diff = getDiffTree(data1, data2);
  const res = getFormattedDiff(diff, format);
  // console.log(res);
  return res;
};

export default genDiff;
