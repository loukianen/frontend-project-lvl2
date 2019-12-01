import _ from 'lodash';

const getFormattedAst = (nodesThree) => {
  const sortedThree = _.sortBy(nodesThree, (node) => node.name);
  const renderedNodeList = `${_.reduce(sortedThree, (acc, node) => {
    const nodeType = node.type;
    const renderedNode = `${acc}${outputVariants[nodeType](node)}`;
    return `${renderedNode.split(',').filter((el) => el.length > 0).join(',')},`;
  }, '[')}`;
  return `${renderedNodeList.split(',').filter((el) => el.length > 0).join(',')}]`;
};
const outputVariants = {
  addedWithChildren: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
  addedWithoutChildren: (node) => {
    const value = typeof node.newValue === 'string' ? `"${node.newValue}"` : node.newValue;
    return `{"name":"${node.name}","newValue":${value},"type":"${node.type}"},`;
  },
  deletedWithChildren: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
  deletedWithoutChildren: (node) => {
    const value = typeof node.oldValue === 'string' ? `"${node.oldValue}"` : node.oldValue;
    return `{"name":"${node.name}","oldValue":${value},"type":"${node.type}"},`;
  },
  valueToChildren: (node) => {
    const value = typeof node.oldValue === 'string' ? `"${node.oldValue}"` : node.oldValue;
    return `{"children":${getFormattedAst(node.children)},"name":"${node.name}","oldValue":${value},"type":"${node.type}"},`;
  },
  childrenToValue: (node) => {
    const value = typeof node.newValue === 'string' ? `"${node.newValue}"` : node.newValue;
    return `{"children":${getFormattedAst(node.children)},"name":"${node.name}","newValue":${value},"type":"${node.type}"},`;
  },
  constant: (node) => {
    const value1 = typeof node.oldValue === 'string' ? `"${node.oldValue}"` : node.oldValue;
    const value2 = typeof node.newValue === 'string' ? `"${node.newValue}"` : node.newValue;
    return `{"name":"${node.name}","newValue":${value2},"oldValue":${value1},"type":"${node.type}"},`;
  },
  valueChanged: (node) => {
    const value1 = typeof node.oldValue === 'string' ? `"${node.oldValue}"` : node.oldValue;
    const value2 = typeof node.newValue === 'string' ? `"${node.newValue}"` : node.newValue;
    return `{"name":"${node.name}","newValue":${value2},"oldValue":${value1},"type":"${node.type}"},`;
  },
  childrenChanged: (node) => `{"children":${getFormattedAst(node.children)},"name":"${node.name}","type":"${node.type}"},`,
};

export default getFormattedAst;
