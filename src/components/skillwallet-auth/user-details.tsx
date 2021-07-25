import { Component, Event, EventEmitter, Listen, h, Prop, State, Element } from '@stencil/core';
import { pushImage } from '../../utils/textile.hub.js';

const MAX_UPLOAD_SIZE = 1024; // bytes
const ALLOWED_FILE_TYPES = 'image.*';

@Component({
  tag: 'user-details',
  styleUrl: 'skillwallet-auth.css',
  shadow: true
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

  @Element() private elementHost: HTMLElement;
  @Event() onUploadCompleted: EventEmitter<Blob>;


  public onInputChange(files: FileList) {
    if (files.length === 1) {
      const imageFile = files[0];
      if (!this.checkFileSize(imageFile.size)) {
        console.error('Maximum file size exceeded. Max file size is: ' + MAX_UPLOAD_SIZE);
        return false;
      }
      else if (!this.checkFileType(imageFile.type)) {
        console.error('File type is not allowed');
        return false;
      }
      // localStorage.setItem('image', imageFile);
      pushImage(imageFile);
      this.uploadImage(imageFile);
    } else {
      console.error(files.length === 0 ? 'No image uploaded' : 'You can oonly upload one image at a time');
      return false;
    }
  }

  private uploadImage(file) {
    const reader = new FileReader();

    reader.onload = () => {
      const imagePreviewContainer: HTMLElement = this.elementHost.shadowRoot.querySelector('#image-preview');
      imagePreviewContainer.style.backgroundImage = `url(${reader.result})`;
      
      console.log('uploading finished, emitting an image blob to the outside world');
      this.onUploadCompleted.emit(file);
    };

    reader.onerror = (err) => {
      console.error('something went wrong...', err);
    };
    reader.readAsDataURL(file);
  }

  private checkFileSize(size: number): boolean {
    return (size / MAX_UPLOAD_SIZE / MAX_UPLOAD_SIZE) <= MAX_UPLOAD_SIZE;
  }

  private checkFileType(type: string): boolean {
    return type.match(ALLOWED_FILE_TYPES).length > 0;
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
                  
                  <div class="image-upload">
                    <div class="image-upload__edit">
                      <label htmlFor="file"></label>
                      <input type="file" name="files[]" id="file" accept="image/*" class="image-upload__input"
                        onChange={($event: any) => this.onInputChange($event.target.files)} />
                    </div>

                    <div class="image-upload__preview">
                      <div id="image-preview"></div>
                    </div>

                    <p>.png or .jpg</p>
                  </div>

                  
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
