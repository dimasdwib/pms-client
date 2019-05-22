import React from 'react';
import { Row, Col, Select, Form, Button, Divider, Spin } from 'antd';
import qs from 'qs';
import axios from 'axios';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';
import RoomCard from '../../../../Components/Card/RoomCard';
import { Currency } from '../../../../Helper/Currency';

class EditRoomForm extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      feature: null,
      roomAvailable: {
        room_types: [],
        beds: [],
        rooms: [],
        rates: [],
        isLoadingRoom: null,
      },
    }
    this.fetchRoomAvailable();
  }

  handleSelectRoom = () => {
    
    const { idRoom, idRate, idBed, idRoomType, roomAvailable } = this.state;
    const { dateArrival, dateDeparture, data } = this.props;

    const room_type = roomAvailable.room_types.find((d) => d.id_room_type === idRoomType);
    const bed = roomAvailable.beds.find((r) => r.id_bed === idBed);
    const room = roomAvailable.rooms.find((r) => r.id_room === idRoom);
    const rate = roomAvailable.rates.find((r) => r.id_rate === idRate);

    if (!room || !rate) {
      return;
    }

    const roomData = {
      ...room,
      room_type,
      guests: data.guests,
      bed,
      rate: {
        ...rate,
      },
      date_arrival: dateArrival,
      date_departure: dateDeparture,
    };

    if (data.id_reservation_room) {
      roomData.id_reservation_room = data.id_reservation_room; 
    }

    if (this.props.onSelectRoom) {
      this.props.onSelectRoom(roomData);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen) {
      if (this.props.isOpen !== prevProps.isOpen) {
        this.fetchRoomAvailable();
      }
    }
  }

  fetchRoomAvailable = () => {
    const { dateArrival, dateDeparture } = this.props;
    const query = {
      date_arrival: dateArrival,
      date_departure: dateDeparture,
    };
    this.setState({ isLoadingRoom: true });
    axios.get(`/room/available?${qs.stringify(query)}`)
    .then(res => {
      this.setState({
        roomAvailable: res.data,
        isLoadingRoom: false,
      });
    })
    .catch(err => {
      this.setState({ isLoadingRoom: false });
      console.log(err);
    });
  }

  handleRoomType = (value) => {
    this.setState({ 
      idRoomType: value,
      idRoom: undefined,
      idRate: undefined,
    });
  }

  handleBed = (value) => {
    this.setState({ 
      idBed: value,
      idRoom: undefined,
    });
  }

  handleRoom = (value) => {
    this.setState({ 
      idRoom: value,
    });
  }

  handleClickRoom = (e) => {
    this.setState({
      idRoom: e.idRoom,
      idBed: e.idBed,
      idRoomType: e.idRoomType
    });
  }

  handleRate = (value) => {
    this.setState({ 
      idRate: value,
    });
  }

  render() {
    const { roomAvailable } = this.state;

    if (roomAvailable === null) {
      return null;
    }

    const { idRoomType, idRate, idRoom, idBed, isLoadingRoom } = this.state;

    return (
      <Spin spinning={isLoadingRoom}>
        <Row>
          <Col>
            <IconArrival /> {this.props.dateArrival} &nbsp; <IconDeparture /> {this.props.dateDeparture}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={6}>
            <Form.Item
              label="Room Type"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select room type"
                value={idRoomType}
                onChange={this.handleRoomType}
              >
                { 
                  roomAvailable.room_types.map(roomType => (
                    <Select.Option key={roomType.id_room_type} value={roomType.id_room_type}> { roomType.name } </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Bed"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Bed"
                value={idBed}
                onChange={this.handleBed}
              >
                { 
                  roomAvailable.beds.map(bed => (
                    <Select.Option key={bed.id_bed} value={bed.id_bed}> { bed.name } </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Room"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select room"
                value={idRoom}
                onChange={this.handleRoom}
              >
                { 
                  roomAvailable.rooms.filter(room => room.room_type.id_room_type === idRoomType && room.bed.id_bed === idBed)
                  .map(room => (
                    <Select.Option key={room.id_room} value={room.id_room}> { room.number } </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Rate"
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select rate" 
                value={idRate}
                onChange={this.handleRate}
              >
                { 
                  roomAvailable.rates.filter((rate) => rate.id_room_type === idRoomType)
                  .map(rate => (
                    <Select.Option key={rate.id_rate} value={rate.id_rate}> { rate.name } - { Currency(rate.amount_nett) } </Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col>
            <div style={{ display: 'inline-block' }}>
              {
                roomAvailable.rooms // .filter(room => room.room_type.id_room_type === idRoomType && room.bed.id_bed === idBed)
                .map(room => (
                  <RoomCard
                    key={room.id_room}
                    id={room.id_room}
                    number={room.number}
                    bed={room.bed}
                    selected={room.id_room === this.state.idRoom}
                    roomType={room.room_type}
                    onClick={this.handleClickRoom}
                  />
                ))
              }
            </div>
          </Col>
        </Row>
        <Divider />
        <Button type="primary" onClick={this.handleSelectRoom}>
          Select Room
        </Button>
      </Spin>
    );
  };
}

export default EditRoomForm;