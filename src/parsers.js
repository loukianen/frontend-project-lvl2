import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const normaliseValue = (value) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(value) ? Number(value) : value);
const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: (content) => {
    const iniParsedContent = ini.parse(content);
    const iter = (data) => _.reduce(data, (acc, value, key) => {
      const newValue = _.isObject(value) ? iter(value) : normaliseValue(value);
      const newRecord = { [key]: newValue };
      return { ...acc, ...newRecord };
    }, {});
    return iter(iniParsedContent);
  },
};
const getParser = (dataType) => parsers[dataType];
export default (content, contentType) => {
  const toParse = getParser(contentType);
  const result = toParse(content);
  return result;
};
