import { Component, h, Prop, State } from '@stencil/core';
import { getSkillWalletNonce } from '../../utils/utils';

@Component({
  tag: 'qr-modal',
})
export class QRModal {
  @Prop({ mutable: true }) textKey: string = null;
  @Prop() community: any;
  @State() qrText: any;
  @State() nonce: string;
  @State() tokenId: string;
  @State() qrCodeContent: string;

  async componentWillLoad() {
    this.tokenId = localStorage.getItem('tokenId');
    this.nonce = await getSkillWalletNonce(+this.tokenId);
    if (this.tokenId)
      this.qrCodeContent = JSON.stringify({
        tokenId: this.tokenId,
        nonce: this.nonce,
        action: 0
      });
    else
      this.qrCodeContent = JSON.stringify({
        nonce: this.nonce,
        action: 1
      });
      console.log(this.qrCodeContent);
  }

  componentWillRender() {
    this.qrText = {
      skillwallet: [
        'Scan with your ',
        <a href="" key={1} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
          SkillWallet App{' '}
        </a>,
        'to ',
        <b>Login</b>,
        ' to ',
        <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{this.community.name}</span>,
        '!',
      ],
      role: [
        'Now just scan with your ',
        <a href="" key={1} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
          SkillWallet App{' '}
        </a>,
        ' & Verify your Membership',
      ],
    };
  }

  render() {
    return (
      <div class="topDiv">
        <div class="modalWindow">
          <div class="qr-modal-window-child">
            <div class="wallet-qr">
              <qr-code output-mode="SVG" contents={this.qrCodeContent}></qr-code>
            </div>

            <div class="wallet-text">
              <p>{this.qrText[this.textKey]}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
