import { Component, Event, EventEmitter, Prop, h, State, Listen } from '@stencil/core';
import { getCommunity } from '../../utils/utils';

import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @Prop({mutable: true}) partnerKey: string;
  @Prop() buttonColor: string;
  @Prop() fontColor: string;
  @Prop() borderRadius: string;

  @Prop() allowCreateNewUser: string; //prop from Partner is immutable by default

  // @Watch('allowCreateNewUser')   //TODO: validate that the partner's input type is correct or throw error
  // validateAllowCreateNewUser(newValue: string, oldValue: string) {
  //   const isBlank = typeof newValue !== 'string' || newValue === '';
  //   const has2chars = typeof newValue === 'string' && newValue.length >= 2;
  //   if (isBlank) { throw new Error('name: required') };
  //   if (!has2chars) { throw new Error('name: has2chars') };
  // }

  @State() community: any;
  @State() displayLogin: boolean;
  @State() usersIsVisible: boolean = false;
  @State() loginMenuIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  @State() userDetailsAreVisible: boolean = false;
  @State() userRoleIsVisible: boolean = false;
  @State() qrText: string = null;
  @State() storedUsername: any = null;
  @State() skillwallet: object = null;
  @State() icon: any = null;
  @State() roleSelected: any = {role: '', roleId: ''};
  @State() isPartner: boolean = false;
  @State() partnersAddress: string = null;
  @State() communityAddress: string = null;
  @State() web3Provider: any = null;
  @State() isLoading: boolean = false;

  @Event({
    eventName: 'initSkillwalletAuth',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  initSkillwalletAuth: EventEmitter<null>;

  @Event({
    eventName: 'destroySkillwalletAuth',
    composed: true,
    cancelable: false,
    bubbles: true,
  })
  destroySkillwalletAuth: EventEmitter<null>;

  componentWillLoad() {
    this.getSkillWallet();
  }

  getSkillWallet() {
    this.skillwallet = JSON.parse(window.sessionStorage.getItem('skillWallet'));

    if (this.skillwallet) {
      this.icon = this.skillwallet['imageUrl'];
      this.storedUsername = this.skillwallet['nickname'];
      this.onSkillwalletLogin.emit(true);
    }
  }

  

  async componentDidLoad() {
    console.log('PK: ', this.partnerKey);
    this.initSkillwalletAuth.emit();
    (window as any).Buffer = buffer;
    if (this.partnerKey) {
      const comm = await getCommunity(this.partnerKey);
      this.community = comm;
    }
  }

  disconnectedCallback() {
    //componentDidUnload()
    console.log('sw destroyed');
    this.destroySkillwalletAuth.emit();
  }

  @Event({
    eventName: 'showLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showLogin: EventEmitter<Boolean>;

  @Event({
    eventName: 'onSkillwalletLogin',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  onSkillwalletLogin: EventEmitter<Boolean>;

  handleHideClick() {
    if (!this.isPartner) {
      this.displayLogin = false;

      this.usersIsVisible = false;
      this.loginMenuIsVisible = false;
      this.qrIsVisible = false;
      this.newUserIsVisible = false;
      this.userDetailsAreVisible = false;
      this.userRoleIsVisible = false;
    }
  }

  handleClickPropagation(e) {
    e.stopPropagation();
  }

  @Listen('userDetailsSaved')
  handleUserDetails(details) {
    this.icon = details.detail['image'];
    this.storedUsername = details.detail['username'];
  }

  @Listen('isLoadingEvent')
  handleIsLoadingEvent(isLoading) {
    this.isLoading = isLoading.detail;
  }

  @Listen('showLoginMenu')
  showLoginMenu() {
    this.usersIsVisible = false;
    this.loginMenuIsVisible = true;
  }

  @Listen('showUserDetails')
  showUserDetails(provider) {
    this.newUserIsVisible = false;
    this.userDetailsAreVisible = true;
    this.web3Provider = provider.detail;
  }

  @Listen('showUserRole')
  showUserRole() {
    this.userDetailsAreVisible = false;
    this.userRoleIsVisible = true;
  }

  @Listen('closeModalOnLogin')
  closeModalOnLogin() {
    this.displayLogin = false;
    this.loginMenuIsVisible = false;
    this.getSkillWallet();
    this.onSkillwalletLogin.emit(true);
  }

  handleQRClick = () => {
    this.usersIsVisible = false;
    this.qrText = 'skillwallet';
    this.qrIsVisible = true;
  };

  handleClick() {
    this.displayLogin = true;
    this.usersIsVisible = true;
  }

  logOut() {
    this.handleHideClick();
    window.sessionStorage.removeItem('skillWallet');
    this.storedUsername = null;
    this.isLoading = false;
    this.onSkillwalletLogin.emit(false);
  }

  @Listen('onLogin')
  onLogin() {
    this.handleClick();
  }

  @Listen('onLogout')
  onLogout() {
    this.logOut()
  }

  @Listen('showNewScreen')
  handleNewScreen(text) {
    this.usersIsVisible = false;
    this.userRoleIsVisible = false;

    if (text.detail) {
      this.qrText = text.detail;
      this.qrIsVisible = true;
    } else if (this.isPartner === false) {
      this.newUserIsVisible = true;
    } else {
      this.userDetailsAreVisible = true;
    }
  }

  @Listen('activateSkillwalletCommunity')
  async handlePartnerFlow(event) {
    console.log(event.detail);
    this.communityAddress = event.detail.communityAddr;
    this.partnersAddress = event.detail.partnersAddr;
    this.partnerKey = event.detail.partnerKey
    console.log('PK: ', this.partnerKey);
    const comm = await getCommunity(this.partnerKey);
    this.community = comm;

    this.isPartner = true;
    this.displayLogin = true;
    this.usersIsVisible = true;
  }

  render() {
    return (
      <div>
        {this.storedUsername ? (
          <button
            // class="connect-wallet-button logged-in"
            class="connect-wallet-button"
            style={{ backgroundColor: this.buttonColor, fontColor: this.fontColor, borderRadius: this.borderRadius }}
            // disabled={true}
            onClick={() => this.logOut()}
          >
            <auth-image class="uploaded-img" image={this.icon}></auth-image>
            <p>{this.storedUsername}</p>
          </button>
        ) : (
          <button
            class="connect-wallet-button"
            style={{ backgroundColor: this.buttonColor, color: this.fontColor, borderRadius: this.borderRadius }}
            onClick={() => this.handleClick()}
          >
            <auth-image class="person-img" image={'https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/user.svg'}></auth-image>
            <p>Connect Wallet</p>
          </button>
        )}

        {this.displayLogin ? (
          <div class="background-screen" onClick={() => this.handleHideClick()}>
            {this.isLoading ? (
              <div class="item">
                <h2>Loading</h2>
                <i class="loader two"></i>
              </div>
            ) : (
              <div></div>
            )}
            <div class="topDiv">
              <div class="modalWindow" onClick={event => this.handleClickPropagation(event)}>
                {this.usersIsVisible === true ? <users-modal isPartner={this.isPartner} partnerKey={this.partnerKey} isLoading={this.isLoading}></users-modal> : null}

                {this.loginMenuIsVisible === true ? <login-menu isPartner={this.isPartner} web3Provider={this.web3Provider} community={this.community} isLoading={this.isLoading}></login-menu> : null}

                {this.qrIsVisible === true ? <qr-modal community={this.community} textKey={this.qrText} roleSelected={this.roleSelected}></qr-modal> : null}
                {this.newUserIsVisible === true ? <new-user isPartner={this.isPartner} community={this.community} web3Provider={this.web3Provider}></new-user> : null}
                {this.userDetailsAreVisible === true ? (
                  <user-details
                    isPartner={this.isPartner}
                    community={this.community}
                    isLoading={this.isLoading}
                    validator={{ user: { name: 'length', options: { min: 4, max: 17 } }, file: { name: 'file', options: [] } }}
                  ></user-details>
                ) : null}
                {this.userRoleIsVisible === true ? (
                  <user-role
                    isPartner={this.isPartner}
                    roleSelected={this.roleSelected}
                    community={this.community}
                    partnersAddress={this.partnersAddress}
                    communityAddress={this.communityAddress}
                    web3Provider={this.web3Provider}
                    validator={{ user: { name: 'commitment', options: { min: 1 } } }}
                  ></user-role>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
