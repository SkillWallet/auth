import { Component, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import { changeNetwork, fetchSkillWallet } from '../../utils/utils';

@Component({
  tag: 'users-modal',
})
export class UsersModal {
  @State() isLoading: Boolean = false;
  @Prop() isPartner: Boolean;
  
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
    this.isLoading = true;
    const { ethereum } = window;
    try {
      await changeNetwork();
      await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(ethereum);
      await fetchSkillWallet(ethereum.selectedAddress);
      this.closeModalOnLogin.emit(); 

    } catch (error) {
      this.isLoading = false;
      alert(error);
    }
  };

  render() {
    return (
        <div class="modal-window-child">
          {this.isLoading ? <div class="item">
              <h2>Loading</h2>  
              <i class="loader two"></i>
              </div> : <div></div>}
          <div class="wallet-header">
            <auth-image class="white-wallet" image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-white.svg'}></auth-image>
            <h2>{this.isPartner ? 'I am a...' : 'Login with'}</h2>
          </div>

          <div class="wallet-modal-button">
            <button 
            onClick={() => this.handleMetamaskClick()}
            >
              <auth-image></auth-image>
              <p>{this.isPartner ? 'Existing Partner' : 'SkillWallet'}</p>
            </button>

            <button 
            onClick={() => this.handleNewScreen(null)}
            >
              <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/plus-button-white.svg'}></auth-image>
              <p>{this.isPartner ? 'New Partner' : 'New User'}</p>
            </button>
          </div>
        </div>
    )
  }
}
