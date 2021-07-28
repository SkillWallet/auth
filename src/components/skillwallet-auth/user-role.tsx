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
    @Prop() community: any;

    @Event({
        eventName: 'showUserQR',
        composed: true,
        cancelable: true,
        bubbles: true,
      }) showUserQR: EventEmitter<String>;

    async handleUserQRClick() {
        // trigger loader...
        this.isLoading = true;
        // console.log(this.skill);
        // console.log(this.community);
        const tokenId = await joinCommunity(this.community.address, localStorage.getItem('username'), this.roleSelected, this.skill);
        localStorage.setItem('tokenId', tokenId);
        this.showUserQR.emit(); 
      }

    handleRoleClick(role) {
        this.roleSelected = role;
    }

    @Prop({mutable: true}) skill: number = 10;

    slider!: HTMLInputElement;

    @Listen('click', { capture: true })
    handleChangeEvent() {
        this.slider.addEventListener("change", function () {
        })
    }

    updateValue(event: Event) {
        console.log(this.skill);
        this.skill = parseInt((event.target as HTMLInputElement).value);
        console.log(this.skill);
    }

    render() {
        return (
            <div class="topDiv">
            {this.isLoading ? <div class="item">
              <h2>Loading</h2>  
              <i class="loader two"></i>
            </div> : <div></div>}
            <div class="modalWindow">
                <div class="user-role-modal-window-child">
                    <div class="user-role-header">
                        <h2>Your Role in <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>{this.community.name}</span></h2>
                        <p>Pick what you're the best at & be rewarded for it!</p>
                    </div>

                    {(this.roleSelected) ? 
                    <div>
                        <div class="role-button-clicked">
                            <div><div class="filled-in-circle"></div></div>
                            <p>{this.roleSelected}</p>
                        </div>

                        <div class="xp-component">
                            <h3>Your XP Level</h3>
                            <p>Tell your Community how experienced you are in this Role!</p>
                            
                            <div class="bar-chart-first-container">
                                <input class="bar-chart-container" type="range" id="myRange" value="0" min="0" max="10" onChange={this.updateValue} ref={ele => this.slider = ele as HTMLInputElement}></input>
                                
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
                            <div></div>
                            <p>{this.community.roles[0]}</p>
                        </div>
                        <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[1])}>
                            <div></div>
                            <p>{this.community.roles[1]}</p>
                        </div>
                        <div class="role-button" onClick={() => this.handleRoleClick(this.community.roles[2])}>
                            <div></div>
                            <p>{this.community.roles[2]}</p>
                        </div>
                    </div>
                    }

                    <button onClick={() => this.handleUserQRClick()}>That's it - join this community!</button>
                </div>
            </div>
        </div>
    )
  }
}