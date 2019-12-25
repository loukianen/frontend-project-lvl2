import _ from 'lodash';

const getNode = (conditions, key, value1, value2) => {
  const nodeTypes = {
    true_false_false: { name: key, type: 'deleted', value: value1 },
    false_true_false: { name: key, type: 'added', value: value2 },
    true_true_true: { name: key, type: 'unchanged', value: value1 },
    true_true_false: { name: key, type: 'changed', value: { old: value1, new: value2 } },
  };
  return nodeTypes[conditions];
};
const getDiffTree = (list1, list2) => {
  const keys = _.union(Object.keys(list2), Object.keys(list1)).sort().reverse();
  const diffTree = keys.map((key) => {
    const conditionsCheckResult = `${_.has(list1, key)}_${_.has(list2, key)}_${list1[key] === list2[key]}`;
    const newNode = _.isObject(list1[key]) && _.isObject(list2[key])
      ? { name: key, type: 'bothValuesAreObjects', children: getDiffTree(list1[key], list2[key]) }
      : getNode(conditionsCheckResult, key, list1[key], list2[key]);
    return newNode;
  });
  return diffTree;
};
export default getDiffTree;
