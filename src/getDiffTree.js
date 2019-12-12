import _ from 'lodash';
import getNewNodePropertys from './nodeMakerData';
import getNodeType from './getNodeType';

const normaliseValue = (val) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(val) ? Number(val) : val);
const addChildrenNodes = (data1, data2) => {
  const data = _.isObject(data1) ? data1 : data2;
  const childrenNodes = _.reduce(data, (acc, value, name) => {
    if (_.isObject(value)) {
      const nodeWithChildren = { name, type: 'childrenChanged', children: addChildrenNodes(value) };
      return [...acc, nodeWithChildren];
    }
    const curValue = normaliseValue(value);
    const nodeWithoutCildren = {
      name,
      type: 'constant',
      oldValue: curValue,
      newValue: curValue,
    };
    return [...acc, nodeWithoutCildren];
  }, []);
  return childrenNodes;
};
const getDiffTree = (list1, list2) => {
  const keys = _.union(Object.keys(list2), Object.keys(list1)).sort();
  const diffTree = keys.reduce((tree, key) => {
    const value1 = list1[key];
    const value2 = list2[key];
    const nodeType = getNodeType([list1, list2, key]);
    const newNodePropertys = getNewNodePropertys(nodeType);
    const childrenFunc = nodeType === 'childrenChanged' ? getDiffTree : addChildrenNodes;
    const newNode = newNodePropertys.reduce((acc, property) => {
      const nodeGauge = {
        name: key,
        type: nodeType,
        oldValue: normaliseValue(value1),
        newValue: normaliseValue(value2),
        children: childrenFunc,
      };
      const newValue = nodeGauge[property];
      acc[property] = typeof newValue === 'function' ? newValue(value1, value2) : newValue;
      return acc;
    }, {});
    const newTree = [newNode, ...tree];
    return newTree;
  }, []);
  return diffTree;
};
export default getDiffTree;
