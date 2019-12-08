import getData from './parsers';
import getDiffThree from './getDiffThree';
import renders from './formatters';

const genDiff = (path1, path2, format = 'usual') => {
  const data = getData([path1, path2]);
  const diff = getDiffThree(data);
  const res = renders[format](diff);
  // console.log(res);
  return res;
};

export default genDiff;
