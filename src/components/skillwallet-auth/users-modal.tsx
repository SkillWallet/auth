import { Component, h, State, Listen, Event, EventEmitter } from '@stencil/core';
// import {QRCode} from 'qrcode.react';
// import {QRCode} from 'react-qrcode-logo';

@Component({
  tag: 'users-modal'
})
export class UsersModal {
  @State() usersIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  

  @Event({
    eventName: 'showQR',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showQR: EventEmitter<Boolean>;

  @Event({
    eventName: 'showNewUser',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showNewUser: EventEmitter<Boolean>;

  @Listen('showLogin', { target: "body" })
  handleClick(wasClicked) {
    this.usersIsVisible = wasClicked.returnValue;
  }

  handleQRClick = () => {
    // alert('clicked!');
    // TODO: clear out the create User modal when I open the QR modal
    this.usersIsVisible = false;
    this.qrIsVisible = true;
    // this.showQR.emit(true);
  }

  handleUserClick = () => {
    // TODO: clear out the create User modal when I open the User modal
    
    // this.usersIsVisible = false;
    this.newUserIsVisible = true;
    this.showNewUser.emit(true);
    
  }

  render() {
    if (this.usersIsVisible === true) {
      return (
      <div class="topDiv">
            <div class="modalWindow">
                <div class="modal-window-child">
                    <div class="wallet-header">
                      <auth-image image={"wallet-black.svg"}></auth-image>
                        <h2>Login with</h2>
                    </div>

                    <div class="wallet-modal-button">
                        <button onClick={() => this.handleQRClick()}>
                            <auth-image></auth-image>
                            <p>SkillWallet</p>
                        </button>
                        <button onClick={() => this.handleUserClick()}>
                            <auth-image image={"plus-button-white.svg"}></auth-image>
                            <p>New User</p>
                        </button>
                    </div>
                </div>
            </div>
            {this.newUserIsVisible === true ? <new-user></new-user> : null}
        </div>
    )} else if (this.qrIsVisible === true) {
      // () => {

      // }
      return (
        <qr-modal />
      )
      // return (
        // <QRCode 
        // value="http://facebook.github.io/react/" 
        // renderAs="svg" 
        // size={128}
        // imageExcavate='true'
        // imageSettings={{
        //   src: 'https://static.zpao.com/favicon.png',
        //   x: 0,
        //   y: 0,
        //   height: 24,
        //   width: 24,
        //   excavate: true,
        // }}
        // />
        // <div></div>

      // )
    } else if (this.newUserIsVisible === true) {
      <new-user></new-user>
    }
     else {
      return (
        <div></div>
      )
    }
  }
}