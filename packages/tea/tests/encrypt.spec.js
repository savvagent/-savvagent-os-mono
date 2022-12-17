import { encrypt } from '../src/encrypt'
import { decrypt } from '../src/decrypt'
import { uuid } from './uuid'

const { describe, expect, it } = window

describe('encrypt', () => {
  it('should encrypt a simple string', () => {
    const msg = `Dogs's rule, cats suck!`
    const password = uuid()
    const e = encrypt(msg, password)
    const d = decrypt(e, password)
    expect(d).to.equal(msg)
  })
  it('should encrypt a complex string', () => {
    const msg = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
    const password = uuid()
    const e = encrypt(msg, password)
    const d = decrypt(e, password)
    expect(d).to.equal(msg)
  })
  it('should encrypt a JSON string', () => {
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
                              name: 'asprin',
                              dose: '',
                              strength: '500 mg',
                            },
                          ],
                          'associatedDrug#2': [
                            {
                              name: 'somethingElse',
                              dose: '',
                              strength: '500 mg',
                            },
                          ],
                        },
                      ],
                      className2: [
                        {
                          associatedDrug: [
                            {
                              name: 'asprin',
                              dose: '',
                              strength: '500 mg',
                            },
                          ],
                          'associatedDrug#2': [
                            {
                              name: 'somethingElse',
                              dose: '',
                              strength: '500 mg',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              labs: [
                {
                  missing_field: 'missing_value',
                },
              ],
            },
          ],
          Asthma: [{}],
        },
      ],
    })
    const password = uuid()
    const e = encrypt(msg, password)
    const d = decrypt(e, password)
    expect(d).to.equal(msg)
  })
})
