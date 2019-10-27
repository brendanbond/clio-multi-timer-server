import React, {
  Component
} from 'react';

class OAuth extends Component {

  state = {
    user: {}
  }

  componentDidMount() {

  }

  openPopup(e) {
    const url = 'https://app.clio.com/oauth/authorize?response_type=code&client_id=MYAsywFlsKfGDXOwCsH75QUKIZ527ZWFIxvWtczw&redirect_uri=https://app.clio.com/oauth/approval';
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    return window.open(url, '',
      `toolbar=no, location=no, directories=no, status=no, menubar=no,
            scrollbars=no, resizable=no, copyhistory=no, width=${width},
            height=${height}, top=${top}, left=${left}`
    );
  }

  closeCard() {
    this.setState({
      user: {}
    });
  }

  render() {
    return (
      <div>
        <button
          onClick={this.openPopup.bind(this)}
          className={'button'}
        >
          CLICK</button>
      </div>
    );
  }
}

export default OAuth;