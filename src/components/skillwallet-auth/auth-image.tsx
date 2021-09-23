import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'auth-image'
})
export class AuthImage {

  @Prop({mutable: true}) image = "https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/sw-logo.svg";

  render() {
   return <img src={this.image} />
  }
}