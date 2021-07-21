import { Component, Event, EventEmitter, Listen, h, State } from '@stencil/core';

declare global {
    interface Window {
        ethereum:any;
    }
}

@Component({
  tag: 'new-user'
})
export class NewUser {    
    @State() newUserIsVisible: boolean = true;
    @State() isAccountDisconnected: boolean = true;

    @Event({
        eventName: 'showUserDetails',
        composed: true,
        cancelable: true,
        bubbles: true,
      }) showUserDetails: EventEmitter<Boolean>;

      componentWillLoad() {
        const {ethereum} = window;
        console.log(ethereum);
        if (ethereum && ethereum.isMetaMask && ethereum.selectedAddress) {
            this.isAccountDisconnected = false;
            return;
        }
      }

    handleMetamaskClick = async () => {
        const {ethereum} = window;
            try {
                await ethereum.request({ method: 'eth_requestAccounts'});
                this.isAccountDisconnected = false;
            } catch (error) {
                alert(error);
            }
      }

    @Listen('showNewUser', { target: "body" })
    handleUserClick(wasClicked) {
        this.newUserIsVisible = wasClicked;
    }

    @Listen('showUserDetails', { target: "body" })
    handleUserDetailsClick() {
        this.showUserDetails.emit(true); 
      }

  render() {
        return (
            <div class="topDiv">
            <div class="modalWindow">
                <div class="new-user-modal-window-child">
                    <div class="new-user-header">
                      <h2>Welcome to <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>Community Name</span></h2>
                      <p>First, import your Wallet, or create a brand new account.</p>
                    </div>

                    <div class="wallet-modal-button">
                        <button 
                        onClick={() => this.handleMetamaskClick()}
                        >
                            <auth-image image={"metamask.svg"}></auth-image>
                            <p>Inject from Metamask</p>
                        </button>
                        <button 
                        // onClick={() => this.handleUserClick()}
                        >
                            <auth-image image={"torus-new-user.svg"}></auth-image>
                            <p>Create New Account</p>
                        </button>
                    </div>

             {/* ask Alex --> button doesn't seem necessary */}
                    <button disabled={this.isAccountDisconnected} onClick={() => this.handleUserDetailsClick()}>Next: Introduce yourself</button>
                </div>
            </div>
        </div>
    )
  }
}
