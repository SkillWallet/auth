import { Component, Event, EventEmitter, h, State } from '@stencil/core';
import { getCommunity } from '../../utils/utils';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @State() community: any;
  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showLogin: EventEmitter<Boolean>;
  @State() clickCount: number = 0;

  async componentWillRender() {
    const comm = await getCommunity();
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
      <button class="connect-wallet-button" >
        Connect Wallet
      </button>
      <users-modal community={this.community}>
        </users-modal>
      </div>
    )
  }
}
