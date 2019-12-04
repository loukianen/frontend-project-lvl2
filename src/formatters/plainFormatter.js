import _ from 'lodash';

const getFormattedAst = (nodesThree, prefix = '') => {
  const outputVariants = {
    addedWithChildren: (node, prefixInside) => `Property '${prefixInside}${node.name}' was added with value: [complex value]\n`,
    addedWithoutChildren: (node, prefixInside) => {
      const value = typeof node.newValue === 'string' ? `'${node.newValue}'` : node.newValue;
      return `Property '${prefixInside}${node.name}' was added with value: ${value}\n`;
    },
    deletedWithChildren: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed\n`,
    deletedWithoutChildren: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed\n`,
    valueToChildren: (node, prefixInside) => `Property '${prefixInside}${node.name}' was updated. From '${node.oldValue}' to '[complex value]'\n`,
    childrenToValue: (node, prefixInside) => `Property '${prefixInside}${node.name}' was updated. From '[complex value]' to '${node.newValue}'\n`,
    constant: () => '',
    valueChanged: (node, prefixInside) => `Property '${prefixInside}${node.name}' was updated. From '${node.oldValue}' to '${node.newValue}'\n`,
    childrenChanged: (node, prefixInside) => `${getFormattedAst(node.children, `${prefixInside}${node.name}.`)}`,
  };
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const result = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}${outputVariants[nodeType](node, prefix)}\n`;
  }, '')}`.split('\n').filter((el) => el.length > 0).join('\n');
  return result;
};


export default getFormattedAst;
