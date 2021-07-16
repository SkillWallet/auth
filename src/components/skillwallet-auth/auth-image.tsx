import { Component, Prop, getAssetPath, h } from '@stencil/core';

@Component({
  tag: 'auth-image',
//   styleUrl: 'stencil-asset.css',
  assetsDirs: ['images']
})
export class StencilAsset {

  @Prop() image = "sw-logo.svg";

  render() {
   return <img src={getAssetPath(`./images/${this.image}`)} />
  }
}