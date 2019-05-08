import React from 'react';
import { Form, Button, Select } from 'antd';
import TextField from '../../../Components/Form/TextField';
import Axios from 'axios';

class GuestForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      title: 'mr',
      email: '',
      address: '',
      zipcode: '',
      phone: '',
      idcard: '',
      isLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.id !== this.props.id) {
      if (this.props.id !== null) {
        this.fetchGuest();
      } else {
        this.setState({
          title: 'mr',
          email: '',
          address: '',
          zipcode: '',
          phone: '',
          idcard: '',
        });
      }
    }
  }

  fetchGuest = () => {
    const { id } = this.props
    if (id && id !== null) {
      this.setState({ isLoading: true });
      Axios.get(`guest/${id}`)
      .then(res => {
        this.setState({
          isLoading: false,
          ...res.data,
        })
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = () => {
    const { name, title, email, address, zipcode, phone, idcard } = this.state;

    const data = {
      name,
      title,
      email,
      address,
      zipcode,
      phone,
      idcard,
    }

    if (name === '' || email === '') {
      return;
    }

    let req;
    if (this.props.id && this.props.id !== null) {
      req = Axios.put(`guest/${this.props.id}`, data);
    } else {
      req = Axios.post('guest', data);
    }

    this.setState({ isLoading: true });
    req.then(res => {
      this.setState({ isLoading: false });
      if (this.props.onSuccess) {
        this.props.onSuccess(res);
      }
    })
    .catch(err => {
      this.setState({ isLoading: false });
      console.log(err);
    });
  }

  render() {
    const { name, title, phone, zipcode, email, address, idcard, isLoading } = this.state;
    return(
      <Form>
        <TextField
          label="Name"
          name="name"
          value={name}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <Select
          name="title"
          value={title}
          onChange={(title) => this.setState({ title })}
        >
          <Select.Option key="mr" value="mr"> .Mr </Select.Option>
          <Select.Option key="mrs" value="mrs"> .Mrs </Select.Option>
          <Select.Option key="ms" value="ms"> .Ms </Select.Option>
        </Select>
        <TextField
          label="Email"
          name="email"
          value={email}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Phone"
          name="phone"
          value={phone}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Zipcode"
          name="zipcode"
          value={zipcode}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Address"
          name="address"
          value={address}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="ID card"
          name="idcard"
          value={idcard}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} disabled={code === '' || name === '' || description === ''} loading={isLoading}> Submit </Button>
        </div>
      </Form>
    );
  }
}

export default GuestForm;
