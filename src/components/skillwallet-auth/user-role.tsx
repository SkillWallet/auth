import { Component, h, State, Prop } from '@stencil/core';

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
    @State() skill: number = 10;
    @Prop() isPartner: Boolean;
    @Prop() communityAddress: string = null;
    @Prop() partnersAddress: string = null;
    @Prop({mutable: true}) web3Provider: any;



    render() {
        {console.log('web3Prov', this.web3Provider)}
        return (
            <div class="user-role-modal-window-child">
                {this.isPartner ? 
                <roles-screen-partner
                    community={this.community}
                    isPartner={this.isPartner}
                    isLoading={this.isLoading}
                    buttonClass={this.buttonClass}
                    roleSelected={this.roleSelected}
                    communityAddress={this.communityAddress}
                    partnersAddress={this.partnersAddress}
                ></roles-screen-partner> : 
                
                <roles-screen-new-user
                skill={this.skill}
                community={this.community}
                isPartner={this.isPartner}
                isLoading={this.isLoading}
                buttonClass={this.buttonClass}
                roleSelected={this.roleSelected}
                web3Provider={this.web3Provider}
                ></roles-screen-new-user>}
                </div>
        )
    }
}
