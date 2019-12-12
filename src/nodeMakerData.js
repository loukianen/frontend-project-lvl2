const nodeMakerData = {
  addedWithChildren: ['name', 'type', 'children'],
  addedWithoutChildren: ['name', 'type', 'newValue'],
  deletedWithChildren: ['name', 'type', 'children'],
  deletedWithoutChildren: ['name', 'type', 'oldValue'],
  valueToChildren: ['name', 'type', 'oldValue', 'children'],
  childrenToValue: ['name', 'type', 'newValue', 'children'],
  constant: ['name', 'type', 'oldValue', 'newValue'],
  valueChanged: ['name', 'type', 'oldValue', 'newValue'],
  childrenChanged: ['name', 'type', 'children'],
};
export default (nodeName) => nodeMakerData[nodeName];
