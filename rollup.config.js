import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' assert {
  type: 'json'
};

export default [
  {
    input: 'src/index.js',
    external: ['fs'],
    output: [{
      file: pkg.main,
      format: 'cjs',
      globals: {
        fs: 'fs'
      }
    }, {
      file: pkg.module,
      format: 'es',
      globals: {
        fs: 'fs'
      }
    }, {
      name: 'pseudoTransleICU',
      file: pkg.browser,
      format: 'umd',
      globals: {
        fs: 'fs'
      }
    }],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-env'],
      }),
    ],
  }
]