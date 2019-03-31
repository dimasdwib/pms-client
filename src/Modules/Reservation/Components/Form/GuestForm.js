import React from 'react';
import { Row, Col, Form, Button, notification, Spin, Tabs } from 'antd';
import TextField from '../../../../Components/Form/TextField';
import axios from 'axios';

class GuestForm extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      statusSubmit: null,
      name: '',
      title: '',
      email: '',
      phone: '',
      idcard: '',
      address: '',
      zipcode: '',
      id_country: '',
      id_state: '',
      id_city: '',
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = () => {
    const { name, phone, email, address, idcard, title, zipcode } = this.state;
    const data = {
      name,
      phone,
      email,
      zipcode,
      address,
      idcard,
      title,
    };

    this.setState({ statusSubmit: 'loading' });
    axios.post('/guest', data)
    .then(res => {
      this.setState({ statusSubmit: null });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      if (this.props.onAddGuest) {
        this.props.onAddGuest(res.data.guest);
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ statusSubmit: null });
    });
  }

  render() {
    const { name, idcard, phone, address, zipcode, email } = this.state;
    return (
      <Spin spinning={this.state.statusSubmit === 'loading'}>
        <Tabs defaultActiveKey="create">
          <Tabs.TabPane tab="Find" key='find'>
            Search
          </Tabs.TabPane>
          <Tabs.TabPane tab="Create new" key='create'>
            <Row>
              <Col span={12}>
                <Row>
                  <Col>
                    <Form layout="inline">
                      <TextField 
                        label="Name"
                        placeholder="Name"
                        name="name"
                        onChange={this.handleChange}
                        value={name}
                      />
                      <TextField 
                        label="Title"
                        placeholder="Title"
                      />
                    </Form>
                  </Col>
                </Row>
                <TextField 
                  label="Phone"
                  placeholder="Phone"
                  name="phone"
                  onChange={this.handleChange}
                  value={phone}
                />
                <TextField 
                  label="Email"
                  placeholder="Email"
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                />
                <TextField  
                  label="ID Card"
                  placeholder="ID Card"
                  name="idcard"
                  onChange={this.handleChange}
                  value={idcard}
                />
              </Col>
              <Col span={12}>
                <TextField 
                  label="Address"
                  placeholder="Address"
                  name="address"
                  onChange={this.handleChange}
                  value={address}
                />
                <TextField 
                  label="Zipcode"
                  placeholder="Zipcode"
                  name="zipcode"
                  onChange={this.handleChange}
                  value={zipcode}
                />
                <TextField 
                  label="Country"
                  placeholder="Country"
                />
                <TextField 
                  label="State"
                  placeholder="State"
                />
                <TextField 
                  label="City"
                  placeholder="City"
                />
              </Col>
            </Row>
            <Button type="primary" onClick={this.handleSubmit}>
              Add new
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    );
  };
}

export default GuestForm;