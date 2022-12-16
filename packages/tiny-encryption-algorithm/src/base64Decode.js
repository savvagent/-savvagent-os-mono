export default function base64Decode(b64Str) {
  if (typeof atob === 'undefined' && typeof Buffer === 'undefined') throw new Error('No base64 decode');
  try {
    if (typeof atob !== 'undefined') return atob(b64Str); // browser
    if (typeof Buffer !== 'undefined') return new Buffer(b64Str, 'base64').toString('binary'); // Node.js
  } catch (e) {
    throw new Error('Invalid ciphertext');
  }
}
