import yaml from 'js-yaml';
import ini from 'ini';

const getParser = (dataType) => {
  const parsers = {
    json: JSON.parse,
    yml: yaml.safeLoad,
    ini: ini.parse,
  };
  return parsers[dataType];
};
export default (content, contentType) => {
  const parser = getParser(contentType);
  const res = parser(content);
  return res;
};
