import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: 'src/app.js',
  output: {
    file: './dist/orkestraApp.umd.js',
    format: 'umd',
    name: 'OrkestraAPP'
  },
        plugins: [resolve({browser:true}),commonjs()]
};
