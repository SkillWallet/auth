import Portis from '@portis/web3';
import { Component, Event, EventEmitter, h, State, Prop } from '@stencil/core';
import { changeNetwork } from '../../utils/utils';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  tag: 'new-user',
})
export class NewUser {
  @State() isAccount: string = null;
  @State() buttonClass: string = 'disabled';
  @Prop({mutable: true}) web3Provider: any;
  @Prop() community: any;
  @Prop() isPartner: Boolean;

  @Event({
    eventName: 'showUserDetails',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showUserDetails: EventEmitter<any>;

  componentWillLoad() {
    const { ethereum } = window;

    if (ethereum && ethereum.isMetaMask && ethereum.selectedAddress) {
      this.isAccount = 'metamask';
      this.buttonClass = 'intro-button';
      this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      return;
    }
  }

  @Event({
    eventName: 'onSkillwalletError',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  onSkillwalletError: EventEmitter<null>;

  handleMetamaskClick = async () => {
    await changeNetwork();
    const { ethereum } = window;
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      this.isAccount = 'metamask';
      this.buttonClass = '';
      this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    } catch (error) {
      this.onSkillwalletError.emit();
      alert(error);
    }
  };

  handlePortisClick = async () => {
    try {
      const portis = new Portis('b86287a9-e792-4722-9487-477419f4470f', {
        nodeUrl: 'https://matic-mumbai.chainstacklabs.com/',
        chainId: '80001',
      });
      this.web3Provider = new ethers.providers.Web3Provider(portis.provider);
      this.isAccount = 'portis';
      this.buttonClass = '';
    } catch (error) {
      this.onSkillwalletError.emit();
      alert(error);
    }
  };

  handleUserDetailsClick() {
    this.showUserDetails.emit(this.web3Provider);
  }

  render() {
        return (
            <div class="new-user-modal-window-child">
                <div class="new-user-header">
                    {this.isPartner ? 
                    <h2 style={{textDecoration: 'none', fontWeight: '500'}}>Hello, Partner!</h2> :
                        <h2>Welcome to <span style={{textDecoration: 'underline'}}>
                        {this.community ? this.community.name : ''}!
                        </span>
                    </h2>}

          <h3>First, import your Wallet, or create a brand new account.</h3>
        </div>

        <div class="wallet-modal-button new-user">
          <button onClick={() => this.handleMetamaskClick()} class={this.isAccount === 'metamask' ? 'activeSelection'  : this.isAccount === null ? '' : 'inactiveSelection'}>
            <auth-image image={'https://dito-assets.s3.eu-west-1.amazonaws.com/metamask.svg'}></auth-image>
            <h4>Inject from Metamask</h4>
          </button>

          <button class={this.isAccount === 'portis' ? 'activeSelection' : this.isAccount === null ? '' : 'inactiveSelection'}
           onClick={() => this.handlePortisClick()}
          >
            <auth-image class="portis" image={'https://dito-assets.s3.eu-west-1.amazonaws.com/portis_icon.svg'}></auth-image>
            <h4>Create Social Account</h4>
          </button>
        </div>

        <button disabled={this.isAccount === null} class={this.buttonClass} onClick={() => this.handleUserDetailsClick()}>
          Next: Introduce yourself
        </button>
      </div>
    );
  }
}
