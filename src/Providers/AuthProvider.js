import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setAuthAttribute } from '../Actions/AuthAction';
import PageLoader from '../Components/Layout/Admin/PageLoader';

class AuthProvider extends React.PureComponent {
  state = {
    status: 'loading',
  };

  componentDidMount() {
    axios.get('/users/auth_attribute')
    .then(res => {
      this.props.setAuthAttribute(res.data);
      this.setState({
        status: 'authenticate',
      });
    })
    .catch(err => {
      console.log(err);
      window.localStorage.removeItem('jwtToken');
      this.setState({
        status: 'error',
      });
    });
  }

  render() {
    if (this.state.status === 'authenticate') {
      return this.props.children;
    } else if (this.state.status === 'loading') {
      return <PageLoader />
    } else if (this.state.status === 'error') {
      return <Redirect to='/login' />
    }
  }
}

function mapStateToProps(state) {
  return {
    auth: state.Auth,
  };
}

export default connect(mapStateToProps, { setAuthAttribute })(AuthProvider);