import { Component, Event, EventEmitter, Listen, h, State } from '@stencil/core';

@Component({
  tag: 'new-user'
})
export class NewUser {
    @State() newUserIsVisible: boolean = true;

    @Event({
        eventName: 'showUserDetails',
        composed: true,
        cancelable: true,
        bubbles: true,
      }) showUserDetails: EventEmitter<Boolean>;

    @Listen('showNewUser', { target: "body" })
    handleUserClick(wasClicked) {
        // console.log('clicked!');
        alert(wasClicked);
        this.newUserIsVisible = wasClicked;
    }

    @Listen('showUserDetails', { target: "body" })
    handleUserDetailsClick() {
        // alert('click 1 bitch');
        this.showUserDetails.emit(true); 
      }

  render() {
        return (
            <div class="topDiv">
            <div class="modalWindow">
                <div class="new-user-modal-window-child">
                    <div class="new-user-header">
                      <h2>Welcome to <span style={{textDecoration: 'underline', fontWeight: 'bold'}}>Community Name</span></h2>
                      <p>First, import your Wallet, or create a brand new account.</p>
                    </div>

                    <div class="wallet-modal-button">
                        <button 
                        // onClick={() => this.handleQRClick()}
                        >
                            <auth-image image={"metamask.svg"}></auth-image>
                            <p>Inject from Metamask</p>
                        </button>
                        <button 
                        // onClick={() => this.handleUserClick()}
                        >
                            <auth-image image={"torus-new-user.svg"}></auth-image>
                            <p>Create New Account</p>
                        </button>
                    </div>

             {/* ask Alex --> button doesn't seem necessary */}
                    <button onClick={() => this.handleUserDetailsClick()}>Next: Introduce yourself</button>
                </div>
            </div>
        </div>
    )
  }
}
