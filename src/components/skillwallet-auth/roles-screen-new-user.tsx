import { Component, h,  Prop, State, Event, EventEmitter } from '@stencil/core';
import { joinCommunity } from '../../utils/utils';
import { defaultValidator, getValidator } from '../../validators/validator.factory.js';
import { Validator } from '../../validators/validator.js';

@Component({
    tag: 'roles-screen-new-user',
    styleUrl: 'skillwallet-auth.css',
    shadow: true
})
export class RolesScreenNewUser {
    @State() isInvalid: boolean = false;
    @Prop({mutable: true}) roleSelected: string;
    @Prop() isLoading: boolean;
    @Prop({mutable: true}) buttonClass: string;
    @Prop() community: any;
    @Prop() isPartner: Boolean;
    @Prop({mutable: true}) web3Provider: any;
    @Prop({mutable: true}) skill: number;
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

      componentWillLoad()  {
        this._commitmentValidator = getValidator(this.validator['commitment']);
      }
    
      componentWillUpdate()  {
        this._commitmentValidator = getValidator(this.validator['commitment']);
      }

    updateValue(event: Event) {
        this.skill = parseInt((event.target as HTMLInputElement).value);
            if (!getValidator({name: 'commitment', options: {min: 1}}).validate(this.skill)) {
          this.isInvalid = true;
      } else {
        this.isInvalid = false;
      }
      return this.isInvalid;
    }

    handleRoleClick(role) {
        this.roleSelected = role;
        this.buttonClass = '';
    }

    async handleUserQRClick() {
        this.isLoadingEvent.emit(true);
        const tokenId = await joinCommunity(this.web3Provider, this.community.address, localStorage.getItem('username'), this.roleSelected, this.skill);
        this.isLoadingEvent.emit(false);
        localStorage.setItem('tokenId', tokenId);
        this.showNewScreen.emit('role'); 
      }

    render() {
        return (
        <div class="roles-screen-new-user">
            <div class="user-role-header">
                <h2>Your Role in <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>{this.community.name}</span></h2>
                <h3>Pick what you're the best at & be rewarded for your commitment!</h3>
            </div>

        {(this.roleSelected) ? 
        <div class="commitment-level-parent-div">
        <div class="commitment-level-div">
            <h3>{this.roleSelected}</h3>

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
            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[0])}>
                <h4>{this.community.roles[0]}</h4>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[1])}>
                <h4>{this.community.roles[1]}</h4>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[2])}>
                <h4>{this.community.roles[2]}</h4>
            </div>
        </div>
        }

        <button 
            onClick={() => this.handleUserQRClick()} 
            class={this.buttonClass} 
            disabled={!this.roleSelected || this.isInvalid || this.isLoading}
                >That's it - join this community!</button>
        </div>
        )
    }
}
                