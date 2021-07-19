import { Component, Event, EventEmitter, h, State } from '@stencil/core';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showLogin: EventEmitter<Boolean>;
  @State() clickCount: number = 0;

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
      <users-modal>
        </users-modal>
      </div>
    )
  }
}
