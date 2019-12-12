import getData from './parsers';
import getDiffTree from './getDiffTree';
import getFormattedDiff from './formatters';

const genDiff = (path1, path2, format = 'usual') => {
  const data1 = getData(path1);
  const data2 = getData(path2);
  const diff = getDiffTree(data1, data2);
  const res = getFormattedDiff(diff, format);
  console.log(res);
  return res;
};

export default genDiff;
