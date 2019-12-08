import _ from 'lodash';
import nodeTypeParams from './nodeTypeParams';

export default (data) => {
  const [list1, list2, key] = data;
  const currentParams = {
    list1HasKey: _.has(list1, key),
    list2HasKey: _.has(list2, key),
    value1IsObject: _.isObject(list1[key]),
    value2IsObject: _.isObject(list2[key]),
    valuesEqual: list1[key] === list2[key],
  };
  const res = _.findKey(nodeTypeParams, (nodeParams) => _.isEqual(nodeParams, currentParams));
  return res;
};
