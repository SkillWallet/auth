import { Component, Event, EventEmitter, Listen, h, State } from '@stencil/core';

@Component({
  tag: 'new-user'
})
export class NewUser {
    @State() newUserIsVisible: boolean = true;

    @Listen('showNewUser', { target: "body" })
    handleUserClick(wasClicked) {
        console.log('clicked!');
        alert(wasClicked);
        this.newUserIsVisible = wasClicked;
    }

  render() {
        return (
            <div class="topDiv">
            <div class="modalWindow">
                <div class="modal-window-child">
                    <div class="wallet-header">
                      <auth-image image={"wallet-black.svg"}></auth-image>
                        <h2>Login with</h2>
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
                </div>
            </div>
        </div>
    )
  }
}
