import { Component, h,  Prop, Event, EventEmitter } from '@stencil/core';
import { joinCommunity, activatePA } from '../../utils/utils';

@Component({
    tag: 'roles-screen-partner',
    styleUrl: 'skillwallet-auth.css',
    shadow: true
})
export class RolesScreenPartner {
    @Prop() roleSelected: string;
    @Prop() isLoading: boolean;
    @Prop() buttonClass: string;
    @Prop() community: any;
    @Prop() isPartner: Boolean;
    @Prop() communityAddress: string = null;
    @Prop() partnersAddress: string = null;

    @Event({
        eventName: 'showNewScreen',
        composed: true,
        cancelable: true,
        bubbles: true,
      })
      showNewScreen: EventEmitter<any>;

    handleRoleClick(role) {
        this.roleSelected = role;
        this.buttonClass = '';
    }

    async handleUserQRClick() {
        console.log('button clicked');
        this.isLoading = true;
        const tokenId = await joinCommunity(this.communityAddress, localStorage.getItem('username'), this.roleSelected, 10);
        const active = await activatePA(this.partnersAddress);
        console.log(tokenId, active);
        localStorage.setItem('tokenId', tokenId);
        this.showNewScreen.emit('role'); 
      }

    render() {
        return (
            <div class="roles-screen-partner">
            {this.isLoading ? <div class="item">
            <h2>Loading</h2>  
            <i class="loader two"></i>
            </div> : <div></div>}
        <div class="user-role-header">
            <p>Pick your Role in your Community - and let it be known for the generations to come!</p>
        </div>
                    
        
        <div class="role-fields">
            <div class="role-button" onClick={() => this.handleRoleClick('Founder')}>
                <div><div class={this.roleSelected === "Founder" ? "filled-in-circle" : "circle"}></div></div>
                <p>Founder</p>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick('Contributor')}>
                <div><div class={this.roleSelected === "Contributor" ? "filled-in-circle" : "circle"}></div></div>
                <p>Contributor</p>
            </div>

            <div class="role-button" onClick={() => this.handleRoleClick('Investor')}>
            <div><div class={this.roleSelected === "Investor" ? "filled-in-circle" : "circle"}></div></div>
                <p>Investor</p>
            </div>
        </div>

        <button 
        onClick={() => this.handleUserQRClick()} 
        class={this.buttonClass} disabled={this.isLoading}>That's it - join this community!</button></div>
        )
    }
}
                