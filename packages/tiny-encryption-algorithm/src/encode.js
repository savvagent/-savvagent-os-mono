/**
 * XTEA: encodes array of unsigned 32-bit integers using 128-bit key.
 *
 * @param   {number[]} v - Data vector.
 * @param   {number[]} k - Key.
 * @returns {number[]} Encoded vector.
 */
export const encode = (v, k) => {
  if (v.length < 2) v[1] = 0; // algorithm doesn't work for n<2 so fudge by adding a null
  const n = v.length;
  const delta = 0x9e3779b9;
  let q = Math.floor(6 + 52 / n);

  let z = v[n - 1],
    y = v[0];
  let mx, e, sum = 0;

  while (q-- > 0) { // 6 + 52/n operations gives between 6 & 32 mixes on each word
    sum = sum + delta;
    e = sum >>> 2 & 3;
    for (let p = 0; p < n; p++) {
      y = v[(p + 1) % n];
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
      z = v[p] += mx;
    }
  }

  return v;
}
