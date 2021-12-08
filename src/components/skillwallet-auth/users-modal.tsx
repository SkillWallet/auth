import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';
import { changeNetwork, fetchSkillWallet } from '../../utils/utils';
import { ethers } from 'ethers';
import Portis from '@portis/web3';

@Component({
  tag: 'users-modal',
})
export class UsersModal {
  @Prop() isPartner: Boolean;
  @Prop() partnerKey: string;
  @Prop({mutable: true}) isLoading: boolean;
  
  @Event({
    eventName: 'showNewScreen',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showNewScreen: EventEmitter<any>;

  @Event({
    eventName: 'showLoginMenu',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showLoginMenu: EventEmitter<any>;

  @Event({
    eventName: 'closeModalOnLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  closeModalOnLogin: EventEmitter<any>;

  @Event({
    eventName: 'isLoadingEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  isLoadingEvent: EventEmitter<Boolean>;

  handleNewScreen(text) {
    this.showNewScreen.emit(text);
  }

  handleMetamaskClick = async () => {
    this.isLoadingEvent.emit(true);
    const { ethereum } = window;
    try {
      await changeNetwork();
      await ethereum.request({ method: 'eth_requestAccounts' });
      console.log(ethereum);
      // const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const portis = new Portis('b86287a9-e792-4722-9487-477419f4470f', {
        nodeUrl: 'https://matic-mumbai.chainstacklabs.com/',
        chainId: '80001',
      });
      const web3Provider = new ethers.providers.Web3Provider(portis.provider);
      const addresses = await web3Provider.listAccounts();
      await fetchSkillWallet(web3Provider, addresses[0]);
      this.closeModalOnLogin.emit(); 

    } catch (error) {
      this.isLoadingEvent.emit(false);
      alert(error);
    }
  };

  render() {
    return (
        <div class="modal-window-child">
          <div class="wallet-header">
            <auth-image class="white-wallet" image={'https://dito-assets.s3.eu-west-1.amazonaws.com/wallet-white.svg'}></auth-image>
            <h2>{this.isPartner ? 'I am a...' : 'Login with'}</h2>
          </div>

          <div class="wallet-modal-button users-modal">
            <button onClick={() => this.showLoginMenu.emit()}>
              <auth-image></auth-image>
              <h4>{this.isPartner ? 'Existing Partner' : 'SkillWallet'}</h4>
            </button>

            <button onClick={() => this.handleNewScreen(null)} disabled={this.partnerKey === undefined ? true : false}>
              <auth-image image={'https://dito-assets.s3.eu-west-1.amazonaws.com/plus-button-white.svg'}></auth-image>
              <h4>{this.isPartner ? 'New Partner' : 'New User'}</h4>
            </button>
          </div>
        </div>
    )
  }
}
