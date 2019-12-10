import getUsualFofmat from './usualFormatter';
import getPlainFofmat from './plainFormatter';
import getJsonFormat from './jsonFormatter';

const renders = { usual: getUsualFofmat, plain: getPlainFofmat, json: getJsonFormat };
export default (data, format) => renders[format](data);
