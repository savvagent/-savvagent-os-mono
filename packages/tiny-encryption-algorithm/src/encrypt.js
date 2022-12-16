import strToLongs from './strToLongs'
import utf8Encode from './utf8Encode'
import { encode } from './encode'
import longsToStr from './longsToStr'
import base64Encode from './base64Encode'

export function encrypt(plaintext, password) {
  plaintext = String(plaintext)
  password = String(password)

  if (plaintext.length === 0) return '' // nothing to encrypt

  //  v is n-word data vector; converted to array of longs from UTF-8 string
  const v = strToLongs(utf8Encode(plaintext))
  //  k is 4-word key; simply convert first 16 chars of password as key
  const k = strToLongs(utf8Encode(password).slice(0, 16))

  const cipher = encode(v, k)

  // convert array of longs to string
  const ciphertext = longsToStr(cipher)

  // convert binary string to base64 ascii for safe transport
  const cipherbase64 = base64Encode(ciphertext)

  return cipherbase64
}
