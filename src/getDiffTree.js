import _ from 'lodash';
import getNewNodePropertys from './nodeMakerData';
import getNodeType from './getNodeType';

const normaliseValue = (val) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(val) ? Number(val) : val);
const addChildrenNodes = (data1, data2) => {
  const data = _.isObject(data1) ? data1 : data2;
  const childrenNodes = _.reduce(data, (acc, value, name) => {
    const nodeType = _.isObject(value) ? 'childrenChanged' : 'constant';
    const curValue = normaliseValue(value);
    const newNode = nodeType === 'constant'
      ? {
        name,
        type: nodeType,
        oldValue: curValue,
        newValue: curValue,
      }
      : { name, type: nodeType, children: addChildrenNodes(value) };
    return [...acc, newNode];
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
    const newNode = newNodePropertys.reduce((acc, property) => {
      const childrenFunc = nodeType === 'childrenChanged' ? getDiffTree : addChildrenNodes;
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
