import _ from 'lodash';

const getFormattedAst = (nodesThree, indent = 2) => {
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const result = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}\n${' '.repeat(indent)}${outputVariants[nodeType](node, indent)}`;
  }, '{')}\n${' '.repeat(indent - 2)}}`;
  return result;
};
const outputVariants = {
  addedWithChildren: (node, indent) => `+ ${node.name}: ${getFormattedAst(node.children, indent + 4)}`,
  addedWithoutChildren: (node) => `+ ${node.name}: ${node.newValue}`,
  deletedWithChildren: (node, indent) => `- ${node.name}: ${getFormattedAst(node.children, indent + 4)}`,
  deletedWithoutChildren: (node) => `- ${node.name}: ${node.oldValue}`,
  valueToChildren: (node, indent) => `+ ${node.name}: ${getFormattedAst(node.children, indent + 4)}\n${' '.repeat(indent)}- ${node.name}: ${node.oldValue}`,
  childrenToValue: (node, indent) => `+ ${node.name}: ${node.newValue}\n${' '.repeat(indent)}- ${node.name}: ${getFormattedAst(node.children, indent + 4)}`,
  constant: (node) => `  ${node.name}: ${node.newValue}`,
  valueChanged: (node, indent) => `+ ${node.name}: ${node.newValue}\n${' '.repeat(indent)}- ${node.name}: ${node.oldValue}`,
  childrenChanged: (node, indent) => `  ${node.name}: ${getFormattedAst(node.children, indent + 4)}`,
};


export default getFormattedAst;
