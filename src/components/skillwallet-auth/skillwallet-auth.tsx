import { Component, State, Listen, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @State() showModal: boolean = false;
  @Event() showQR: EventEmitter<Boolean>;

  @Listen('click', { capture: true })
  handleClick() {
    this.showModal = !this.showModal;
  }

  render() {
    return (
      <div>
      <button class="connect-wallet-button">
        Connect Wallet
      </button>
      <users-modal
          isVisible={this.showModal}
        >
        </users-modal>
  
      {this.showModal ? 'Logged in!' : null}
      </div>
    )
  }
}
