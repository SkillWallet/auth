import { Component, h, State, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'user-role'
})
export class UserRole {
    @State() roleSelected: string = null;

    @Event({
        eventName: 'showUserQR',
        composed: true,
        cancelable: true,
        bubbles: true,
      }) showUserQR: EventEmitter<String>;

    handleUserQRClick() {
        this.showUserQR.emit(); 
      }

    handleRoleClick(role) {
        this.roleSelected = role;
    }

    render() {
        return (
            <div class="topDiv">
            <div class="modalWindow">
                <div class="user-role-modal-window-child">
                    <div class="user-role-header">
                        <h2>Your Role in <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>Community Name</span></h2>
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
                                <div class="bar-chart-container"></div>

                            <div class="bar-chart-metrics">
                                <p>1</p>
                                <p>10</p>
                            </div>
                            </div>
                        </div>
                    </div> :                     
                    
                    <div class="role-fields">
                        <div class="role-button" onClick={() => this.handleRoleClick('Creator')}>
                            <div></div>
                            <p>Creator</p>
                        </div>
                        <div class="role-button" onClick={() => this.handleRoleClick('Curator')}>
                            <div></div>
                            <p>Curator</p>
                        </div>
                        <div class="role-button" onClick={() => this.handleRoleClick('Collector')}>
                            <div></div>
                            <p>Collector</p>
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