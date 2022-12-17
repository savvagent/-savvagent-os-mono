export default function base64Encode(str) {
  if (typeof btoa !== 'undefined') return btoa(str); // browser
  if (typeof Buffer !== 'undefined') return new Buffer(str, 'binary').toString('base64'); // Node.js
  throw new Error('No Base64 Encode');
}
