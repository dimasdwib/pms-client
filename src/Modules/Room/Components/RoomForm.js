import React from 'react';
import { Form, Button, Select } from 'antd';
import Axios from 'axios';
import TextField from '../../../Components/Form/TextField';

class RoomForm extends React.Component {

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      number: '',
      description: '',
      id_room_type: undefined,
      id_bed_type: undefined,
      isLoading: false,
      roomTypeData: [],
      bedData: [],
    };
  }

  componentDidMount() {
    this.fetchAttr();
  }

  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.id !== this.props.id) {
      if (this.props.id !== null) {
        this.fetchRoom();
      } else {
        this.setState({
          number: '',
          description: '',
          id_room_type: undefined,
          id_bed_type: undefined,
        });
      }
    }
  }

  fetchRoom = () => {
    const { id } = this.props
    if (id && id !== null) {
      this.setState({ isLoading: true });
      Axios.get(`room/${id}`)
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

  fetchAttr = () => {
    Axios.get('/bed/all')
    .then(res => {
      this.setState({
        bedData: res.data,
      })
    });
    Axios.get('/roomtype/all')
    .then(res => {
      this.setState({
        roomTypeData: res.data,
      })
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = () => {
    const { number, id_room_type, id_bed, description } = this.state;

    const data = {
      number,
      id_room_type,
      id_bed,
      description,
    }

    if (number === '') {
      return;
    }

    let req;
    if (this.props.id && this.props.id !== null) {
      req = Axios.put(`room/${this.props.id}`, data);
    } else {
      req = Axios.post('room', data);
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
    const { number, id_room_type, id_bed, isLoading, description, roomTypeData, bedData } = this.state;
    return(
      <Form>
        <TextField
          label="Number"
          name="number"
          value={number}
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
        <Form.Item
          {...this.formItemLayout}
          label="Bed"
        >
          <Select
            name="id_bed"
            value={id_bed}
            onChange={(id_bed) => this.setState({ id_bed })}
          >
            {
              bedData.map(rt => (
                <Select.Option key={rt.id_bed} value={rt.id_bed}> { rt.code } - { rt.description } </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          {...this.formItemLayout}
          label="Room type"
        >
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
          <Button type="primary" onClick={this.handleSubmit} disabled={number === ''} loading={isLoading}> Submit </Button>
        </div>
      </Form>
    );
  }
}

export default RoomForm;
