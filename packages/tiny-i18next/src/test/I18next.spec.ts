import I18next from "../I18next"

describe("I18next", () => {
  it("should, when instantiated, return a function", () => {
    const t = new I18next({ name: "foo" })
    expect(t).to.be.a("function")
  })
  it("should get certain translations", () => {
    const t = new I18next({ name: "Name", sex: "Male" })
    expect(t("name")).to.be.equal("Name")
    expect(t("sex")).to.be.equal("Male")
  })
  it("should return the key name if a translation cannot be found", () => {
    const t = new I18next({ name: "Name", sex: "Male" })
    expect(t("firstName")).to.be.equal("firstName")
    expect(t("sex")).to.be.equal("Male")
  })
  it("should return a translation with a splitter", () => {
    const t = new I18next({ foo: { name: "bar" } })
    expect(t("foo::name")).to.be.equal("bar")
  })
  it("should return a translation with a custom splitter", () => {
    const t = new I18next({ foo: { name: "bar" } }, { splitter: "." })
    expect(t("foo.name")).to.be.equal("bar")
  })

  it("should replace placeholders", () => {
    const translations = {
      results: "Show {viewCount} of {totalCount} Results",
    }
    const t = new I18next(translations)
    expect(t("results")).to.be.equal("Show {viewCount} of {totalCount} Results")
    expect(t("results", { viewCount: 20, totalCount: 100 })).to.be.equal("Show 20 of 100 Results")
  })

  it("should return a fallback where only 2 parameters are provided", () => {
    const translations = {}
    const t = new I18next(translations)
    expect(t("results", "foo")).to.be.equal("foo")
  })

  it("should return a fallback when 3 parameters are provided and the key and replacements are not found", () => {
    const translations = {}
    const t = new I18next(translations)
    expect(t("results", {}, "foo")).to.be.equal("foo")
  })
})
