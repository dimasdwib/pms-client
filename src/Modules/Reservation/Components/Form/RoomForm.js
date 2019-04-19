import React from 'react';
import { Row, Col, Select, Form, Button, Divider } from 'antd';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';
import RoomCard from '../../../../Components/Card/RoomCard';

class RoomForm extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      feature: null,
    }
  }

  handleAddRoom = () => {
    
    const { idRoom, idRate, idBed, idRoomType } = this.state;
    const { roomAvailable, dateArrival, dateDeparture } = this.props;

    const room_type = roomAvailable.room_types.find((d) => d.id_room_type === idRoomType);
    const bed = roomAvailable.beds.find((r) => r.id_bed === idBed);
    const room = roomAvailable.rooms.find((r) => r.id_room === idRoom);
    const rate = roomAvailable.rates.find((r) => r.id_rate === idRate);

    if (!room || !rate) {
      return;
    }

    const data = {
      ...room,
      room_type,
      guests: [
        { id_guest: 1, name: 'hhehe' }
      ],
      bed,
      rate: {
        ...rate,
      },
      date_arrival: dateArrival,
      date_departure: dateDeparture,
    };

    if (this.props.onAddRoom) {
      this.props.onAddRoom(data);
    }
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
    const { roomAvailable } = this.props;

    if (roomAvailable === null) {
      return null;
    }

    const { idRoomType, idRate, idRoom, idBed } = this.state;

    return (
      <div>
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
                    <Select.Option key={rate.id_rate} value={rate.id_rate}> { rate.name } - { rate.amount_nett } </Select.Option>
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
        <Button type="primary" onClick={this.handleAddRoom}>
          Add Room
        </Button>
      </div>
    );
  };
}

export default RoomForm;