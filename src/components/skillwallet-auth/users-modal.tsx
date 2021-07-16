import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'users-modal'
})
export class UsersModal {
  // @Listen('click', { capture: true });
  @Prop({mutable: true}) isVisible: boolean;

  render() {
    if (this.isVisible) {
      return (
      <div id="topDiv">
            <div id="modalWindow">
                <div class="modal-window-child">
                    <div class="wallet-header">
                      <auth-image></auth-image>
                        <h2>Login with</h2>
                    </div>

                    <div class="wallet-modal-button">
                        <button
                            // onClick={() => showNewQRModal()}
                            >
                            <auth-image></auth-image>
                            <p>SkillWallet</p>
                        </button>
                        <button
                            // onClick={() => showNewAccountModal()}
                            >
                            <auth-image></auth-image>
                            <p>New User</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )} else {
      return (
        <div></div>
      )
    }
  }
}