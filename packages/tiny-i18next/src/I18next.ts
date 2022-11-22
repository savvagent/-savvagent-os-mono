export default class I18next {
  message: object
  options: { splitter?: string; fallback?: string }
  splitter: string
  fallback: string | undefined
  constructor(message: object, options?: object) {
    this.options = options || {}
    this.message = message
    this.splitter = this.options.splitter || "::"
    this.fallback = this.options.fallback
    return this.translate
  }

  private getTranslation(key: string) {
    if (!key) return null
    if (Object.hasOwn(this.message, key)) {
      return this.message[key]
    }
    try {
      const components = key.split(this.splitter)
      const namespace = components[0]
      const _key = components[1]
      if (Object.hasOwn(this.message, namespace) && this.message[namespace][_key]) {
        return this.message[namespace][_key]
      }
      if (!_key && this.fallback) return this.fallback
      return key
    } catch (e) {
      if (this.fallback) return this.fallback
      return key
    }
  }

  private getPlural(translation: object, count: number) {
    let i
    let _translation
    let upper = 0
    if (typeof translation === "object") {
      const keys = Object.keys(translation)
      if (keys.length === 0) return null
      for (i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("gt" === 0)) upper = parseInt(keys[i].replace("gt", ""), 10)
      }
      if (translation[count]) _translation = translation[count]
      else if (count > upper) _translation = translation[`gt${upper}`]
      else if (translation.n) _translation = translation.n
      else _translation = translation[Object.keys(translation).reverse()[0]]

      return _translation
    }
  }

  replacePlaceholders(translation: string, replacements: Array<string>) {
    const t =
      typeof translation === "string"
        ? translation.replace(/\{(\w*)\}/g, (match, key) => replacements[key])
        : translation

    return t
  }

  public translate = (
    key: string,
    fallbackOrReplacements?: string | number | object,
    replacementsOrFallback?: string | number | object
  ): string => {
    let replacements: object | undefined
    let count: number | undefined
    if (typeof fallbackOrReplacements === "object") replacements = fallbackOrReplacements
    if (typeof fallbackOrReplacements === "string") this.fallback = fallbackOrReplacements
    if (typeof fallbackOrReplacements === "number" && Number.isInteger(fallbackOrReplacements))
      count = fallbackOrReplacements
    if (typeof replacementsOrFallback === "string") this.fallback = replacementsOrFallback
    if (typeof replacementsOrFallback === "object") replacements = replacementsOrFallback
    if (
      replacementsOrFallback &&
      typeof replacementsOrFallback === "number" &&
      Number.isInteger(replacementsOrFallback)
    ) {
      count = fallbackOrReplacements
    }

    let translation = this.getTranslation(key)

    if (count && replacements) {
      // get appropriate plural translation string
      translation = this.getPlural(translation, count)
    }

    if (replacements) {
      translation = this.replacePlaceholders(translation, replacements)
    }

    if (translation === null) {
      console.warn(`Translation for "${key}" not found. Returning fallback, if any`)
      if (this.fallback) translation = this.fallback
    }

    return translation
  }
}
