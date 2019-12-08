import program from 'commander';
import genDiff from '../';
import pkg from '../../package.json';

export default () => {
  program.version(pkg.version);
  program.description('Compares two configuration files and shows a difference.');
  program.option('-f, --format [type]', 'Output formats. Аvailable output types: plain, json.');
  program.arguments('<firstPath> <secondPath>');
  program.action((firstPath, secondPath, options) => {
    const res = genDiff(firstPath, secondPath, options.format);
    return res;
  });
  program.parse(process.argv);
};