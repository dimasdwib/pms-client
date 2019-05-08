import React from 'react';
import { Form, Button, Select } from 'antd';
import Axios from 'axios';
import TextField from '../../../Components/Form/TextField';

class RateForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
      description: '',
      amount_nett: '',
      id_room_type: undefined,
      roomTypeData: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    this.fetchRoomType();
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.id !== this.props.id) {
      if (this.props.id !== null) {
        this.fetchRate();
      } else {
        this.setState({
          code: '',
          name: '',
          description: '',
          amount_nett: '',
          id_room_type: undefined,
        });
      }
    }
  }

  fetchRate() {
    const { id } = this.props
    if (id && id !== null) {
      this.setState({ isLoading: true });
      Axios.get(`rate/${id}`)
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

  fetchRoomType = () => {
    Axios.get('roomtype/all')
    .then(res => {
      this.setState({
        roomTypeData: res.data,
      });
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = () => {
    const { code, name, description, amount_nett, id_room_type } = this.state;

    const data = {
      code,
      name,
      description,
      amount_nett,
      id_room_type,
    }

    if (code === '' || name === '' || description === '' || amount_nett < 0) {
      return;
    }

    let req = Axios.post('rate', data);
    if (this.props.id && this.props.id !== null) {
      req = Axios.put(`rate/${this.props.id}`, data);
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
    const { code, name, description, amount_nett, id_room_type, isLoading, roomTypeData } = this.state;
    return(
      <Form>
        <TextField
          label="Code"
          name="code"
          value={code}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Name"
          name="name"
          value={name}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Description"
          name="description"
          value={description}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Amount"
          name="amount_nett"
          value={amount_nett}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <Form.Item>
          <Select
            name="id_room_type"
            value={id_room_type}
            onChange={(id_room_type) => this.setState({ id_room_type })}
          >
            {
              roomTypeData.map(rt => (
                <Select.Option key={rt.id_room_type} value={rt.id_room_type}> { rt.code } - { rt.description } </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} disabled={code === '' || name === '' || description === '' || amount_nett < 0} loading={isLoading}> Submit </Button>
        </div>
      </Form>
    );
  }
}

export default RateForm;
