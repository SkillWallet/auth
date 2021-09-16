import { Component, Event, EventEmitter, h, State, Prop } from '@stencil/core';
import { changeNetwork } from '../../utils/utils';

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
    @Prop() community: any;
    @Prop() isPartner: Boolean;

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

    handleMetamaskClick = async () => {
        await changeNetwork();
        const {ethereum} = window;
            try {
                await ethereum.request({ method: 'eth_requestAccounts'});
                this.isAccountDisconnected = false;
                this.buttonClass = '';
            } catch (error) {
                alert(error);
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
                        {this.community ? this.community.name : ''}
                        </span>
                    </h2>}

                    <p>First, import your Wallet, or create a brand new account.</p>
                </div>

                <div class="wallet-modal-button">
                    <button onClick={() => this.handleMetamaskClick()} class={this.isAccountDisconnected ? '' : 'activeSelection'}>
                        <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/metamask.svg"}></auth-image>
                        <p>Inject from Metamask</p>
                    </button>

                    <button class={this.isAccountDisconnected ? '' : 'inactiveSelection'}>
                        <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/torus-new-user.svg"}></auth-image>
                        <p>Create New Account</p>
                    </button>
                </div>

                <button disabled={this.isAccountDisconnected} class={this.buttonClass} onClick={() => this.handleUserDetailsClick()}>Next: Introduce yourself</button>
            </div>
        )
    }
}
