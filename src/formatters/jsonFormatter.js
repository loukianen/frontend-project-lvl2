import _ from 'lodash';

const getFormattedAst = (nodesThree) => {
  const getFormattedValueToJson = (val) => (typeof val === 'string' ? `"${val}"` : val);
  const outputVariants = {
    addedWithChildren: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
    addedWithoutChildren: (node) => `{"name":"${node.name}","newValue":${getFormattedValueToJson(node.newValue)},"type":"${node.type}"},`,
    deletedWithChildren: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
    deletedWithoutChildren: (node) => `{"name":"${node.name}","oldValue":${getFormattedValueToJson(node.oldValue)},"type":"${node.type}"},`,
    valueToChildren: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","oldValue":${getFormattedValueToJson(node.oldValue)},"type":"${node.type}"},`,
    childrenToValue: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","newValue":${getFormattedValueToJson(node.newValue)},"type":"${node.type}"},`,
    constant: (node) => {
      const value1 = getFormattedValueToJson(node.oldValue);
      const value2 = getFormattedValueToJson(node.newValue);
      return `{"name":"${node.name}","newValue":${value2},"oldValue":${value1},"type":"${node.type}"},`;
    },
    valueChanged: (node) => {
      const value1 = getFormattedValueToJson(node.oldValue);
      const value2 = getFormattedValueToJson(node.newValue);
      return `{"name":"${node.name}","newValue":${value2},"oldValue":${value1},"type":"${node.type}"},`;
    },
    childrenChanged: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
  };
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const renderedNodeList = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    const renderedNode = `${acc}${outputVariants[nodeType](node)}`;
    return `${renderedNode.split(',').filter((el) => el.length > 0).join(',')},`;
  }, '[')}`;
  return `${renderedNodeList.split(',').filter((el) => el.length > 0).join(',')}]`;
};
export default getFormattedAst;
