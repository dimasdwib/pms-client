import React from 'react';
import PropTypes from 'prop-types';
import { ProtectPage } from '../../../Helper/AuthHelper';
import { Typography } from 'antd';

class BasePage extends React.PureComponent {
  static propTypes = {
    pageTitle: PropTypes.string,
  };

  render() {
    return (
      <ProtectPage permission={this.props.permission}>
        <Typography.Title level={3} className="noprint"> { this.props.pageTitle || 'Page Title' } </Typography.Title>
        {this.props.children}
      </ProtectPage>
    );
  }
}

export default BasePage;
