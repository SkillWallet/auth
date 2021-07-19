import { Component, h, State, Listen, Event, EventEmitter } from '@stencil/core';
// import {QRCode} from 'qrcode.react';
// import {QRCode} from 'react-qrcode-logo';

@Component({
  tag: 'users-modal'
})
export class UsersModal {
  @State() usersIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;

  @Event({
    eventName: 'showQR',
    composed: true,
    cancelable: true,
    bubbles: true,
  }) showQR: EventEmitter<Boolean>;

  @Listen('showLogin', { target: "body" })
  handleClick(wasClicked) {
    this.usersIsVisible = wasClicked;
  }

  handleQRClick = () => {
    alert('clicked!');
    // TODO: clear out the create User modal when I open the QR modal
    this.usersIsVisible = false;
    this.qrIsVisible = true;
    // this.showQR.emit(true);
  }

  render() {
    if (this.usersIsVisible) {
      return (
      <div id="topDiv">
            <div id="modalWindow">
                <div class="modal-window-child">
                    <div class="wallet-header">
                      <auth-image image={"wallet-black.svg"}></auth-image>
                        <h2>Login with</h2>
                    </div>

                    <div class="wallet-modal-button">
                        <button
                            onClick={() => this.handleQRClick()}
                            >
                            <auth-image></auth-image>
                            <p>SkillWallet</p>
                        </button>
                        <button
                            // onClick={() => showNewAccountModal()}
                            >
                            <auth-image image={"plus-button-white.svg"}></auth-image>
                            <p>New User</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )} else if (this.qrIsVisible) {
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
    }  else {
      return (
        <div></div>
      )
    }
  }
}

// @Component()
// class QRModal {
//   render() {
//     return (
//   )
// }}