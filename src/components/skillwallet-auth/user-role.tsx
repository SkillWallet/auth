import { Component, h, State, Event, EventEmitter, Prop, Listen } from '@stencil/core';
import { joinCommunity } from '../../utils/utils';

@Component({
  tag: 'user-role',
  styleUrl: 'skillwallet-auth.css',
  shadow: true
})
export class UserRole {
    @State() roleSelected: string = null;
    @State() isLoading: boolean = false;
    @State() buttonClass: string = 'disabled';
    @Prop() community: any;
    @Prop({mutable: true}) skill: number = 10;
    slider!: HTMLInputElement;

      @Event({
        eventName: 'showNewScreen',
        composed: true,
        cancelable: true,
        bubbles: true,
      })
      showNewScreen: EventEmitter<any>;

    @Listen('click', { capture: true })
    handleChangeEvent() {
        this.slider.addEventListener("change", function () {
        })
    }

    async handleUserQRClick() {
        this.isLoading = true;
        const tokenId = await joinCommunity(this.community.address, localStorage.getItem('username'), this.roleSelected, this.skill);
        localStorage.setItem('tokenId', tokenId);
        this.showNewScreen.emit('role'); 
      }

    handleRoleClick(role) {
        this.roleSelected = role;
        this.buttonClass = '';
    }

    updateValue(event: Event) {
        this.skill = parseInt((event.target as HTMLInputElement).value);
    }

    render() {
        return (
            <div class="user-role-modal-window-child">
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
                        <h3>Your XP Level</h3>
                        <p>Tell your Community how experienced you are in this Role!</p>
                        
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

                <button onClick={() => this.handleUserQRClick()} class={this.buttonClass} disabled={this.roleSelected === null}>That's it - join this community!</button>
            </div>
        )
    }
}