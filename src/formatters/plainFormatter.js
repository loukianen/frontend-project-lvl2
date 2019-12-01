import _ from 'lodash';

const getFormattedAst = (nodesThree, prefix = '') => {
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const result = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}${outputVariants[nodeType](node, prefix)}\n`;
  }, '')}`.split('\n').filter((el) => el.length > 0).join('\n');
  return result;
};
const outputVariants = {
  addedWithChildren: (node, prefix) => `Property '${prefix}${node.name}' was added with value: [complex value]\n`,
  addedWithoutChildren: (node, prefix) => {
    const value = typeof node.newValue === 'string' ? `'${node.newValue}'` : node.newValue;
    return `Property '${prefix}${node.name}' was added with value: ${value}\n`;
  },
  deletedWithChildren: (node, prefix) => `Property '${prefix}${node.name}' was removed\n`,
  deletedWithoutChildren: (node, prefix) => `Property '${prefix}${node.name}' was removed\n`,
  valueToChildren: (node, prefix) => `Property '${prefix}${node.name}' was updated. From '${node.oldValue}' to '[complex value]'\n`,
  childrenToValue: (node, prefix) => `Property '${prefix}${node.name}' was updated. From '[complex value]' to '${node.newValue}'\n`,
  constant: () => '',
  valueChanged: (node, prefix) => `Property '${prefix}${node.name}' was updated. From '${node.oldValue}' to '${node.newValue}'\n`,
  childrenChanged: (node, prefix) => `${getFormattedAst(node.children, `${prefix}${node.name}.`)}`,
};

export default getFormattedAst;
