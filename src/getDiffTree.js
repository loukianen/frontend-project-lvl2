import _ from 'lodash';

const getDiffTree = (list1, list2) => {
  const keys = _.union(Object.keys(list2), Object.keys(list1)).sort().reverse();
  const diffTree = keys.map((key) => {
    if (_.has(list1, key) && !_.has(list2, key)) {
      return { name: key, type: 'deleted', value: list1[key] };
    }
    if (!_.has(list1, key) && _.has(list2, key)) {
      return { name: key, type: 'added', value: list2[key] };
    }
    if (_.isObject(list1[key]) && _.isObject(list2[key])) {
      return { name: key, type: 'nested', children: getDiffTree(list1[key], list2[key]) };
    }
    if (list1[key] === list2[key]) {
      return { name: key, type: 'unchanged', value: list1[key] };
    }
    return {
      name: key,
      type: 'changed',
      oldValue: list1[key],
      newValue: list2[key],
    };
  });
  const sortedDiffTree = _.sortBy(diffTree, (node) => node.name);
  // console.log(sortedDiffTree);
  return sortedDiffTree;
};
export default getDiffTree;
