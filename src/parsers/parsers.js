import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';

const parsers = {
  json: (fullFilePath) => JSON.parse(fs.readFileSync(fullFilePath, 'utf8')),
  yml: (fullFilePath) => yaml.safeLoad(fs.readFileSync(fullFilePath, 'utf8')),
  ini: (fullFilePath) => ini.parse(fs.readFileSync(fullFilePath, 'utf-8')),
};
export default parsers;
