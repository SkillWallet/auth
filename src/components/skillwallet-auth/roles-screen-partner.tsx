import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { joinCommunity, activatePA } from '../../utils/utils';
import { ethers } from 'ethers';


const partnerRoles = [
  {
    role: 'Founder',
    roleId: 1,
  },
  {
    role: 'Contributor',
    roleId: 2,
  },
  {
    role: 'Investor',
    roleId: 3,
  },
];
@Component({
  tag: 'roles-screen-partner',
  styleUrl: 'skillwallet-auth.scss',
  shadow: true,
})
export class RolesScreenPartner {
  @Prop() roleSelected: object = { role: '', roleId: '' };
  @Prop() isLoading: boolean;
  @Prop() buttonClass: string;
  @Prop() community: any;
  @Prop() isPartner: Boolean;
  @Prop() communityAddress: string = null;
  @Prop({ mutable: true }) skill: number;
  @Prop() partnersAddress: string = null;

  @Event({
    eventName: 'showNewScreen',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showNewScreen: EventEmitter<any>;

  @Event({
    eventName: 'isLoadingEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  isLoadingEvent: EventEmitter<Boolean>;

  handleRoleClick(role) {
    this.roleSelected = role;
    this.buttonClass = '';
  }

  async handleUserQRClick() {
    this.isLoadingEvent.emit(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('joining new member...community: ', this.community);
    const tokenId = await joinCommunity(provider, this.communityAddress, window.sessionStorage.getItem('username'), this.roleSelected, 10);
    const active = await activatePA(this.partnersAddress);
    this.isLoadingEvent.emit(false);
    console.log(tokenId, active);
    window.sessionStorage.setItem('tokenId', tokenId);
    this.showNewScreen.emit('role');
  }

  render() {
    return (
      <div class="roles-screen-partner">
        <div class="user-role-header">
          <p>Pick your Role in your Community - and let it be known for the generations to come!</p>
        </div>

        <div class="role-fields">
          {partnerRoles.map(({ role, roleId }) => {
            return (
              <button class={`role-button ${this.roleSelected['roleId'] === roleId ? 'activeSelection' : ''}`} onClick={() => this.handleRoleClick({ role, roleId })}>
                <h4>{role}</h4>
              </button>
            );
          })}
        </div>

        <div class="step-btn-wrapper">
          <button onClick={() => this.handleUserQRClick()} class={`${this.buttonClass} step-button`} disabled={this.isLoading}>
            That's it - join this community!
          </button>
        </div>
      </div>
    );
  }
}
