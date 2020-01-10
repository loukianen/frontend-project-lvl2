import _ from 'lodash';

const deleteEmptyString = (text) => text
  .split('\n')
  .filter((el) => el.length > 0)
  .join('\n');
const addQuotesToStringValue = (data) => (typeof data === 'string' ? `'${data}'` : data);
const getChangedNodeText = (node, prefixInside) => {
  const propertyName = `${prefixInside}${node.name}`;
  const oldValue = `${addQuotesToStringValue(node.oldValue)}`;
  const newValue = `${addQuotesToStringValue(node.newValue)}`;
  const getText = (name, valueFrom, valueTo) => `Property '${name}' was updated. From ${valueFrom} to ${valueTo}`;
  if (_.isObject(node.oldValue)) {
    return getText(propertyName, "'[complex value]'", newValue);
  }
  if (_.isObject(node.newValue)) {
    return getText(propertyName, oldValue, "'[complex value]'");
  }
  return getText(propertyName, oldValue, newValue);
};
const getAddedNodeText = (node, prefixInside) => {
  const propertyName = `${prefixInside}${node.name}`;
  const value = `${addQuotesToStringValue(node.value)}`;
  const getText = (name, text) => `Property '${name}' was added with value: ${text}`;
  return _.isObject(node.value) ? getText(propertyName, '[complex value]') : getText(propertyName, value);
};
const getFormattedAst = (nodesThree) => {
  const iter = (data, prefix = '') => {
    const outputVariants = {
      added: getAddedNodeText,
      deleted: (node, prefixInside) => `Property '${prefixInside}${node.name}' was removed`,
      changed: getChangedNodeText,
      nested: (node, prefixInside) => `${iter(node.children, `${prefixInside}${node.name}.`)}`,
    };
    const formattedAst = data.reduce((acc, node) => {
      const nodeType = node.type;
      return nodeType === 'unchanged' ? acc : `${acc}${outputVariants[nodeType](node, prefix)}\n`;
    }, '');
    return deleteEmptyString(formattedAst);
  };
  return iter(nodesThree);
};

export default getFormattedAst;
