import { Component, h,  Prop, Listen, Event, EventEmitter } from '@stencil/core';
import { joinCommunity } from '../../utils/utils';

@Component({
    tag: 'roles-screen-new-user',
    styleUrl: 'skillwallet-auth.css',
    shadow: true
})
export class RolesScreenNewUser {
    @Prop() roleSelected: string;
    @Prop() isLoading: boolean;
    @Prop() buttonClass: string;
    @Prop() community: any;
    @Prop() isPartner: Boolean;
    @Prop({mutable: true}) skill: number;
    slider!: HTMLInputElement;

    @Event({
        eventName: 'showNewScreen',
        composed: true,
        cancelable: true,
        bubbles: true,
      })
      showNewScreen: EventEmitter<any>;

    updateValue(event: Event) {
        this.skill = parseInt((event.target as HTMLInputElement).value);
    }

    @Listen('click', { capture: true })
    handleChangeEvent() {
        this.slider.addEventListener("change", function () {
        })
    }

    handleRoleClick(role) {
        this.roleSelected = role;
        this.buttonClass = '';
    }

    async handleUserQRClick() {
        this.isLoading = true;
        const tokenId = await joinCommunity(this.community.address, localStorage.getItem('username'), this.roleSelected, this.skill);
        localStorage.setItem('tokenId', tokenId);
        this.showNewScreen.emit('role'); 
      }

    render() {
        return (
        <div class="roles-screen-new-user">
            {this.isLoading ? <div class="item">
            <h2>Loading</h2>  
            <i class="loader two"></i>
            </div> : <div></div>}

        <div class="user-role-header">
            <h2>Your Role in <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>{this.community.name}</span></h2>
            <p>Pick what you're the best at & be rewarded for it!</p>
        </div>

        {(this.roleSelected) ? 
        <div>
            <div class="role-button-clicked">
                <div>
                    <div class="filled-in-circle"></div>
                </div>
                <p>{this.roleSelected}</p>
            </div>

            <div class="xp-component">
                <h3>Your <u>Commitment Level</u></h3>
                <p>Tell your Community how much time you commit to this Role! 🔐</p>
                
                <div class="bar-chart-first-container">
                    <input class="bar-chart-container" type="range" id="myRange" value="1" min="1" max="10" onChange={this.updateValue} ref={ele => this.slider = ele as HTMLInputElement}></input>
                    
                    <div class="bar-chart-metrics">
                        <p>1</p>
                        <p>10</p>
                    </div>
                </div>
                {/* <p class="slider-val">Value: <span>{this.skill}</span></p> */}
            </div>
        </div> :                     
        
        <div class="role-fields">
            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[0])}>
                <div><div class="circle"></div></div>
                <p>{this.community.roles[0]}</p>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[1])}>
                <div><div class="circle"></div></div>
                <p>{this.community.roles[1]}</p>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[2])}>
            <div><div class="circle"></div></div>
                <p>{this.community.roles[2]}</p>
            </div>
        </div>
        }

        <button 
            onClick={() => this.handleUserQRClick()} 
            class={this.buttonClass} disabled={this.isLoading}>That's it - join this community!</button>
        </div>
        )
    }
}
                