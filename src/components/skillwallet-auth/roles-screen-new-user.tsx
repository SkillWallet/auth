import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { joinCommunity, isCoreTeamMember } from '../../utils/utils';
import { defaultValidator, getValidator } from '../../validators/validator.factory.js';
import { Validator } from '../../validators/validator.js';


const rolesIds = {
  Founder: 1,
  Contributor: 2,
  Investor: 3,
}

@Component({
  tag: 'roles-screen-new-user',
  styleUrl: 'skillwallet-auth.scss',
  shadow: true
})
export class RolesScreenNewUser {
  @State() isInvalid: boolean = false;
  @State() memberRoles: any = [];
  @Prop({ mutable: true }) roleSelected: object = { role: '', roleId: '' };
  @Prop() isLoading: boolean;
  @Prop({ mutable: true }) buttonClass: string;
  @Prop() community: any;
  @Prop() isPartner: Boolean;
  @Prop({ mutable: true }) web3Provider: any;
  @Prop({ mutable: true }) skill: number;
  slider!: HTMLInputElement;
  @Prop() validator: string | any;
  _commitmentValidator: Validator<string> = defaultValidator;


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

  componentWillLoad() {
    this._commitmentValidator = getValidator(this.validator['commitment']);
    this.assignMemberRoles();
  }

  componentWillUpdate() {
    this._commitmentValidator = getValidator(this.validator['commitment']);
  }

  updateValue(event: Event) {
    this.skill = parseInt((event.target as HTMLInputElement).value);
    if (!getValidator({ name: 'commitment', options: { min: 1 } }).validate(this.skill)) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }
    return this.isInvalid;
  }

  async assignMemberRoles() {
    console.log(this.community);
    const isCoreMember = await isCoreTeamMember(this.community.address, window.ethereum.selectedAddress);
    const roles = this.community?.roles?.roles || [];
    const newUserRolesBaseId = 4;
    console.log('isCoreMember: -----', isCoreMember);
    this.memberRoles = roles
      .filter(r => r.isCoreTeamMember === isCoreMember)
      .map((curr, index) => {
        const roleName = curr.roleName;
        const id = rolesIds[roleName];
        if (id) {
          curr.roleId = id;
        } else {
          curr.roleId = newUserRolesBaseId + index;
        }
        return curr;
      });
    console.log('Members Roles: ----', this.memberRoles);
  }

  handleRoleClick(role) {
    console.log('comm ', this.community);
    console.log('clicked', role);
    this.roleSelected = role;
    this.buttonClass = '';
  }

  async handleUserQRClick() {
    this.isLoadingEvent.emit(true);
    const tokenId = await joinCommunity(this.web3Provider, this.community.address, window.sessionStorage.getItem('username'), this.roleSelected, this.skill);
    this.isLoadingEvent.emit(false);
    window.sessionStorage.setItem('tokenId', tokenId);
    this.showNewScreen.emit('role');
  }

  render() {
    return (
      <div class="roles-screen-new-user">
        <div class="user-role-header">
          <h2>Your Role in <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{this.community.name}</span></h2>
          <h3>Pick what you're the best at & be rewarded for your commitment!</h3>
        </div>

        {(this.roleSelected['role'] !== '') ?
          <div class="commitment-level-parent-div">
            <div class="commitment-level-div">
              <div class="commitment-level-text">
                <h3>{this.roleSelected['role']}</h3>
              </div>

              <div class="xp-component">
                <h4>Your <u>Commitment Level</u></h4>
                <p>Tell your Community how much time you commit to this Role!</p>
                {(this.isInvalid) ? <span class="validation-error"> Your commitment level must be atleast 1</span> : null}

                <div class="bar-chart-first-container">
                  <input class="bar-chart-container" type="range" id="myRange" min="1" max="10" value={this.skill} onChange={(e) => this.updateValue(e)} ref={ele => this.slider = ele as HTMLInputElement}></input>

                  <div class="bar-chart-metrics">
                    <p>1</p>
                    <p>10</p>
                  </div>
                </div>
                {/* <p class="slider-val">Value: <span>{this.skill}</span></p> */}
              </div>
            </div>
          </div> :

          <div class="role-fields">
            {this.memberRoles.map(({ roleName, roleId }) => {
              return (<button class="role-button" onClick={() => this.handleRoleClick({ role: roleName, roleId })}>
                <h4>{roleName}</h4>
              </button>)
            })}
          </div>
        }


        <div class="step-btn-wrapper">
          <button
            onClick={() => this.handleUserQRClick()}
            class={`${this.buttonClass} step-button`}
            disabled={this.roleSelected['role'] === '' || this.isInvalid || this.isLoading}

          >
            That's it - join this community!</button>
        </div>

      </div>
    )
  }
}
