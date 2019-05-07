import React from 'react';
import { Row, Col, Form, Input, Alert, Button } from 'antd';
import axios from 'axios';
import { AdminUrl } from '../../../Helper/RouteHelper';

class LoginPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLoading: false,
      message: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    const { username, password } = this.state;
    axios.post('/users/login', { username, password })
    .then(res => {
      this.setState({ isLoading: false, message: {} });
      localStorage.setItem('aToken', res.data.token);
      window.location.href = AdminUrl('/dashboard');
    })
    .catch(err => {
      if (err.response) {
        this.setState({ message: err.response.data });
      }
      this.setState({ isLoading: false });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {

    const { username, password, isLoading, message } = this.state;

    return (
      <div>
        <Row style={{ paddingTop: '8%' }}>
          <Col span={6} offset={9}>
            { message.error ? <Alert type="error" message={message.error} showIcon /> : null }
            <Form onSubmit={this.handleSubmit}>
              <Form.Item
                label="Username or Email"
              >
                <Input
                  size="large"
                  placeholder="Username"
                  value={username}
                  name="username"
                  onChange={this.handleChange}
                />
              </Form.Item>
              <Form.Item
                label="Password"
              >
                <Input
                  size="large"
                  placeholder="Password"
                  type="password"
                  value={password}
                  name="password"
                  onChange={this.handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  size="large"
                  htmlType="submit"
                  type="primary"
                  style={{ width: '100%' }}
                  loading={isLoading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div style={{ display: 'block', textAlign: 'center' }}>
              <small>Property Management System &copy; 2019</small>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LoginPage;
