import { Component, Prop, getAssetPath, h } from '@stencil/core';

@Component({
  tag: 'auth-image',
//   styleUrl: 'stencil-asset.css',
  assetsDirs: ['images']
})
export class StencilAsset {

  @Prop({mutable: true}) image = "/sw-logo.svg";

  render() {
   return <img src={getAssetPath(`./images/${this.image}`)} />
  }
}