import { Component, h, State } from '@stencil/core';
// import QRCode from 'react-qrcode-logo';
import { QRCode } from 'react-qrcode-logo';
// import 'react-qrcode-logo';

// const QRCode = require('qrcode-react');

@Component({
  tag: 'qr-modal'
})
export class QRModal {
@State() qr: QRCode;

componentDidLoad() {
    this.qr = <div style={{backgroundColor: 'red', height: '1000px', width: '1000px'}}>
    {/* <QRCode
    value={"123"}
    logoImage="/metamask.svg"
    logoWidth={140}
    logoHeight={140}
    bgColor="#FFFFFF"
    size={350}
    // className="qr-code"
    ></QRCode> */}
    </div>
    // console.log(this.qr);
}

  render() {
    return (
        <div>{this.qr}</div>
    )
  }
}
