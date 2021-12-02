import { Component, Event, EventEmitter, h, Prop, State, Element } from '@stencil/core';
import { pushImage } from '../../utils/textile.hub.js';
import { defaultValidator, getValidator } from '../../validators/validator.factory.js';
import { Validator } from '../../validators/validator.js';


@Component({
  tag: 'user-details',
  styleUrl: 'skillwallet-auth.css',
  shadow: true
})
export class UserDetails {
  @Prop() community: any;
  @Prop() userUploadedImage: any;
  @Prop() isPartner: Boolean;
  @Prop({mutable: true}) isLoading: boolean;
  @State() username: string;
  @Element() private elementHost: HTMLElement;
  @Event() uploadCompleted: EventEmitter<Blob>;

  @Prop() validator: string | any;
  @State() files: any = [];
  _userValidator: Validator<string> = defaultValidator;
  _imageValidator: Validator<string> = defaultValidator;

  @Event({
    eventName: 'showUserRole',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  showUserRole: EventEmitter<Boolean>;

  @Event({
    eventName: 'userDetailsSaved',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  userDetailsSaved: EventEmitter<any>;

  @Event({
    eventName: 'isLoadingEvent',
    composed: true,
    cancelable: true,
    bubbles: true,
  })
  isLoadingEvent: EventEmitter<Boolean>;

  handleUserRoleClick() {
    window.sessionStorage.setItem('username', this.username);

    // removing this call for now...assuming that we don't show the username + image in button until after a successful login
    // this.userDetailsSaved.emit({image: window.sessionStorage.getItem('imageUrl'), username: this.username});
    this.showUserRole.emit(true);
  }
  
  componentWillLoad()  {
    this._userValidator = getValidator(this.validator['user']);
    this._imageValidator = getValidator(this.validator['file']);
  }

  componentWillUpdate()  {
    this._userValidator = getValidator(this.validator['user']);
    this._imageValidator = getValidator(this.validator['file']);
  }

  isFormInvalid = () => {
      if (!this._userValidator.validate(this.username) || 
          !getValidator({name: 'file', options: this.files}).validate(this.files)) {
        return true;
    } else {
        return false;
    }
  }

  handleUsernameChange(event) {
    this.username = event.target.value;
  }

  public async onInputChange(files: FileList) {    
      const imageFile = files[0];
      this.files = files;
      this._imageValidator = getValidator({name: 'file', options: files});

      const imageUrl = await pushImage(imageFile, `profile.png`);
      window.sessionStorage.setItem('imageUrl', imageUrl);
      
      this.uploadImage(imageFile);
      this.isLoadingEvent.emit(false);
  }

  handleInputChange(event) {
    this.isLoadingEvent.emit(true);
    this.onInputChange(event);
  }

  private uploadImage(file) {
    const reader = new FileReader();

    reader.onload = () => {
      const imagePreviewContainer: HTMLElement = this.elementHost.shadowRoot.querySelector('#image-preview');
      imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;
      
      this.uploadCompleted.emit(file);
    };

    reader.onerror = (err) => {
      console.error('something went wrong...', err);
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
        <div class="user-details-modal-window-child">            
            {this.isPartner ? 
                <div class="user-details-header">
                    <p style={{color: 'white'}}>Great! Now let's start - tell us about yourself</p>
                </div> :
              
                <div class="user-details-header">
                    <h2>Welcome to <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{this.community ? this.community.name : ''}!</span></h2>
                    <h3>Tell us about yourself</h3>
                </div> }

            <div class="user-details-fields">
                <h4>Nickname</h4>
                
                {!this._userValidator.validate(this.username) ? 
                    <span class="validation-error"> {this._userValidator.errorMessage}</span> : null}

                <div class="username-field">
                    <div class="username-div">
                      <p>How do you want your community to call you?</p>

                      <div>
                        <form>
                          <input type="text" value={this.username} onInput={(event) => this.handleUsernameChange(event)}></input>
                        </form>
                        <p>{this.username ? 17-this.username.length : 17} characters left</p>
                      </div>
                    </div>

                </div>

                <h4>Avatar</h4>
                {!getValidator({name: 'file', options: this.files}).validate(this.files) ? 
                      <span class="validation-error"> {this._imageValidator.errorMessage}</span> : null}
                <div>
                    <div class="avatar-div">
                      <p>A public image - that's how others will see you.</p>
                      
                      <div class="image-upload">
                          <div class="image-upload__edit">
                            <label htmlFor="file"></label>
                            <input type="file" name="files[]" id="file" accept="image/*" class="image-upload__input"
                              onChange={($event: any) => this.handleInputChange($event.target.files)} />
                          </div>

                          <div class="image-upload__preview">
                            <div id="image-preview"></div>
                          </div>

                          <p>.png or .jpg</p>
                      </div>
                    </div>
                </div>
            </div>

            <button disabled={this.isLoading || this.isFormInvalid()} onClick={() => this.handleUserRoleClick()}>Next: Pick your Role</button>
        </div>
      );
    }
  }
