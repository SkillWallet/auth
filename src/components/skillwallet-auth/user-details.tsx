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
  @State() isLoading: boolean = false;
  @State() username: string;
  @Element() private elementHost: HTMLElement;
  @Event() onUploadCompleted: EventEmitter<Blob>;

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

  handleUserRoleClick() {
    localStorage.setItem('username', this.username);

    // removing this call for now...assuming that we don't show the username + image in button until after a successful login
    // this.userDetailsSaved.emit({image: localStorage.getItem('imageUrl'), username: this.username});
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

      const imageUrl = await pushImage(imageFile);
      localStorage.setItem('imageUrl', imageUrl);
      
      this.uploadImage(imageFile);
      this.isLoading = false;
  }

  handleInputChange(event) {
    this.isLoading = true;
    this.onInputChange(event);
  }

  private uploadImage(file) {
    const reader = new FileReader();

    reader.onload = () => {
      const imagePreviewContainer: HTMLElement = this.elementHost.shadowRoot.querySelector('#image-preview');
      imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;
      
      this.onUploadCompleted.emit(file);
    };

    reader.onerror = (err) => {
      console.error('something went wrong...', err);
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
        <div class="user-details-modal-window-child">
            {this.isLoading ? 
                <div class="item">
                  <h2>Loading</h2>  
                  <i class="loader two"></i>
                </div> : <div></div>}
            
            {this.isPartner ? 
                <div class="user-details-header">
                    <p style={{color: 'white'}}>Great! Now let's start - tell us about yourself</p>
                </div> :
              
                <div class="user-details-header">]
                    <h2>Welcome to <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{this.community.name}!</span></h2>
                    <p>Tell us about yourself</p>
                </div> }

            <div class="user-details-fields">
                <h4>Nickname</h4>
                <div class="username-field">
                {!this._userValidator.validate(this.username) ? 
                      <span class="validation-error"> {this._userValidator.errorMessage}</span> : null}
                    <form>
                      <input value={this.username} onInput={(event) => this.handleUsernameChange(event)}    type="text" placeholder="How do you want your community to call you?"></input>
                    </form>
                    <p>{this.username ? 17-this.username.length : 17} characters left</p>

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
