import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: './dist/index.js',
            format: 'es',
            sourcemap: true,
        },
        {
            file: './dist/index.min.js',
            format: 'es',
            sourcemap: true,
            plugins: [terser({ keep_fnames: true, keep_classnames: true })],
        },
    ],
    plugins: [
        typescript(),
        nodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
        json()
    ]
};