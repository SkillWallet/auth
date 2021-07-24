import { Component, Event, EventEmitter, h,  State } from '@stencil/core';
import { getCommunity } from '../../utils/utils';
// import Web3 from 'web3';
import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @State() community: any;
  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showLogin: EventEmitter<Boolean>;
  @State() clickCount: number = 0;
  // @Prop() communityAddress: any;

  // async loadWeb3(){
  //   if(window.ethereum){
  //     window.web3 = new Web3(window.ethereum)
  //     await window.ethereum.request({ method: 'eth_requestAccounts' })
  //   }
  //   else if(window.web3){
  //     window.web3 = new Web3(window.ethereum)
  //   }
  //   else{
  //     window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
  //   }
  // }


  async componentWillRender() {
    // this.ethEnabled();
    (window as any).Buffer = buffer;
    const comm = await getCommunity();
    this.community = comm;
  }

  handleClick() {
    this.clickCount += 1;
    if (this.clickCount < 2) {
      this.showLogin.emit(true);
    }
  }

  render() {
    return (
      <div onClick={() => this.handleClick()}>
      <button class="connect-wallet-button" >
        Connect Wallet
      </button>
      <users-modal community={this.community}>
        </users-modal>
      </div>
    )
  }
}
