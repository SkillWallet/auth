import { Component, h, Prop } from '@stencil/core';


@Component({
  tag: 'qr-modal'
})
export class QRModal {
  @Prop({mutable: true}) textKey: string = null;
  

  qrText = {
    'skillwallet': ['Scan with your ', <a href="" key={1} style={{textDecoration: "underline",  fontWeight: "bold"}} >SkillWallet App </a>,  'to ', <b>Login</b>, ' to ',<span style={{textDecoration: "underline",  fontWeight: "bold"}}>Community Name</span>, '!'],
    'role': ['Now just scan with your ', <a href="" key={1} style={{textDecoration: "underline",  fontWeight: "bold"}} >SkillWallet App </a>, ' & Verify your Membership']
  }

  render() {
    return (
      <div class="topDiv">
      <div class="modalWindow">
          <div class="qr-modal-window-child">
              <div class="wallet-qr">
                  <qr-code
                  output-mode="SVG"
                  contents="Hello World"
                  >
                  </qr-code>
              </div>

              <div class="wallet-text">
                  <p>{this.qrText[this.textKey]}</p>
              </div>
          </div>
      </div>
  </div>
    )
  }
}
