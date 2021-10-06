import { Component, Event, EventEmitter, Prop, h, State, Listen } from '@stencil/core';
import { getCommunity } from '../../utils/utils';
import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @State() partnerKey: string = process.env.SW_PARTNER_ENV === 'production' ? process.env.PROD_PARTNER_KEY : process.env.DEV_PARTNER_KEY;

  @Prop() allowCreateNewUser: string;   //prop from Partner is immutable by default

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
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  @State() userDetailsAreVisible: boolean = false;
  @State() userRoleIsVisible: boolean = false;
  @State() qrText: string = null;
  @State() storedUsername: any = null;
  @State() skillwallet: object = null;
  @State() icon: any = null;
  @State() isPartner: boolean = false;
  @State() partnersAddress: string = null;
  @State() communityAddress: string = null;

  componentWillLoad() {
    this.getSkillWallet();
  }

  getSkillWallet() {
    this.skillwallet = JSON.parse(localStorage.getItem('skillWallet'));

    if (this.skillwallet) {
      this.icon = this.skillwallet['imageUrl'];
      this.storedUsername = this.skillwallet['nickname'];
      this.onSkillwalletLogin.emit(true);
    }
  }

  async componentDidLoad() {
    (window as any).Buffer = buffer;
    const comm = await getCommunity(this.partnerKey);
    this.community = comm;
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
    this.displayLogin = false;

    this.usersIsVisible = false;
    this.qrIsVisible = false;
    this.newUserIsVisible = false;
    this.userDetailsAreVisible = false;
    this.userRoleIsVisible = false;
  }

  handleClickPropagation(e) {
    e.stopPropagation();
  }

  @Listen('userDetailsSaved')
  handleUserDetails(details) {
    this.icon = details.detail['image'];
    this.storedUsername = details.detail['username'];
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

  @Listen('closeModalOnLogin')
  closeModalOnLogin() {
    this.displayLogin = false;
    this.onSkillwalletLogin.emit(true);
    this.getSkillWallet();
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
  handlePartnerFlow(event) {
      console.log(event.detail);
      this.communityAddress = event.detail.communityAddr;
      this.partnersAddress = event.detail.partnersAddr;

      this.isPartner = true;
      this.displayLogin = true;
      this.usersIsVisible = true;
  }

  render() {
    return (
        <div>
          {this.storedUsername ? 
              <button class="connect-wallet-button logged-in" disabled={true}>
                  {/* <auth-image class="uploaded-img" image={this.icon}></auth-image> */}
                  <p>{this.storedUsername}</p>
              </button> :

              <button class="connect-wallet-button" onClick={() => this.handleClick()}>
                  {/* <auth-image class="person-img" image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/user.svg"}></auth-image> */}
                  <p>Connect Wallet</p>
              </button>
            }

          {this.displayLogin ?
              <div class="background-screen" onClick={() => this.handleHideClick()}>
                <div class="topDiv">
                  <div class="modalWindow" onClick={(event) => this.handleClickPropagation(event)}>
              
              {(this.usersIsVisible === true) ? <users-modal isPartner={this.isPartner}></users-modal> : null}

              {this.qrIsVisible === true ? <qr-modal community={this.community} textKey={this.qrText}></qr-modal> : null}
              {this.newUserIsVisible      === true ? <new-user isPartner={this.isPartner} community={this.community}></new-user> : null}
              {this.userDetailsAreVisible === true ? 
                  <user-details 
                    isPartner={this.isPartner}
                    community={this.community} 
                    validator={{user: {name: 'length', options: {min: 4, max: 17}}, file: {name: 'file', options: []}}}
                  ></user-details> : null}
              {this.userRoleIsVisible     === true ? <user-role 
                  isPartner={this.isPartner} 
                  community={this.community}
                  partnersAddress={this.partnersAddress}
                  communityAddress={this.communityAddress}
                  validator={{user: {name: 'commitment', options: {min: 1}}}}
              ></user-role> : null}
              </div>

          </div>
        </div> : null}
      </div>
    );
  }
}
