/**
 * Encodes multi-byte string to utf8 - monsur.hossa.in/2012/07/20/utf-8-in-javascript.html
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export default function utf8Encode(str) {
  return unescape(encodeURIComponent(str));
}
