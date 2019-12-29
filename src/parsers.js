import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

// const normaliseValue=(value) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(value) ? Number(value) : value);
const normaliseValue = (value) => {
  if (_.isString(value)) {
    return _.isNaN(Number(value)) ? value : Number(value);
  }
  return (value);
};
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
  const parse = getParser(contentType);
  const result = parse(content);
  return result;
};
