import { Component, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import { getCommunity } from '../../utils/utils';
// import Web3 from 'web3';
import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @Prop() partnerKey: string = "d0aa09caba3ee6e60eb4b2724e9909df5328c599";
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
  @State() usersModalIsVisible: boolean = false;

  async componentDidLoad() {
    // this.ethEnabled();
    console.log(this.partnerKey);
    (window as any).Buffer = buffer;
    const comm = await getCommunity(this.partnerKey);
    this.community = comm;
  }

  handleClick() {
    // this.usersModalIsVisible = true;
    // this.showLogin.emit(true);
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
        <users-modal community={this.community} usersModalIsVisible={this.usersModalIsVisible} userUploadedImage={this.userUploadedImage}></users-modal>
      </div>
    );
  }
}
