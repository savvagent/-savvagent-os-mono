import { build } from 'esbuild'

const args = process.argv

const watch = args.includes('--watch')

const entryPoints = ['src/index.js']

const browserConfig = {
  bundle: true,
  entryPoints,
  format: 'esm',
  minify: !watch,
  sourcemap: !watch,
  outdir: 'dist/esm',
  ...(watch && { watch: true }),
}

const cjsConfig = {
  ...browserConfig,
  ...{
    format: 'cjs',
    outdir: 'dist/cjs',
    outExtension: { '.js': '.cjs' },
    target: ['node16.0'],
  },
}

Promise.all([build(browserConfig), build(cjsConfig)]).catch((err) => console.log('err', err))
