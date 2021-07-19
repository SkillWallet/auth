import { Config } from '@stencil/core';
import { QRCode } from 'react-qrcode-logo';

export const config: Config = {
  namespace: 'skillwallet-auth',
  nodeResolve: {
    browser: true
  },
  rollupPlugins: {
    after: [
      QRCode
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
