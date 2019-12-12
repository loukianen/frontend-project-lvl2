import _ from 'lodash';

const nodeTypeParams = {
  addedWithChildren: {
    list1HasKey: false,
    list2HasKey: true,
    value1IsObject: false,
    value2IsObject: true,
    valuesEqual: false,
  },
  addedWithoutChildren: {
    list1HasKey: false,
    list2HasKey: true,
    value1IsObject: false,
    value2IsObject: false,
    valuesEqual: false,
  },
  deletedWithChildren: {
    list1HasKey: true,
    list2HasKey: false,
    value1IsObject: true,
    value2IsObject: false,
    valuesEqual: false,
  },
  deletedWithoutChildren: {
    list1HasKey: true,
    list2HasKey: false,
    value1IsObject: false,
    value2IsObject: false,
    valuesEqual: false,
  },
  valueToChildren: {
    list1HasKey: true,
    list2HasKey: true,
    value1IsObject: false,
    value2IsObject: true,
    valuesEqual: false,
  },
  childrenToValue: {
    list1HasKey: true,
    list2HasKey: true,
    value1IsObject: true,
    value2IsObject: false,
    valuesEqual: false,
  },
  constant: {
    list1HasKey: true,
    list2HasKey: true,
    value1IsObject: false,
    value2IsObject: false,
    valuesEqual: true,
  },
  valueChanged: {
    list1HasKey: true,
    list2HasKey: true,
    value1IsObject: false,
    value2IsObject: false,
    valuesEqual: false,
  },
  childrenChanged: {
    list1HasKey: true,
    list2HasKey: true,
    value1IsObject: true,
    value2IsObject: true,
    valuesEqual: false,
  },
};
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
