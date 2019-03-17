import React from 'react';
import PropTypes from 'prop-types';
import { ProtectPage } from '../../../Helper/AuthHelper';

class BasePage extends React.PureComponent {
  static propTypes = {
    pageTitle: PropTypes.string,
  };

  render() {
    return (
      <ProtectPage permission={this.props.permission}>
        {this.props.children}
      </ProtectPage>
    );
  }
}

export default BasePage;
