import React from 'react';
import { Form, Button } from 'antd';
import TextField from '../../../Components/Form/TextField';
import Axios from 'axios';

class RoomTypeForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
      description: '',
      max_adult: '',
      max_child: '',
      isLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.id !== this.props.id) {
      if (this.props.id !== null) {
        this.fetchRoomType();
      } else {
        this.setState({
          code: '',
          name: '',
          description: '',
          max_adult: '',
          max_child: '',
        });
      }
    }
  }

  fetchRoomType() {
    const { id } = this.props
    if (id && id !== null) {
      this.setState({ isLoading: true });
      Axios.get(`roomtype/${id}`)
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
    const { code, name, description, max_adult, max_child } = this.state;

    const data = {
      code,
      name,
      description,
      max_adult,
      max_child,
    }

    if (code == '' || code == 'name' || description == '') {
      return;
    }

    let req = Axios.post('roomtype', data);
    if (this.props.id && this.props.id !== null) {
      req = Axios.put(`roomtype/${this.props.id}`, data);
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
    const { code, name, description, max_adult, max_child, isLoading } = this.state;
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
          label="Max Adult"
          name="max_adult"
          value={max_adult}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <TextField
          label="Max Child"
          name="max_child"
          value={max_child}
          disabled={isLoading}
          onChange={this.handleChange}
        />
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={this.handleSubmit} disabled={code == '' || code == 'name' || description == ''} loading={isLoading}> Submit </Button>
        </div>
      </Form>
    );
  }
}

export default RoomTypeForm;
