import { Component, Event, EventEmitter, Prop, h, State, Listen } from '@stencil/core';
import { getCommunity } from '../../utils/utils';
import * as buffer from 'buffer';

@Component({
  tag: 'skillwallet-auth',
  styleUrl: 'skillwallet-auth.css',
  shadow: true,
})
export class SkillwalletAuth {
  @Prop() partnerKey: string;
  @State() community: any;
  @State() displayLogin: boolean;
  @State() userUploadedImage: any = '';
  @State() icon: any = this.userUploadedImage === '' ? 
        <auth-image class="person-img" image={"https://skillwallet-demo-images.s3.us-east-2.amazonaws.com/user.svg"}></auth-image> :
        <auth-image class="person-img" image={this.userUploadedImage}></auth-image>
  
  @State() usersIsVisible: boolean = false;
  @State() qrIsVisible: boolean = false;
  @State() newUserIsVisible: boolean = false;
  @State() userDetailsAreVisible: boolean = false;
  @State() userRoleIsVisible: boolean = false;
  @State() qrText: string = null;

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
    } else {
      this.newUserIsVisible = true;
    }
  }

  render() {
    return (
        <div>
          <button class="connect-wallet-button" onClick={() => this.handleClick()}>
            {this.icon}
            <p>Connect Wallet</p>
          </button>

          {this.displayLogin ?
              <div class="background-screen" onClick={() => this.handleHideClick()}>
                <div class="topDiv">
                  <div class="modalWindow" onClick={(event) => this.handleClickPropagation(event)}>
              
              {(this.usersIsVisible === true) ? <users-modal userUploadedImage={this.userUploadedImage}></users-modal> : null}

              {this.qrIsVisible === true ? <qr-modal community={this.community} textKey={this.qrText}></qr-modal> : null}
              {this.newUserIsVisible      === true ? <new-user community={this.community}></new-user> : null}
              {this.userDetailsAreVisible === true ? 
                  <user-details 
                    community={this.community} 
                    validator={{user: {name: 'length', options: {min: 4, max: 17}}, file: {name: 'file', options: []}}}
                  ></user-details> : null}
              {this.userRoleIsVisible     === true ? <user-role community={this.community}></user-role> : null}
              </div>

          </div>
        </div> : null}
      </div>
    );
  }
}
