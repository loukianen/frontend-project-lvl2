const nodeMakeParams = {
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
export default nodeMakeParams;
