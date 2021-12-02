import { Component, h, State, Prop } from '@stencil/core';

@Component({
  tag: 'user-role',
  styleUrl: 'skillwallet-auth.css',
  shadow: true
})
export class UserRole {
    @Prop({mutable: true}) isLoading: boolean;
    @State() buttonClass: string = 'disabled';
    @Prop() community: any;
    @State() skill: number = 1;
    @Prop() isPartner: Boolean;
    @Prop({mutable: true}) roleSelected: any;
    @Prop() communityAddress: string = null;
    @Prop() partnersAddress: string = null;
    @Prop({mutable: true}) web3Provider: any;
    @Prop() validator: string | any;



    render() {
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
                validator={this.validator}
                ></roles-screen-new-user>}
                </div>
        )
    }
}
