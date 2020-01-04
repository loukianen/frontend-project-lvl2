import _ from 'lodash';

const addQuotesToStringValue = (data) => (typeof data === 'string' ? `'${data}'` : data);
const getFormattedAst = (nodesThree) => {
  const iter = (data, prefix = '') => {
    const outputVariants = {
      added: (node, prefixInside) => (_.isObject(node.value)
        ? `Property '${prefixInside}${node.name}' was added with value: [complex value]`
        : `Property '${prefixInside}${node.name}' was added with value: ${addQuotesToStringValue(node.value)}`),
      deleted: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed`,
      unchanged: () => '',
      changed: (node, prefixInside) => {
        if (_.isObject(node.oldValue)) {
          return `Property '${prefixInside}${node.name}' was updated. From '[complex value]' to ${addQuotesToStringValue(node.newValue)}`;
        }
        if (_.isObject(node.newValue)) {
          return `Property '${prefixInside}${node.name}' was updated. From ${addQuotesToStringValue(node.oldValue)} to '[complex value]'`;
        }
        return `Property '${prefixInside}${node.name}' was updated. From ${addQuotesToStringValue(node.oldValue)} to ${addQuotesToStringValue(node.newValue)}`;
      },
      nested: (node, prefixInside) => `${iter(node.children, `${prefixInside}${node.name}.`)}`,
    };
    const sortedThree = _.sortBy(data, (node) => node.name);
    const partsFormattedAst = sortedThree.map((node) => {
      const nodeType = node.type;
      return `${outputVariants[nodeType](node, prefix)}`;
    });
    const formattedAst = partsFormattedAst.filter((el) => el.length > 0).join('\n');
    return formattedAst;
  };
  return iter(nodesThree);
};

export default getFormattedAst;
