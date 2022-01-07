import { Component, h, Prop, State } from '@stencil/core';
import { getActivationNonce, generateMembershipNFT, drawCanvas, getLogo } from '../../utils/utils';

@Component({
  tag: 'qr-modal',
})
export class QRModal {
  @Prop({ mutable: true }) textKey: string = null;
  @Prop() community: any;
  @Prop({ mutable: true}) roleSelected: any;
  @State() canvas: any;
  @State() demoImg: any = new Image();
  logo: any = new Image();

  @State() qrText: any;
  @State() nonce: string;
  @State() tokenId: string;
  @State() qrCodeContent: string;

  async componentWillLoad() {
    this.tokenId = window.sessionStorage.getItem('tokenId');
    this.nonce = await getActivationNonce(+this.tokenId);
    if (this.tokenId)
      this.qrCodeContent = JSON.stringify({
        tokenId: this.tokenId,
        nonce: this.nonce,
        action: 0
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

    componentDidRender() {
      getLogo(this.logo, this.community);
      drawCanvas(this.canvas, this.demoImg, this.logo, this.community);
    }

  render() {
    return (
      <div class="qr-modal-window-child">
        <canvas
          id="canvas"
          class="hidden-element"
          ref={el => {
            this.canvas = el;
          }}
        />

        <img
          class="hidden-element"
          id="test-demo-img"
          ref={el => {
            this.demoImg = el;
          }}
        />

        <div class="wallet-qr">
          <qr-code output-mode="SVG" contents={this.qrCodeContent}></qr-code>
        </div>

        <div class="wallet-text">
          <p>{this.qrText[this.textKey]}</p>
          <button class="small" onClick={() => generateMembershipNFT(this.canvas, this.demoImg, this.logo, this.community, this.roleSelected)}>Generate Membership (TEST)</button>
        </div>
      </div>
    );
  }
}
