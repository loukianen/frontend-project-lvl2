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
  const basicPartsRenderedValue = _.reduce(data, (acc, value, key) => {
    const renderedNode = `${' '.repeat(indent + 6)}${key}: ${getRenderedValue(value, level + 1)}`;
    return [...acc, renderedNode];
  }, ['{']);
  const lastPartRenderedValue = `${' '.repeat(indent + 2)}}`;
  const renderedValue = [...basicPartsRenderedValue, lastPartRenderedValue].join('\n');
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
    const basicPartsFormattedAst = data.map((node) => {
      const nodeType = node.type;
      return `${' '.repeat(indent)}${outputVariants[nodeType](node, level)}`;
    });
    const lastPartFormattedAst = `${' '.repeat(indent - 2)}}`;
    const formattedAst = ['{', ...basicPartsFormattedAst, lastPartFormattedAst].join('\n');
    return formattedAst;
  };
  return iter(nodesThree);
};
export default getFormattedAst;
