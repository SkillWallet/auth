import { Component, h, State, Listen, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'users-modal'
})
export class UsersModal {
  @State() usersIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  @State() userDetailsAreVisible: boolean = false;
  @State() userRoleIsVisible: boolean = false;

  @Prop() community: any;
  @Prop() userUploadedImage: any;
  @Prop() usersModalIsVisible: boolean;
  
  qrText = null;

  // @Event({
  //   eventName: 'showQR',
  //   composed: true,
  //   cancelable: true,
  //   bubbles: true,
  // }) showQR: EventEmitter<Boolean>;

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
    // TODO: clear out the create User modal when I open the QR modal
    // this.usersIsVisible = false;
    this.qrText = 'skillwallet';
    this.qrIsVisible = true;
  }

  handleUserClick = () => {
    // TODO: clear out the create User modal when I open the User modal
    // this.usersIsVisible = false;
    this.newUserIsVisible = true;
    this.showNewUser.emit(true);
  }

  @Listen('showUserDetails')
  showUserDetails() {
    this.newUserIsVisible = false;
    this.userDetailsAreVisible = true;
  }

  @Listen('showUserRole')
  showUserRole() {
    this.userDetailsAreVisible = false;
    this.userRoleIsVisible = true;
  }

  @Listen('showUserQR')
  showUserQR() {
    this.qrText = 'role';
    this.userRoleIsVisible = false;
    this.qrIsVisible = true;
  }


  // FIX THIS COMMAND FLOW -- USERSISVISIBLE IS ...STILL VISIBLE
  render() {
    if (this.usersIsVisible === true) {
      return (
      <div class="topDiv">
            <div class="modalWindow">
                <div class="modal-window-child">
                    <div class="wallet-header">
                      <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-black.svg"}></auth-image>
                        <h2>Login with</h2>
                    </div>

                    <div class="wallet-modal-button">
                        <button onClick={() => this.handleQRClick()}>
                            <auth-image></auth-image>
                            <p>SkillWallet</p>
                        </button>
                        <button onClick={() => this.handleUserClick()}>
                            <auth-image image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/plus-button-white.svg"}></auth-image>
                            <p>Create New User</p>
                        </button>
                    </div>
                </div>
            </div>
            {this.qrIsVisible === true ? <qr-modal community={this.community} textKey={this.qrText}></qr-modal> : null}
    {this.newUserIsVisible === true ? <new-user community={this.community}></new-user> : null}
    {this.userDetailsAreVisible === true ? <user-details community={this.community} userUploadedImage={this.userUploadedImage}></user-details> : null}
    {this.userRoleIsVisible === true ? <user-role community={this.community}></user-role> : null}
        </div>
    )} 
  }
}