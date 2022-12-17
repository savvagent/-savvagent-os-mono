import strToLongs from './strToLongs'
import base64Decode from './base64Decode'
import utf8Encode from './utf8Encode'
import { decode } from './decode'
import longsToStr from './longsToStr'
import utf8Decode from './utf8Decode'

export function decrypt(ciphertext, password) {
  ciphertext = String(ciphertext)
  password = String(password)

  if (ciphertext.length === 0) return '' // nothing to decrypt

  //  v is n-word data vector; converted to array of longs from base64 string
  const v = strToLongs(base64Decode(ciphertext))
  //  k is 4-word key; simply convert first 16 chars of password as key
  const k = strToLongs(utf8Encode(password).slice(0, 16))

  const plain = decode(v, k)

  const plaintext = longsToStr(plain)

  // strip trailing null chars resulting from filling 4-char blocks:
  const plainUnicode = utf8Decode(plaintext.replace(/\0+$/, ''))

  return plainUnicode
}
