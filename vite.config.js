import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite'
import path from 'path'
import glslify from "vite-plugin-glslify";

const dirname = path.resolve()

export default defineConfig({
    root: 'sources',
    publicDir: '../public',
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    plugins: [glslify()]
})