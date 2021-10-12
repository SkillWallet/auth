import { Component, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import { changeNetwork, fetchSkillWallet } from '../../utils/utils';

@Component({
  tag: 'login-menu',
})
export class LoginMenu {
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
          <div class="wallet-header login-menu">
            <h2>Welcome back! 🙌</h2>
          </div>

            <div class="login-menu-buttons-container">
                <button onClick={() => this.handleMetamaskClick()}>
                    <div>
                        <auth-image class="metamask" image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/metamask.svg'}></auth-image>
                        <p>{this.isPartner ? 'Login with Metamask' : 'Login with Metamask'}</p>
                    </div>
                </button>

                <button 
                // onClick={() => this.handleMetamaskClick()}
>
                    <div>
                        <auth-image class="portis" image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/portis_icon.svg'}></auth-image>
                        <p>{this.isPartner ? 'Use Your Password' : 'Use Your Password'}</p>
                    </div>
                </button>

                <button 
                // onClick={() => this.handleMetamaskClick()}
                >
                    <div>
                        <p>{this.isPartner ? 'Scan QR Code' : 'Scan QR Code'}</p>
                    </div>
                </button>
            </div>
        </div>
    )
  }
}
