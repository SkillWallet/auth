import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'auth-image'
})
export class AuthImage {

  @Prop({mutable: true}) image = "https://dito-assets.s3.eu-west-1.amazonaws.com/sw-logo-revised.svg";

  render() {
   return <img src={this.image} />
  }
}