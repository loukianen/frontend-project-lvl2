import _ from 'lodash';

const getRenderedValue = (data, indentInside) => {
  if (_.isObject(data)) {
    const firstPartRenderedValue = ['{'];
    const basicPartsRenderedValue = _.reduce(data, (acc, value, key) => {
      const part = `${' '.repeat(indentInside + 6)}${key}: ${getRenderedValue(value, indentInside + 4)}`;
      return [...acc, part];
    }, firstPartRenderedValue);
    const lastPartRenderedValue = `${' '.repeat(indentInside + 2)}}`;
    const partsRenderedValue = [...basicPartsRenderedValue, lastPartRenderedValue];
    const renderedValue = partsRenderedValue.join('\n');
    return renderedValue;
  }
  return data;
};
const getFormattedAst = (nodesThree) => {
  const iter = (data, indent = 2) => {
    const outputVariants = {
      added: (node, indentInside) => `+ ${node.name}: ${getRenderedValue(node.value, indentInside)}`,
      deleted: (node, indentInside) => `- ${node.name}: ${getRenderedValue(node.value, indentInside)}`,
      unchanged: (node) => `  ${node.name}: ${node.value}`,
      changed: (node, indentInside) => {
        const firstPart = [`+ ${node.name}: ${getRenderedValue(node.newValue, indentInside)}`];
        const secondPart = [`${' '.repeat(indentInside)}- ${node.name}: ${getRenderedValue(node.oldValue, indentInside)}`];
        return [...firstPart, ...secondPart].join('\n');
      },
      nested: (node, indentInside) => `  ${node.name}: ${iter(node.children, indentInside + 4)}`,
    };
    const sortedThree = _.sortBy(data, (node) => node.name);
    const firstPartFormattedAst = ['{'];
    const basicPartsFormattedAst = sortedThree.map((node) => {
      const nodeType = node.type;
      return `${' '.repeat(indent)}${outputVariants[nodeType](node, indent)}`;
    });
    const lastPartFormattedAst = `${' '.repeat(indent - 2)}}`;
    const parts = [firstPartFormattedAst, ...basicPartsFormattedAst, lastPartFormattedAst];
    const formattedAst = parts.join('\n');
    return formattedAst;
  };
  return iter(nodesThree);
};
export default getFormattedAst;
