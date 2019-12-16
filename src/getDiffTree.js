import _ from 'lodash';

const normaliseValue = (val) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(val) ? Number(val) : val);
const makeNode = (nodeName, nodeType, nodeNewValue, nodeOldValue, nodeChildren) => {
  const node = {
    name: nodeName,
    type: nodeType,
    oldValue: normaliseValue(nodeOldValue),
    newValue: normaliseValue(nodeNewValue),
    children: nodeChildren,
  };
  return node;
};
const addChildrenNodes = (data1, data2) => {
  const data = _.isObject(data1) ? data1 : data2;
  const childrenNodes = _.reduce(data, (acc, value, name) => {
    if (_.isObject(value)) {
      const nodeWithChildren = makeNode(name, 'childrenChanged', null, null, addChildrenNodes(value));
      return [...acc, nodeWithChildren];
    }
    const nodeWithoutCildren = makeNode(name, 'constant', value, value, []);
    return [...acc, nodeWithoutCildren];
  }, []);
  return childrenNodes;
};
const getDiffTree = (list1, list2) => {
  const keys = _.union(Object.keys(list2), Object.keys(list1)).sort().reverse();
  const diffTree = keys.reduce((tree, key) => {
    const value1 = list1[key];
    const value2 = list2[key];
    if (value1 === value2) return [...tree, makeNode(key, 'constant', value1, value2, [])];
    if (_.isObject(value1) && _.isObject(value2)) {
      return [...tree, makeNode(key, 'childrenChanged', null, null, getDiffTree(value1, value2))];
    }
    if (_.isObject(value1) && !_.isObject(value2)) {
      return value2
        ? [...tree, makeNode(key, 'childrenToValue', value2, null, addChildrenNodes(value1))]
        : [...tree, makeNode(key, 'deletedWithChildren', null, null, addChildrenNodes(value1))];
    }
    if (!_.isObject(value1) && _.isObject(value2)) {
      return value1
        ? [...tree, makeNode(key, 'valueToChildren', null, value1, addChildrenNodes(value2))]
        : [...tree, makeNode(key, 'addedWithChildren', null, null, addChildrenNodes(value2))];
    }
    if (_.has(list1, key) && !_.has(list2, key)) return [...tree, makeNode(key, 'deletedWithoutChildren', null, value1, [])];
    if (!_.has(list1, key) && _.has(list2, key)) return [...tree, makeNode(key, 'addedWithoutChildren', value2, null, [])];
    return [...tree, makeNode(key, 'valueChanged', value2, value1, [])];
  }, []);
  return diffTree;
};
export default getDiffTree;
