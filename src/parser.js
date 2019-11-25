import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';

export default (filePath) => {
  const parsers = {
    json: (file) => JSON.parse(fs.readFileSync(file, 'utf8')),
    yml: (file) => yaml.safeLoad(fs.readFileSync(file, 'utf8')),
  };
  const type = path.extname(filePath).slice(1);
  return parsers[type](filePath);
};
