import _ from 'lodash';

const render = (data) => {
  const result = `${_.reduce(data, (acc, obj) => {
    const keys = Object.keys(obj).sort();
    const middleResult = `${keys.reduce((middleAcc, key) => {
      if (key === 'children') {
        return `${middleAcc}"${key}":${render(obj[key])},`;
      }
      if (typeof obj[key] === 'string') {
        return `${middleAcc}"${key}":"${obj[key]}",`;
      }
      return `${middleAcc}"${key}":${obj[key]},`;
    }, '{')}`;

    return `${acc}${middleResult.split(',').filter((el) => el.length > 0).join(',')}},`;
  }, '[')}`;
  return `${result.split(',').filter((el) => el.length > 0).join(',')}]`;
};

export default render;
