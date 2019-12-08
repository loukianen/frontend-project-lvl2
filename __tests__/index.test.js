import path from 'path';
import fs from 'fs';
import genDiff from '../src';

const inputDataTypes = ['json', 'yml', 'ini'];
const outputDataTypes = ['usual', 'plain', 'json'];
test.each(outputDataTypes)('genDiff', (outputType) => {
  inputDataTypes.forEach((inputType) => {
    const file1 = path.resolve(`__fixtures__/before.${inputType}`);
    const file2 = path.resolve(`__fixtures__/after.${inputType}`);
    const gauge = path.resolve(`__fixtures__/${outputType}Gauge`);
    const expectResult = fs.readFileSync(gauge, 'utf8');
    const result = genDiff(file1, file2, outputType);
    expect(result).toBe(expectResult);
  })
});
// that cod id from code-climat 8952ce102d144a6c27b94c0ce7d2a4696597733df4542e17c624b126c83bc3a1
