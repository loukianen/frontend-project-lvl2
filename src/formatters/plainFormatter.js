import _ from 'lodash';

const addQuotesToStringValue = (data) => (typeof data === 'string' ? `'${data}'` : data);
const getChangedNodeText = (node, prefixInside) => {
  const getValue = (value) => (_.isObject(value) ? "'[complex value]'" : `${addQuotesToStringValue(value)}`);
  const propertyName = `${prefixInside}${node.name}`;
  const oldValue = getValue(node.oldValue);
  const newValue = getValue(node.newValue);
  return `Property '${propertyName}' was updated. From ${oldValue} to ${newValue}`;
};
const getAddedNodeText = (node, prefixInside) => {
  const propertyName = `${prefixInside}${node.name}`;
  const value = _.isObject(node.value) ? '[complex value]' : `${addQuotesToStringValue(node.value)}`;
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
    const formattedAst = renderedNodes
      .filter((renderedNode) => !(_.isNull(renderedNode) || renderedNode.length === 0))
      .join('\n');
    return formattedAst;
  };
  return iter(nodesThree);
};

export default getFormattedAst;
