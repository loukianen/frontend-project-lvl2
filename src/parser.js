import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import fs from 'fs';

export default (filePath) => {
  const parsers = {
    json: (fullFilePath) => JSON.parse(fs.readFileSync(fullFilePath, 'utf8')),
    yml: (fullFilePath) => yaml.safeLoad(fs.readFileSync(fullFilePath, 'utf8')),
    ini: (fullFilePath) => ini.parse(fs.readFileSync(fullFilePath, 'utf-8')),
  };
  const fileType = path.extname(filePath).slice(1);
  return parsers[fileType](filePath);
};
