import _ from 'lodash';

const getFormattedAst = (nodesThree, indent = 2) => {
  const outputVariants = {
    addedWithChildren: (node, indentInside) => `+ ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}`,
    addedWithoutChildren: (node) => `+ ${node.name}: ${node.newValue}`,
    deletedWithChildren: (node, indentInside) => `- ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}`,
    deletedWithoutChildren: (node) => `- ${node.name}: ${node.oldValue}`,
    valueToChildren: (node, indentInside) => `+ ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}\n${' '.repeat(indentInside)}- ${node.name}: ${node.oldValue}`,
    childrenToValue: (node, indentInside) => `+ ${node.name}: ${node.newValue}\n${' '.repeat(indentInside)}- ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}`,
    constant: (node) => `  ${node.name}: ${node.newValue}`,
    valueChanged: (node, indentInside) => `+ ${node.name}: ${node.newValue}\n${' '.repeat(indentInside)}- ${node.name}: ${node.oldValue}`,
    childrenChanged: (node, indentInside) => `  ${node.name}: ${getFormattedAst(node.children, indentInside + 4)}`,
  };
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const result = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}\n${' '.repeat(indent)}${outputVariants[nodeType](node, indent)}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};
export default getFormattedAst;
