import path from 'path';
import parsers from './parsers';

export default (filesPath) => {
  const res = filesPath.map((filePath) => {
    const fileType = path.extname(filePath).slice(1);
    return parsers[fileType](filePath);
  });
  return res;
};
