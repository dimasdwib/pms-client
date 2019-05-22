import React from 'react';
import { Card } from 'antd';

class DashboardPanel extends React.PureComponent {

  render() {
    return (
      <Card>
        <b> {this.props.title} </b>
        <br />
        <span style={{ fontSize: '2em' }}> {this.props.value} </span>
      </Card>
    );
  }
}

export default DashboardPanel;