import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import dotenvPlugin from 'rollup-plugin-dotenv';
import { sass } from '@stencil/sass';
import { inlineSvg } from 'stencil-inline-svg';

export const config: Config = {
  namespace: 'skillwallet-auth',
  globalStyle: 'src/global/global.css',
  nodeResolve: {
    browser: true
  },
  plugins: [
    dotenvPlugin(),
    sass(),
    inlineSvg()
  ],
  rollupPlugins: {
    after: [
      nodePolyfills(),
    ]
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
