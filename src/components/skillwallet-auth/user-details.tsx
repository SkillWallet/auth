import { Component, Event, EventEmitter, Listen, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'user-details',
})
export class UserDetails {
  @Prop() community: any;

  @State() username: string;
  @Event({
    eventName: 'showUserRole',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showUserRole: EventEmitter<Boolean>;

  @Listen('showUserRole', { target: 'body' })
  handleUserRoleClick() {
      console.log(this.username);
    localStorage.setItem('username', this.username);
    // console.log(document.getElementById('nickname') as any).value);
    this.showUserRole.emit(true);
  }

  handleChange(event) {
    this.username = event.target.value;
  }

  render() {
    return (
      <div class="topDiv">
        <div class="modalWindow">
          <div class="user-details-modal-window-child">
            <div class="user-details-header">
              <h2>
                Welcome to <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{this.community.name}!</span>
              </h2>
              <p>Tell us about yourself</p>
            </div>

            <div class="user-details-fields">
              <h4>Nickname</h4>
              <div>
                <form>
                  <input value={this.username} onInput={(event) => this.handleChange(event)}    type="text" placeholder="How do you want your community to call you?"></input>
                </form>
              </div>
              <h4>Avatar</h4>
              <div>
                <div class="avatar-div">
                  <p>A public image - that's how others will see you</p>
                  <div class="avatar-img"></div>
                </div>
              </div>
            </div>

            <button onClick={() => this.handleUserRoleClick()}>Next: Pick your Role</button>
          </div>
        </div>
      </div>
    );
  }
}
