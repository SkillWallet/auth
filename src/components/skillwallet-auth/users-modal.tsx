import { Component, h, Event, EventEmitter } from '@stencil/core';
import { fetchSkillWallet } from '../../utils/utils';

@Component({
  tag: 'users-modal',
})
export class UsersModal {
  @Event({
    eventName: 'showNewScreen',
    composed: true,
    cancelable: true,
    bubbles: true,
  })

  showNewScreen: EventEmitter<any>;

  @Event({
    eventName: 'closeModalOnLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  closeModalOnLogin: EventEmitter<any>;

  handleNewScreen(text) {
    this.showNewScreen.emit(text);
  }

  handleMetamaskClick = async () => {
    const { ethereum } = window;
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(ethereum);
      await fetchSkillWallet(ethereum.selectedAddress);
      this.closeModalOnLogin.emit(); 

    } catch (error) {
      alert(error);
    }
  };

  render() {
    return (
        <div class="modal-window-child">
          <div class="wallet-header">
            <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-black.svg'}></auth-image>
            <h2>Login with</h2>
          </div>

          <div class="wallet-modal-button">
            <button 
            onClick={() => this.handleMetamaskClick()}
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
