import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';
import path from 'path';

const readData = (filePath) => fs.readFileSync(filePath, 'utf8');
const getParser = (fileType) => {
  const parsers = {
    json: JSON.parse,
    yml: yaml.safeLoad,
    ini: ini.parse,
  };
  return parsers[fileType];
};
export default (filePath) => {
  const fileType = path.extname(filePath).slice(1);
  const parser = getParser(fileType);
  const data = parser(readData(filePath));
  return data;
};
