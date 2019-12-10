import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';

const readData = (filePath) => fs.readFileSync(filePath, 'utf8');
const parsers = {
  json: (data) => JSON.parse(data),
  yml: (data) => yaml.safeLoad(data),
  ini: (data) => ini.parse(data),
};
export default (filePath) => {
  const fileType = path.extname(filePath).slice(1);
  const res = parsers[fileType](readData(filePath));
  return res;
};
