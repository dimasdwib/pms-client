import React from 'react';
import { Form, Button, Select, Spin, notification } from 'antd';
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
      id_floor: undefined,
      isLoading: false,
      roomTypeData: [],
      bedData: [],
      floorData: [],
    };
  }
  
  componentDidMount() {
    this.fetchAttr();
    if (this.props.id !== null) {
      this.fetchRoom();
    } else {
      this.setState({
        number: '',
        description: '',
        id_room_type: undefined,
        id_bed_type: undefined,
        id_floor: undefined,
      });
    }
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
          id_floor: undefined,
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
    Axios.get('/floor/all')
    .then(res => {
      this.setState({
        floorData: res.data,
      })
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = () => {
    const { number, id_room_type, id_bed, description, id_floor } = this.state;

    const data = {
      number,
      id_room_type,
      id_bed,
      id_floor,
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
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  render() {
    const { number, id_room_type, id_bed, id_floor, isLoading, description,
      roomTypeData, floorData, bedData } = this.state;
    return(
      <Spin spinning={isLoading}>
        <Form>
          <Form.Item
            {...this.formItemLayout}
            label="Floor"
          >
            <Select
              name="id_floor"
              value={id_floor}
              onChange={(id_floor) => this.setState({ id_floor })}
            >
              {
                floorData.map(f => (
                  <Select.Option key={f.id_floor} value={f.id_floor}> { f.name } - { f.description } </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
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
      </Spin>
    );
  }
}

export default RoomForm;
