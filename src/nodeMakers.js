// import _ from 'lodash';
import { getDiffThree, addStructure } from '.';

const nodeMakers = {
  addedWithChildren: (values) => {
    const [, value2] = values;
    const node = {};
    node.type = 'addedWithChildren';
    node.children = addStructure(value2);
    return node;
  },
  addedWithoutChildren: (values) => {
    const [, value2] = values;
    const node = {};
    node.type = 'addedWithoutChildren';
    node.newValue = value2;
    return node;
  },
  deletedWithChildren: (values) => {
    const [value1] = values;
    const node = {};
    node.type = 'deletedWithChildren';
    node.children = addStructure(value1);
    return node;
  },
  deletedWithoutChildren: (values) => {
    const [value1] = values;
    const node = {};
    node.type = 'deletedWithoutChildren';
    node.oldValue = value1;
    return node;
  },
  valueToChildren: (values) => {
    const [value1, value2] = values;
    const node = {};
    node.type = 'valueToChildren';
    node.oldValue = value1;
    node.children = addStructure(value2);
    return node;
  },
  childrenToValue: (values) => {
    const [value1, value2] = values;
    const node = {};
    node.type = 'childrenToValue';
    node.newValue = value2;
    node.children = addStructure(value1);
    return node;
  },
  constant: (values) => {
    const [value1, value2] = values;
    const node = {};
    node.type = 'constant';
    node.newValue = value2;
    node.oldValue = value1;
    return node;
  },
  valueChanged: (values) => {
    const [value1, value2] = values;
    const node = {};
    node.type = 'valueChanged';
    node.newValue = value2;
    node.oldValue = value1;
    return node;
  },
  childrenChanged: (values) => {
    const [value1, value2] = values;
    const node = {};
    node.type = 'childrenChanged';
    node.children = getDiffThree(value1, value2);
    return node;
  },
};
export default nodeMakers;
