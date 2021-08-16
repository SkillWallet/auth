import { Component, h, Event, EventEmitter, Prop, Element } from '@stencil/core';

@Component({
  tag: 'users-modal',
})
export class UsersModal {
  @Prop() userUploadedImage: any;

  @Event({
    eventName: 'showNewScreen',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showNewScreen: EventEmitter<any>;

  handleNewScreen(text) {
    this.showNewScreen.emit(text);
  }

  render() {
    return (
        <div class="modal-window-child">
          <div class="wallet-header">
            <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-black.svg'}></auth-image>
            <h2>Login with</h2>
          </div>

          <div class="wallet-modal-button">
            <button 
            onClick={() => this.handleNewScreen('skillwallet')}
            >
              <auth-image></auth-image>
              <p>SkillWallet</p>
            </button>

            <button 
            onClick={() => this.handleNewScreen(null)}
            >
              <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/plus-button-white.svg'}></auth-image>
              <p>Create New User</p>
            </button>
          </div>
        </div>
    )
  }
}
