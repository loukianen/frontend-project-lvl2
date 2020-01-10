import _ from 'lodash';

const getIndent = (level) => {
  const startIndent = 2;
  const levelIndent = level * 4;
  const indent = startIndent + levelIndent;
  return indent;
};
const getRenderedValue = (data, level) => {
  if (!_.isObject(data)) {
    return data;
  }
  const indent = getIndent(level);
  const basicPartRenderedValue = _.reduce(data, (acc, value, key) => {
    const renderedNode = `${acc}${' '.repeat(indent + 6)}${key}: ${getRenderedValue(value, level + 1)}\n`;
    return renderedNode;
  }, '{\n');
  const lastPartRenderedValue = `${' '.repeat(indent + 2)}}`;
  const renderedValue = `${basicPartRenderedValue}${lastPartRenderedValue}`;
  return renderedValue;
};
const getFormattedAst = (nodesThree) => {
  const iter = (data, level = 0) => {
    const indent = getIndent(level);
    const outputVariants = {
      added: (node, levelInside) => `+ ${node.name}: ${getRenderedValue(node.value, levelInside)}`,
      deleted: (node, levelInside) => `- ${node.name}: ${getRenderedValue(node.value, levelInside)}`,
      unchanged: (node) => `  ${node.name}: ${node.value}`,
      changed: (node, levelInside) => {
        const indentInside = getIndent(levelInside);
        const firstPart = `+ ${node.name}: ${getRenderedValue(node.newValue, levelInside)}\n`;
        const secondPart = `${' '.repeat(indentInside)}- ${node.name}: ${getRenderedValue(node.oldValue, levelInside)}`;
        return `${firstPart}${secondPart}`;
      },
      nested: (node, levelInside) => `  ${node.name}: ${iter(node.children, levelInside + 1)}`,
    };
    const basicPartFormattedAst = data.reduce((acc, node) => {
      const nodeType = node.type;
      return `${acc}${' '.repeat(indent)}${outputVariants[nodeType](node, level)}\n`;
    }, '{\n');
    const lastPartFormattedAst = `${' '.repeat(indent - 2)}}`;
    const formattedAst = `${basicPartFormattedAst}${lastPartFormattedAst}`;
    return formattedAst;
  };
  return iter(nodesThree);
};
export default getFormattedAst;
