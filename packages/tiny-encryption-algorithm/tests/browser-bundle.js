// src/strToLongs.js
function strToLongs(s) {
  const l = new Array(Math.ceil(s.length / 4));
  for (let i = 0; i < l.length; i++) {
    l[i] = s.charCodeAt(i * 4) + (s.charCodeAt(i * 4 + 1) << 8) + (s.charCodeAt(i * 4 + 2) << 16) + (s.charCodeAt(i * 4 + 3) << 24);
  }
  return l;
}

// src/utf8Encode.js
function utf8Encode(str) {
  return unescape(encodeURIComponent(str));
}

// src/encode.js
var encode = (v, k) => {
  if (v.length < 2)
    v[1] = 0;
  const n = v.length;
  const delta = 2654435769;
  let q = Math.floor(6 + 52 / n);
  let z = v[n - 1], y = v[0];
  let mx, e, sum = 0;
  while (q-- > 0) {
    sum = sum + delta;
    e = sum >>> 2 & 3;
    for (let p = 0; p < n; p++) {
      y = v[(p + 1) % n];
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
      z = v[p] += mx;
    }
  }
  return v;
};

// src/longsToStr.js
function longsToStr(l) {
  let str = "";
  for (let i = 0; i < l.length; i++) {
    str += String.fromCharCode(l[i] & 255, l[i] >>> 8 & 255, l[i] >>> 16 & 255, l[i] >>> 24 & 255);
  }
  return str;
}

// src/base64Encode.js
function base64Encode(str) {
  if (typeof btoa !== "undefined")
    return btoa(str);
  if (typeof Buffer !== "undefined")
    return new Buffer(str, "binary").toString("base64");
  throw new Error("No Base64 Encode");
}

// src/encrypt.js
function encrypt(plaintext, password) {
  plaintext = String(plaintext);
  password = String(password);
  if (plaintext.length === 0)
    return "";
  const v = strToLongs(utf8Encode(plaintext));
  const k = strToLongs(utf8Encode(password).slice(0, 16));
  const cipher = encode(v, k);
  const ciphertext = longsToStr(cipher);
  const cipherbase64 = base64Encode(ciphertext);
  return cipherbase64;
}

// src/base64Decode.js
function base64Decode(b64Str) {
  if (typeof atob === "undefined" && typeof Buffer === "undefined")
    throw new Error("No base64 decode");
  try {
    if (typeof atob !== "undefined")
      return atob(b64Str);
    if (typeof Buffer !== "undefined")
      return new Buffer(b64Str, "base64").toString("binary");
  } catch (e) {
    throw new Error("Invalid ciphertext");
  }
}

// src/decode.js
var decode = (v, k) => {
  const n = v.length;
  const delta = 2654435769;
  const q = Math.floor(6 + 52 / n);
  let z = v[n - 1], y = v[0];
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
};

// src/utf8Decode.js
function utf8Decode(utf8Str) {
  try {
    return decodeURIComponent(escape(utf8Str));
  } catch (e) {
    return utf8Str;
  }
}

// src/decrypt.js
function decrypt(ciphertext, password) {
  ciphertext = String(ciphertext);
  password = String(password);
  if (ciphertext.length === 0)
    return "";
  const v = strToLongs(base64Decode(ciphertext));
  const k = strToLongs(utf8Encode(password).slice(0, 16));
  const plain = decode(v, k);
  const plaintext = longsToStr(plain);
  const plainUnicode = utf8Decode(plaintext.replace(/\0+$/, ""));
  return plainUnicode;
}

// tests/uuid.js
function uuid() {
  let d = new Date().getTime();
  const uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : r & 3 | 8).toString(16);
  });
  return uid;
}

// tests/encrypt.spec.js
describe("encrypt", () => {
  it("should encrypt a simple string", () => {
    const msg = `Dogs's rule, cats suck!`;
    const password = uuid();
    const e = encrypt(msg, password);
    const d = decrypt(e, password);
    expect(d).to.equal(msg);
  });
  it("should encrypt a complex string", () => {
    const msg = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
    const password = uuid();
    const e = encrypt(msg, password);
    const d = decrypt(e, password);
    expect(d).to.equal(msg);
  });
  it("should encrypt a JSON string", () => {
    const msg = JSON.stringify({
      problems: [
        {
          Diabetes: [
            {
              medications: [
                {
                  medicationsClasses: [
                    {
                      className: [
                        {
                          associatedDrug: [
                            {
                              name: "asprin",
                              dose: "",
                              strength: "500 mg"
                            }
                          ],
                          "associatedDrug#2": [
                            {
                              name: "somethingElse",
                              dose: "",
                              strength: "500 mg"
                            }
                          ]
                        }
                      ],
                      className2: [
                        {
                          associatedDrug: [
                            {
                              name: "asprin",
                              dose: "",
                              strength: "500 mg"
                            }
                          ],
                          "associatedDrug#2": [
                            {
                              name: "somethingElse",
                              dose: "",
                              strength: "500 mg"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              labs: [
                {
                  missing_field: "missing_value"
                }
              ]
            }
          ],
          Asthma: [{}]
        }
      ]
    });
    const password = uuid();
    const e = encrypt(msg, password);
    const d = decrypt(e, password);
    expect(d).to.equal(msg);
  });
});
