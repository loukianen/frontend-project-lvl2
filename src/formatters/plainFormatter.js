import _ from 'lodash';

const addQuotesToStringValue = (data) => (typeof data === 'string' ? `'${data}'` : data);
const getFormattedAst = (nodesThree, prefix = '') => {
  const outputVariants = {
    added: (node, prefixInside) => (_.isObject(node.value)
      ? `Property '${prefixInside}${node.name}' was added with value: [complex value]\n`
      : `Property '${prefixInside}${node.name}' was added with value: ${addQuotesToStringValue(node.value)}\n`),
    deleted: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed\n`,
    unchanged: () => '',
    changed: (node, prefixInside) => {
      const oldValue = node.value.old;
      const newValue = node.value.new;
      const dataType = `${_.isObject(oldValue)}${_.isObject(newValue)}`;
      const outputs = {
        truefalse: `Property '${prefixInside}${node.name}' was updated. From '[complex value]' to ${addQuotesToStringValue(newValue)}\n`,
        falsetrue: `Property '${prefixInside}${node.name}' was updated. From ${addQuotesToStringValue(oldValue)} to '[complex value]'\n`,
        falsefalse: `Property '${prefixInside}${node.name}' was updated. From ${addQuotesToStringValue(oldValue)} to ${addQuotesToStringValue(newValue)}\n`,
      };
      return outputs[dataType];
    },
    bothValuesAreObjects: (node, prefixInside) => `${getFormattedAst(node.children, `${prefixInside}${node.name}.`)}`,
  };
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  return `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    return `${acc}${outputVariants[nodeType](node, prefix)}\n`;
  }, '')}`.split('\n').filter((el) => el.length > 0).join('\n');
};

export default getFormattedAst;
