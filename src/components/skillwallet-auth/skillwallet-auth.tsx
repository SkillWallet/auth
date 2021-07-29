import { Component, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import { getCommunity } from '../../utils/utils';
import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @Prop() partnerKey: string;
  @State() community: any;
  @State() userUploadedImage: any = '';
  @State() icon: any = this.userUploadedImage === '' ? 
        <auth-image class="person-img" image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/user.svg"}></auth-image> :
        <auth-image class="person-img" image={this.userUploadedImage}></auth-image>
  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showLogin: EventEmitter<Boolean>;
  @State() clickCount: number = 0;

  async componentDidLoad() {
    (window as any).Buffer = buffer;
    const comm = await getCommunity(this.partnerKey);
    this.community = comm;
  }

  handleClick() {
    this.clickCount += 1;
    if (this.clickCount < 2) {
      this.showLogin.emit(true);
    }
  }

  render() {
    return (
      <div onClick={() => this.handleClick()}>
        <button class="connect-wallet-button">
          {this.icon}
          <p>Connect Wallet</p>
        </button>
        <users-modal community={this.community}  userUploadedImage={this.userUploadedImage}></users-modal>
      </div>
    );
  }
}
