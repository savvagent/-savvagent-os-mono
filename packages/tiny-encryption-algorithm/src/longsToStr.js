/**
 * Converts array of longs to string.
 * @param  {[type]} l [description]
 * @return {[type]}   [description]
 */
export default function longsToStr(l) {
  let str = '';
  for (let i = 0; i < l.length; i++) {
    str += String.fromCharCode(l[i] & 0xff, l[i] >>> 8 & 0xff, l[i] >>> 16 & 0xff, l[i] >>> 24 & 0xff);
  }
  return str;
}
