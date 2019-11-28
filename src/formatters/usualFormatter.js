import _ from 'lodash';

const render = (obj, indent = 2) => {
  const result = `${_.reduce(obj, (acc, value) => {
    if (value.children) {
      return `${acc}\n${' '.repeat(indent)}${value.option} ${value.name}: ${render(value.children, indent + 4)}`;
    }
    return `${acc}\n${' '.repeat(indent)}${value.option} ${value.name}: ${value.value}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};

export default render;
