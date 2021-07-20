import { Component, h, State } from '@stencil/core';


@Component({
  tag: 'qr-modal'
})
export class QRModal {

  render() {
    return (
      <div class="topDiv">
      <div class="modalWindow">
          <div class="modal-window-child">
              <div class="wallet-qr">
                  <qr-code
                  output-mode="SVG"
                  contents="Hello World"
                  >
                  </qr-code>
              </div>

              <div class="wallet-text">
                <p>Scan with your SkillWallet App to Login in Community Name!</p>
              </div>
          </div>
      </div>
  </div>
    )
  }
}
