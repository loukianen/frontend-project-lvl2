import _ from 'lodash';

const render = (data) => {
  const iter = (obj, prefix = '') => {
    const result = _.reduce(obj, (acc, value, key) => {
      if (value.option === '+') {
        const valuePlus = !value.children ? value.value : '[complex value]';
        if (obj[key + 1] && obj[key + 1].name === value.name) {
          const valueMinus = obj[key + 1].value ? obj[key + 1].value : '[complex value]';
          return `${acc}Property '${prefix}${value.name}' was updated. From '${valueMinus}' to '${valuePlus}'\n`;
        }
        return `${acc}Property '${prefix}${value.name}' was added with value: ${valuePlus}\n`;
      }
      if (value.option === '-') {
        return (obj[key - 1] && obj[key - 1].name === value.name)
          ? acc
          : `${acc}Property '${prefix}${value.name}' was removed\n`;
      }
      if (value.children) {
        return `${acc}${iter(value.children, `${prefix}${value.name}.`)}`;
      }
      return acc;
    }, '');
    return result;
  };
  return iter(data).split('\n').filter((el) => el.length > 0).join('\n');
};
export default render;
