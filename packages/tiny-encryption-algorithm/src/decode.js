/**
 * XXTEA: decodes array of unsigned 32-bit integers using 128-bit key.
 *
 * @param   {number[]} v - Data vector.
 * @param   {number[]} k - Key.
 * @returns {number[]} Decoded vector.
 */
export const decode = (v, k) => {
  const n = v.length;
  const delta = 0x9e3779b9;
  const q = Math.floor(6 + 52 / n);

  let z = v[n - 1],
    y = v[0];
  let mx, e, sum = q * delta;

  while (sum !== 0) {
    e = sum >>> 2 & 3;
    for (let p = n - 1; p >= 0; p--) {
      z = v[p > 0 ? p - 1 : n - 1];
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
      y = v[p] -= mx;
    }
    sum = sum - delta;
  }

  return v;
}
