/* eslint-disable no-undef */
import TinyUri from '../src/TinyUri.js'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const main = suite('main')

main('should parse a url into its parts', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  assert.is(uri.scheme(), 'https')
  assert.is(uri.host(), 'big.example.com')
  assert.is(uri.authority(), 'user:pass@big.example.com')
  assert.is(uri.path.toString(), 'path/to/file.xml')
  assert.is(uri.query.toString(), 'context=foo&credentials=bar')
})

main('should parse an empty string url without blowing up', () => {
  const url = ''
  const uri = new TinyUri(url)
  assert.is(uri.scheme(), '')
  assert.is(uri.host(), '')
  assert.is(uri.authority(), '')
  assert.is(uri.path.toString(), '')
  assert.is(uri.query.toString(), '')
})

main('should parse a relative url into its parts', () => {
  const url = 'path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  assert.is(uri.scheme(), '')
  assert.is(uri.host(), '')
  assert.is(uri.authority(), '')
  assert.is(uri.path.toString(), 'path/to/file.xml')
  assert.is(uri.query.toString(), 'context=foo&credentials=bar')
})

main('should parse a url with url template tags into its parts', () => {
  const url =
    'https://user:pass@big.example.com/quotetools/getHistoryDownload/{user}/download.csv{?webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol}'
  const uri = new TinyUri(url)
  assert.is(uri.scheme(), 'https')
  assert.is(uri.host(), 'big.example.com')
  assert.is(uri.authority(), 'user:pass@big.example.com')
  assert.is(uri.path.toString(), 'quotetools/getHistoryDownload/{user}/download.csv')
  assert.is(Array.isArray(uri.path.get()), true)
  assert.equal(uri.path.get(), ['quotetools', 'getHistoryDownload', '{user}', 'download.csv'])
  assert.is(uri.query.toString(), '')
  assert.is(
    uri.query.getUrlTemplateQuery(),
    'webmasterId,startDay,startMonth,startYear,endDay,endMonth,endYear,isRanged,symbol'
  )
})

main('should parse a url into its parts even if query string not provided', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)
  assert.is(uri.scheme(), 'https')
  assert.is(uri.host(), 'big.example.com')
  assert.is(uri.authority(), 'user:pass@big.example.com')
  assert.is(uri.path.toString(), 'path/to/file.xml')
  assert.is(uri.query.toString(), '')
})

main('should convert the uri to a string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  assert.is(uri.toString(), url)
})

main('should convert the uri to a string without a trailing slash', () => {
  const url = 'https://big.example.com/'
  const uri = new TinyUri(url)
  assert.is(uri.toString(), 'https://big.example.com')
})

main('should change the host', () => {
  const url = 'https://big.example.com/'
  const uri = new TinyUri(url)
  uri.host(uri.host() === 'big.example.com' ? 'small.example.com' : uri.host())
  assert.is(uri.toString(), 'https://small.example.com')
})

main('should change the host', () => {
  const url = 'https://small.example.com/'
  const uri = new TinyUri(url)
  uri.host(uri.host() === 'big.example.com' ? 'small.example.com' : uri.host())
  assert.is(uri.toString(), 'https://small.example.com')
})

main('should change the host', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  uri.host('little.example.com')
  assert.is(uri.host(), 'little.example.com')
})

main('should change the scheme', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  uri.scheme('http')
  assert.is(uri.scheme(), 'http')
})

main('should demonstrate chaining', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)

  assert.is(
    uri.path.delete(1).query.add({ foo: 'bar' }).query.merge({ context: 'foobar' }).toString(),
    'https://user:pass@big.example.com/path/file.xml?context=foobar&credentials=bar&foo=bar'
  )
})

const path = suite('path')

path('should return the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.toString(), 'path/to/file.xml')
})

path('should replace the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.replace('different/path/to/file.json').path.toString(), 'different/path/to/file.json')
})

path('should replace the file part of the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.replace('file.json', 'file').path.toString(), 'path/to/file.json')
})

path('should remove the last segment of the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.delete().path.toString(), 'path/to')
})

path('should remove a specific segment of the the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.delete(0).path.toString(), 'to/file.xml')
})

path('should remove several segments of the the path', () => {
  const url = 'https://user:pass@big.example.com/really/long/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.delete([0, 1, 2, 3]).path.toString(), 'file.xml')
})

path('should replace the first segment of the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.replace('new-path', 0).path.toString(), 'new-path/to/file.xml')
})

path('should replace the second segment of the path', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.replace('new-to', 1).path.toString(), 'path/new-to/file.xml')
})

path('should return the uri as a string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(uri.path.replace('new-to', 1).path.toString(true), 'https://user:pass@big.example.com/path/new-to/file.xml')
})

path('should support path chaining', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml'
  const uri = new TinyUri(url)

  assert.is(
    uri.path.replace('new-path', 0).path.replace('new-to', 1).path.toString(true),
    'https://user:pass@big.example.com/new-path/new-to/file.xml'
  )
})

path('should support path appending and chaining', () => {
  const url = 'https://user:pass@big.example.com'
  const uri = new TinyUri(url)
  uri.path.append('path').path.append('to').path.append('file')

  assert.is(uri.toString(), 'https://user:pass@big.example.com/path/to/file')
})

const query = suite('query')

query('should set the query string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  uri.query.set({ foo: 'bar' })
  assert.is(uri.query.toString(), 'foo=bar')
})

query('should return a url template query string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml{?userid,name}'
  const uri = new TinyUri(url)

  assert.is(uri.query.getUrlTemplateQuery(), 'userid,name')
})

query('should add a query string properly on a naked host', () => {
  const url = 'https://big.example.com'
  const uri = new TinyUri(url)
  uri.query.add({ foo: 'bar' })
  assert.is(uri.toString(), 'https://big.example.com?foo=bar')
})

query('should not add a query string if undefined', () => {
  const url = 'https://big.example.com'
  const uri = new TinyUri(url)
  uri.query.add({ foo: undefined })
  assert.is(uri.toString(), 'https://big.example.com')
})

query('should clear to the query string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  assert.is(uri.query.clear().query.toString(), '')
})

query('should append to the query string', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  uri.query.add({ foo: 'bar' })
  assert.is(uri.query.toString(), 'context=foo&credentials=bar&foo=bar')
})

query('should change/replace a query parameter', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  uri.query.merge({ context: 'bar' })
  assert.is(uri.query.toString(), 'context=bar&credentials=bar')
})

query('should, when cleared, return a proper url', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  assert.is(uri.query.clear().toString(true), 'https://user:pass@big.example.com/path/to/file.xml')
})

query('should get a leading query string parameter', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  const qs = uri.query.get('context')
  assert.is(qs, 'foo')
})

query('should get a trailing query string parameter', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  const qs = uri.query.get('credentials')
  assert.is(qs, 'bar')
})

query('should get null for an invalid query', () => {
  const url = 'https://user:pass@big.example.com/path/to/file.xml?context=foo&credentials=bar'
  const uri = new TinyUri(url)
  const qs = uri.query.get('hot')
  assert.not.ok(qs)
})

main.run()
path.run()
query.run()
