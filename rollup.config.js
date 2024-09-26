// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts', // Entry point
    output: [
        {
            file: 'dist/index.js', // Output file
            format: 'cjs', // CommonJS format for Node.js
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js', // ES module format
            format: 'esm', // ES module format
            sourcemap: true,
        },
    ],
    plugins: [
        resolve(), // Resolve node modules
        commonjs(), // Convert CommonJS to ES6
        postcss({ extract: true }), // Process CSS
        typescript(), // Compile TypeScript
        terser(), // Minify the output
    ],
    external: ['react', 'react-dom'], // Treat react and react-dom as external dependencies
};
