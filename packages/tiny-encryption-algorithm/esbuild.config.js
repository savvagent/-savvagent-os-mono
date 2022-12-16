import { build } from 'esbuild'
import devServer from 'esbuild-plugin-dev-server'

const entryPoints = ['src/index.js']

const args = process.argv

const watch = args.includes('--watch')

const plugins = []

if (watch) plugins.push(devServer({ public: './', port: 4000 }))

const browserConfig = {
  bundle: true,
  entryPoints,
  format: 'esm',
  minify: true,
  sourcemap: true,
  plugins,
  outdir: 'dist/esm',
  ...(watch && { watch: true }),
}

const cjsConfig = {
  bundle: true,
  entryPoints,
  format: 'cjs',
  minify: false,
  sourcemap: false,
  outdir: 'dist/cjs',
  outExtension: { '.js': '.cjs' },
  target: ['node16.0'],
}

const testConfig = {
  bundle: true,
  entryPoints: ['tests/index.js'],
  format: 'esm',
  minify: false,
  outfile: 'tests/browser-bundle.js',
  sourcemap: false,
}

Promise.all([build(browserConfig), build(cjsConfig), watch && build(testConfig)]).catch((err) =>
  console.log('err', err)
)
