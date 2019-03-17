import React from 'react';
import { Icon } from 'antd';

class NotFound extends React.PureComponent {
  render() {
    if (typeof window === 'undefined') {
      return null;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Icon type="meh" style={{ fontSize: '5em' }} theme="twoTone" />
        <br />
        <br />
        <h3> Opps, Page Not Found </h3>
        <h1> 404 </h1>
      </div>
    );
  }
}

export default NotFound;
