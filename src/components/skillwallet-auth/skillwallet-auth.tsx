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
  @Prop() partnerKey: string;
  @State() community: any;
  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showLogin: EventEmitter<Boolean>;
  @State() clickCount: number = 0;

  async componentDidLoad() {
    // this.ethEnabled();
    console.log(this.partnerKey);
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
        <button class="connect-wallet-button">Connect Wallet</button>
        <users-modal community={this.community}></users-modal>
      </div>
    );
  }
}
