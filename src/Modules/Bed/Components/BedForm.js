import React from 'react';
import { Form, Button, Spin, notification } from 'antd';
import TextField from '../../../Components/Form/TextField';
import Axios from 'axios';

class BedForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: '',
      name: '',
      description: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.id !== null) {
      this.fetchBed();
    } else {
      this.setState({
        code: '',
        name: '',
        description: '',
      });
    }
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.id !== this.props.id) {
      if (this.props.id !== null) {
        this.fetchBed();
      } else {
        this.setState({
          code: '',
          name: '',
          description: '',
        });
      }
    }
  }

  fetchBed() {
    const { id } = this.props
    if (id && id !== null) {
      this.setState({ isLoading: true });
      Axios.get(`bed/${id}`)
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
    const { code, name, description } = this.state;

    const data = {
      code,
      name,
      description,
    }

    if (code === '' || name === '' || description === '') {
      return;
    }

    let req;
    if (this.props.id && this.props.id !== null) {
      req = Axios.put(`bed/${this.props.id}`, data);
    } else {
      req = Axios.post('bed', data);
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
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  render() {
    const { code, name, description, isLoading } = this.state;
    return(
      <Spin spinning={isLoading}>
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
          <div style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={this.handleSubmit} disabled={code === '' || name === '' || description === ''} loading={isLoading}> Submit </Button>
          </div>
        </Form>
      </Spin>
    );
  }
}

export default BedForm;
