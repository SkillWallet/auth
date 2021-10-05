import { Component, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import { changeNetwork, fetchSkillWallet } from '../../utils/utils';
import { ethers } from 'ethers';
import Portis from '@portis/web3';

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
            <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-black.svg'}></auth-image>
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
              <p>{this.isPartner ? 'New Partner' : 'Create New User'}</p>
            </button>
          </div>
        </div>
    )
  }
}
