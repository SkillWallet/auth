import { Component, h, State, Listen, Event, EventEmitter, Prop, Element } from '@stencil/core';
import { fetchSkillWallet } from '../../utils/utils';
@Component({
  tag: 'users-modal',
})
export class UsersModal {
  @State() usersIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  @State() userDetailsAreVisible: boolean = false;
  @State() userRoleIsVisible: boolean = false;

  @Prop() community: any;
  @Prop() userUploadedImage: any;
  @Element() private elementHost: HTMLElement;

  qrText = null;

  @Event({
    eventName: 'showNewUser',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showNewUser: EventEmitter<Boolean>;

  @Listen('showLogin', { target: 'body' })
  handleClick(wasClicked) {
    this.usersIsVisible = wasClicked.returnValue;
    const backgroundImage: any = this.elementHost.children[0];
    backgroundImage.style.display = 'block';
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

  handleMetamaskClick = async () => {
    const { ethereum } = window;
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      await fetchSkillWallet(ethereum.selectedAddress);
      // this.showLogin.emit(false);

    } catch (error) {
      alert(error);
    }
  };

  handleUserClick = () => {
    this.usersIsVisible = false;
    this.newUserIsVisible = true;
    this.showNewUser.emit(true);
  };

  render() {
    return (
      <div class="background-screen">
        {this.usersIsVisible === true ? (
          <div class="topDiv">
            <div class="modalWindow">
              <div class="modal-window-child">
                <div class="wallet-header">
                  <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/wallet-black.svg'}></auth-image>
                  <h2>Login with</h2>
                </div>

                <div class="wallet-modal-button">
                  <button onClick={() => this.handleMetamaskClick()}>
                    <auth-image></auth-image>
                    <p>SkillWallet</p>
                  </button>

                  <button onClick={() => this.handleUserClick()}>
                    <auth-image image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/plus-button-white.svg'}></auth-image>
                    <p>Create New User</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {this.qrIsVisible === true ? <qr-modal community={this.community} textKey={this.qrText}></qr-modal> : null}
        {this.newUserIsVisible === true ? <new-user community={this.community}></new-user> : null}
        {this.userDetailsAreVisible === true ? (
          <user-details community={this.community} validator={{ user: { name: 'length', options: { min: 4, max: 17 } }, file: { name: 'file', options: [] } }}></user-details>
        ) : null}
        {this.userRoleIsVisible === true ? <user-role community={this.community}></user-role> : null}
      </div>
    );
  }
}
