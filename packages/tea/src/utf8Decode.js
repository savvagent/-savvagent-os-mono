/**
 *  Decodes utf8 string to multi-byte
 * @param  {[type]} utf8Str [description]
 * @return {[type]}         [description]
 */
export default function utf8Decode(utf8Str) {
    try {
        return decodeURIComponent(escape(utf8Str));
    } catch (e) {
        return utf8Str; // invalid UTF-8? return as-is
    }
}
