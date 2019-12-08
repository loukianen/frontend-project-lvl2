import _ from 'lodash';
import nodeMakerData from './nodeMakerData';
import getNodeType from './getNodeType';

const normaliseData = ([dataIn1, dataIn2]) => {
  const normalisedData = _.isObject(dataIn1) ? [dataIn1, dataIn1] : [dataIn2, dataIn2];
  const dataOut = _.isObject(dataIn1) && _.isObject(dataIn2)
    ? [dataIn1, dataIn2] : normalisedData;
  return dataOut;
};
const normaliseValue = (val) => (/^\d*\.?\d+?$|^\d*,?\d+?$/.test(val) ? Number(val) : val);
const getDiffThree = (data) => {
  const [list1, list2] = normaliseData(data);
  const keys = _.union(Object.keys(list2), Object.keys(list1)).sort();
  const res = keys.reduce((three, key) => {
    const value1 = normaliseValue(list1[key]);
    const value2 = normaliseValue(list2[key]);
    const nodeType = getNodeType([list1, list2, key]);
    const newNode = nodeMakerData[nodeType].reduce((acc, property) => {
      const instructions = {
        name: key,
        type: nodeType,
        oldValue: value1,
        newValue: value2,
        children: getDiffThree,
      };
      acc[property] = typeof instructions[property] === 'function'
        ? instructions[property]([value1, value2])
        : instructions[property];
      return acc;
    }, {});
    const newThree = [newNode, ...three];
    return newThree;
  }, []);
  return res;
};
export default getDiffThree;
