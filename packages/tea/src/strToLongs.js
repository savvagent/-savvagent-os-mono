/**
 * Converts string to array of longs (each containing 4 chars).
 * @param  {[string]} s [description]
 * @return {[array]}   array of longs
 */
export default function strToLongs(s) {
  // note chars must be within ISO-8859-1 (Unicode code-point <= U+00FF) to fit 4/long
  const l = new Array(Math.ceil(s.length / 4));
  for (let i = 0; i < l.length; i++) {
    // note little-endian encoding - endianness is irrelevant as long as it matches longsToStr()
    l[i] = s.charCodeAt(i * 4) + (s.charCodeAt(i * 4 + 1) << 8) +
      (s.charCodeAt(i * 4 + 2) << 16) + (s.charCodeAt(i * 4 + 3) << 24);
  } // note running off the end of the string generates nulls since bitwise operators treat NaN as 0
  return l;
}
