import _ from 'lodash';

const getRenderedValue = (data, indentInside) => {
  const renderedValue = _.isObject(data)
    ? `${_.reduce(data, (acc, value, key) => `${acc}${' '.repeat(indentInside + 6)}${key}: ${getRenderedValue(value, indentInside + 4)}\n`, '{\n')}${' '.repeat(indentInside + 2)}}`
    : data;
  return renderedValue;
};
const getFormattedAst = (nodesThree, indent = 2) => {
  const outputVariants = {
    added: (node, indentInside) => `+ ${node.name}: ${getRenderedValue(node.value, indentInside)}`,
    deleted: (node, indentInside) => `- ${node.name}: ${getRenderedValue(node.value, indentInside)}`,
    unchanged: (node) => `  ${node.name}: ${node.value}`,
    changed: (node, indentInside) => `+ ${node.name}: ${getRenderedValue(node.value.new, indentInside)}\n${' '.repeat(indentInside)}- ${node.name}: ${getRenderedValue(node.value.old, indentInside)}`,
    bothValuesAreObjects: (node, indentInside) => `  ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}`,
  };
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const result = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}\n${' '.repeat(indent)}${outputVariants[nodeType](node, indent)}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};
export default getFormattedAst;
