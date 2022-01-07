import { Component, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import Portis from '@portis/web3';
import { changeNetwork, fetchSkillWallet } from '../../utils/utils';
import { ethers } from 'ethers';
import MetamasIcon from './assets/metamask.svg';
import PortisIcon from './assets/portis_icon.svg';
@Component({
  tag: 'login-menu',
})
export class LoginMenu {
  @Prop({ mutable: true }) isLoading: boolean;
  @Prop() isPartner: Boolean;
  @Prop({ mutable: true }) web3Provider: any;
  @Prop({ mutable: true }) community;
  @State() buttonClass: string = 'disabled';

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

  @Event({
    eventName: 'onSkillwalletError',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  onSkillwalletError: EventEmitter<null>;

  handleMetamaskClick = async () => {
    this.isLoadingEvent.emit(true);
    const { ethereum } = window;
    try {
      await changeNetwork();
      await ethereum.request({ method: 'eth_requestAccounts' });
      this.web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log('asdasdasdasda');
      this.community = await fetchSkillWallet(this.web3Provider, ethereum.selectedAddress);
      console.log('sw found...', window.sessionStorage.getItem('skillWallet'));
      this.closeModalOnLogin.emit();
    } catch (error) {
      this.onSkillwalletError.emit();
      this.isLoadingEvent.emit(false);
      alert(error);
    }
  };

  handlePortisClick = async () => {
    this.isLoadingEvent.emit(true);
    try {
      const portis = new Portis('b86287a9-e792-4722-9487-477419f4470f', {
        nodeUrl: 'https://matic-mumbai.chainstacklabs.com/',
        chainId: '80001',
      });
      this.web3Provider = new ethers.providers.Web3Provider(portis.provider);
      const addresses = await this.web3Provider.listAccounts();
      this.community = await fetchSkillWallet(this.web3Provider, addresses[0]);
      this.closeModalOnLogin.emit();
    } catch (error) {
      this.onSkillwalletError.emit();
      alert(error);
    }
    this.isLoadingEvent.emit(false);
  }

  render() {
    return (
      <div class="modal-window-child">
        <div class="wallet-header login-menu">
          <h2>Welcome back! 🙌</h2>
        </div>

        <div class="login-menu-buttons-container">
          <button class="large" onClick={() => this.handleMetamaskClick()}>
            <div class="sw-icon" innerHTML={MetamasIcon}></div>
            <h4 class="btn-label">{this.isPartner ? 'Login with Metamask' : 'Login with Metamask'}</h4>
          </button>

          <button class="large" onClick={() => this.handlePortisClick()}>
            <div class="sw-icon" innerHTML={PortisIcon}></div>
            <h4 class="btn-label">{this.isPartner ? 'Use Your Password' : 'Use Your Password'}</h4>
          </button>

          <button
            // onClick={() => this.handleMetamaskClick()}
            disabled={true}
            class={`${this.buttonClass} large`}
          >
            <h4>{this.isPartner ? 'Scan QR Code' : 'Scan QR Code'}</h4>
          </button>
        </div>
      </div>
    )
  }
}
