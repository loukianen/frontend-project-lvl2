import _ from 'lodash';

const addQuotesToStringValue = (data) => (typeof data === 'string' ? `'${data}'` : data);
const stringify = (value) => (_.isObject(value) ? '[complex value]' : `${addQuotesToStringValue(value)}`);
const getChangedNodeText = (node, prefixInside) => {
  const propertyName = `${prefixInside}${node.name}`;
  const oldValue = stringify(node.oldValue);
  const newValue = stringify(node.newValue);
  return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
};
const getAddedNodeText = (node, prefixInside) => {
  const propertyName = `${prefixInside}${node.name}`;
  const value = stringify(node.value);
  return `Property '${propertyName}' was added with value: ${value}`;
};
const getFormattedAst = (nodesThree) => {
  const iter = (data, prefix = '') => {
    const outputVariants = {
      added: getAddedNodeText,
      deleted: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed`,
      changed: getChangedNodeText,
      unchanged: () => null,
      nested: (node, prefixInside) => `${iter(node.children, `${prefixInside}${node.name}.`)}`,
    };
    const renderedNodes = data.map((node) => {
      const nodeType = node.type;
      return outputVariants[nodeType](node, prefix);
    });
    const formattedAst = _.compact(renderedNodes).join('\n');
    return formattedAst;
  };
  return iter(nodesThree);
};

export default getFormattedAst;
