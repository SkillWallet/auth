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
    @Prop({mutable: true}) skill: number = 10;
    @Prop() isPartner: Boolean;



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
                ></roles-screen-partner> : 
                
                <roles-screen-new-user
                skill={this.skill}
                community={this.community}
                isPartner={this.isPartner}
                isLoading={this.isLoading}
                buttonClass={this.buttonClass}
                roleSelected={this.roleSelected}
                ></roles-screen-new-user>}
                </div>
        )
    }
}
