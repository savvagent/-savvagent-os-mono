import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

const entryPoints = ['src/index.js']

const args = process.argv

const watch = args.includes('--watch')

const cjsConfig = {
  entryPoints: ['./src/index.ts'],
  format: 'esm',
  minify: false,
  outExtension: { '.ts': '.js' },
  outfile: 'index.js',
  platform: 'node',
  plugins: [nodeExternalsPlugin()],
  sourcemap: false,
  target: ['node18.0'],
}

const testConfig = {
  bundle: true,
  entryPoints: ['test/browser.js'],
  format: 'esm',
  minify: false,
  outfile: 'test/browser-bundle.js',
  sourcemap: false,
}

Promise.all([build(cjsConfig), watch && build(testConfig)]).catch((err) => console.log('err', err))
