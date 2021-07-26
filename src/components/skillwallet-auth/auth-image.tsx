import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'auth-image',
//   styleUrl: 'stencil-asset.css',
  assetsDirs: ['images']
})
export class StencilAsset {

  @Prop({mutable: true}) image = "https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/sw-logo.svg";

  render() {
   return <img src={this.image} />
  }
}