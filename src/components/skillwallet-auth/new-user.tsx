import { Component, Event, EventEmitter, h, State, Prop } from '@stencil/core';
import  OpenLogin  from '@toruslabs/openlogin/dist/openlogin-bundled.cjs.js';

declare global {
    interface Window {
        ethereum:any;
    }
}

@Component({
  tag: 'new-user'
})
export class NewUser {    
    @State() isAccountDisconnected: boolean = true;
    @State() buttonClass: string = 'disabled';
    @State() privKey: any;
    @Prop() community: any;
    @Prop() isPartner: Boolean;
    @State() openLogin: any;

    @Event({
        eventName: 'showUserDetails',
        composed: true,
        cancelable: true,
        bubbles: true,
      }) showUserDetails: EventEmitter<Boolean>;

    componentWillLoad() {        
        const {ethereum} = window;    

        if (ethereum && ethereum.isMetaMask && ethereum.selectedAddress) {
            this.isAccountDisconnected = false;
            this.buttonClass = '';
            return;
            }
        }

        componentDidLoad() {
            this.openLogin = new OpenLogin({
                clientId: "BJXCVeEgsAzBoxgaNbsOqLCPEes6L_sxgt-btQ9LYkLYmwIvyr5lqyu7rO-Go_g5wreSKBZzYcN_WT8YVbMveWM",
                network: "testnet"
            });

            console.log('hey');
          }

    handleMetamaskClick = async () => {
        const {ethereum} = window;
            try {
                await ethereum.request({ method: 'eth_requestAccounts'});
                this.isAccountDisconnected = false;
                this.buttonClass = '';
            } catch (error) {
                alert(error);
        }
    }

    handleOpenLogin = async () => {
            console.log('openLogin');
            await this.openLogin.init();

            if (this.openLogin.privKey) {
                console.log("User is already logged in. Private key: " + this.openLogin.privKey);
             }
    }

    handleUserDetailsClick() {
        this.showUserDetails.emit(true); 
      }

  render() {
        return (
            <div class="new-user-modal-window-child">
                <div class="new-user-header">
                    {this.isPartner ? 
                    <h2 style={{textDecoration: 'none', fontWeight: '500'}}>Hello, Partner!</h2> :
                        <h2>Welcome to <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>
                        {/* {this.community.name} */}
                        </span>
                    </h2>}

                    <p>First, import your Wallet, or create a brand new account.</p>
                </div>

                <div class="wallet-modal-button">
                    <button onClick={() => this.handleMetamaskClick()} class={this.isAccountDisconnected ? '' : 'activeSelection'}>
                        <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/metamask.svg"}></auth-image>
                        <p>Inject from Metamask</p>
                    </button>

                    <button 
                    // class={this.isAccountDisconnected ? '' : 'inactiveSelection'} 
                    onClick={() => this.openLogin()}>
                        <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/torus-new-user.svg"}></auth-image>
                        <p>Create New Account</p>
                    </button>
                </div>

                <button disabled={this.isAccountDisconnected} class={this.buttonClass} onClick={() => this.handleUserDetailsClick()}>Next: Introduce yourself</button>
            </div>
        )
    }
}
