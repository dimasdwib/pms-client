import React from 'react';
import { Row, Col, DatePicker, Modal, Divider, List,
  Form, Input, Dropdown, Button, Menu, Icon, Card, notification
} from 'antd';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import BasePage from '../../../../Components/Layout/Admin/BasePage';
import RoomForm from './RoomForm';
import PaymentForm from './PaymentForm';
import GuestForm from './GuestForm';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';
import { AdminUrl } from '../../../../Helper/RouteHelper';

class ReservationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openModalAddRoom: false,
      openModalAddPayment: false,
      openModalBooker: false,
      dateArrival: moment(),
      dateDeparture: moment().add(1, 'days'),
      night: 1,
      roomAvailable: null,
      rooms: [],
      payments: [],
      note: '',
      booker: {},
    }
  }

  componentDidMount() {
    this.fetchRoomAvailable();
  }

  fetchRoomAvailable = () => {
    const { dateArrival, dateDeparture } = this.state;
    const query = {
      date_arrival: dateArrival.format('YYYY-MM-DD'),
      date_departure: dateDeparture.format('YYYY-MM-DD'),
    };
    axios.get(`/room/available?${qs.stringify(query)}`)
    .then(res => {
      this.setState({
        roomAvailable: res.data,
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleArrival = (date, dateString) => {
    this.setState({
      dateArrival: date,
    });
  }

  handleDeparture = (date, dateString) => {
    this.setState({
      dateDeparture: date,
    });
  }

  handleAddRoom = (room) => {
    const { rooms } = this.state;
    const index = rooms.findIndex((r) => r.id_room === room.id_room);
    console.log(index, rooms, room);
    if (index > -1) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    this.setState({
      rooms,
      openModalAddRoom: false,
    });
  }

  handleRemoveRoom = (id_room) => {
    const { rooms } = this.state;
    const index = rooms.findIndex((r) => r.id_room === id_room);
    if (index > -1) {
      rooms.splice(index, 1);
      this.setState({ rooms });
    }
  }

  handleAddPayment = (payment) => {
    this.setState({

    });
  }

  handleRemovePayment = (id_payment) => {
    const { payments } = this.state;
    const index = payments.findIndex((r) => r.id_payment === id_payment);
    if (index > -1) {
      payments.splice(index, 1);
      this.setState({ payments });
    }
  }

  handleAddBooker = (booker) => {
    console.log(booker);
    this.setState({
      booker,
      openModalBooker: false,
    });
  }

  handleNight = (e) => {
    this.setState({
      night: e.target.value,
    });
  }

  handleNote = (e) => {
    this.setState({ note: e.target.value });
  }

  handleSubmitReservation = () => {
    const { dateArrival, dateDeparture, rooms, payments, booker, note } = this.state;

    const data = {
      rooms,
      payments,
      booker,
      note,
      date_arrival: dateArrival.format('YYYY-MM-DD'),
      date_departure: dateDeparture.format('YYYY-MM-DD'),
    }

    console.log(data);
    this.setState({ statusSubmit: 'loading' });
    axios.post('/reservation', data)
    .then(res => {
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.setState({ statusSubmit: null, redirect: AdminUrl(`/reservation/${res.data.reservation.id_reservation}`) });
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        })
      }
      this.setState({ statusSubmit: null });
    });
  }
  
  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={redirect} />
    }

    const { dateArrival, dateDeparture, night, roomAvailable, note, rooms, payments, booker } = this.state;
  
    return (
      <BasePage>
        <Row>
          <Col span={10}>
            <Row gutter={8}>
              <Col span={10}>
                <Form.Item
                  label={<span><IconArrival /> Arrival </span>}
                  colon={false}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    onChange={this.handleArrival}
                    value={dateArrival}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Night"
                  colon={false}
                >
                  <Input
                    size="large"
                    placeholder="Night"
                    type="number"
                    min={0}
                    onChange={this.handleNight}
                    value={night}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label={<span><IconDeparture /> Departure </span>}
                  colon={false}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    onChange={this.handleDeparture}
                    value={dateDeparture}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              { booker.id_guest ?
                <Card>
                  {booker.name} .{booker.title} <br />
                  <Icon type="phone" /> {booker.phone} <br/>
                  <Icon type="mail" /> {booker.email}
                </Card>
              :
                <Col>
                  <Button icon="user" type="dashed" block size="large" onClick={() => this.setState({ openModalBooker: true })}>
                    Booker 
                  </Button>
                  <Modal
                    width='80%'
                    title="Booker"
                    centered
                    visible={this.state.openModalBooker}
                    maskClosable={false}
                    onCancel={() => this.setState({ openModalBooker: false })}
                    footer={null}
                  >
                    <GuestForm onAddGuest={this.handleAddBooker} />
                  </Modal>
                </Col>
              }
            </Row>

            <Divider />
            { rooms.length > 0 ?
            <Row>
              <Col>
                <List
                  bordered
                  itemLayout="horizontal"
                  dataSource={rooms}
                  renderItem={(room) => { 
                    const menu = (
                      <Menu>
                        <Menu.Item>
                          <a><Icon type="edit" /> Edit</a>
                        </Menu.Item>
                        <Menu.Item>
                          <a onClick={() => this.handleRemoveRoom(room.id_room)}><Icon type="delete" /> Remove</a>
                        </Menu.Item>
                      </Menu>
                    );
                    return (
                      <List.Item actions={[ <Dropdown overlay={menu}><Button icon="more" shape="circle"></Button></Dropdown> ]}>
                        <List.Item.Meta 
                          title={`${room.room_type.name} - ${room.number}`}
                          description={room.guests[0].name}
                        />
                        <div> 
                          {room.rate.amount_nett}
                        </div>
                      </List.Item>
                    );
                  }}
                />
                <br />
              </Col>
            </Row>
            : null }
            <Row>
              <Col>  
                <Button type="dashed" block size="large" onClick={() => this.setState({ openModalAddRoom: true })}>
                  Add Room 
                </Button>
              </Col>
              <Modal
                width='80%'
                title="Add Room"
                visible={this.state.openModalAddRoom}
                maskClosable={false}
                onCancel={() => this.setState({ openModalAddRoom: false })}
                footer={null}
              >
                <RoomForm
                  onAddRoom={this.handleAddRoom}
                  roomAvailable={roomAvailable}
                  dateArrival={dateArrival.format('DD-MM-YYYY')}
                  dateDeparture={dateDeparture.format('DD-MM-YYYY')}
                />
              </Modal>
            </Row>
            
            <Divider />
            { payments.length > 0 ?
            <Row>
              <Col>
                <List
                  bordered
                  itemLayout="horizontal"
                  dataSource={payments}
                  renderItem={(payment) => {
                    const menu = (
                      <Menu>
                        <Menu.Item>
                          <a><Icon type="edit" /> Edit</a>
                        </Menu.Item>
                        <Menu.Item>
                          <a><Icon type="delete" onClick={() => this.handleRemovePayment(payment.id_payment)} /> Remove</a>
                        </Menu.Item>
                      </Menu>
                    );
                    return (
                      <List.Item actions={[ <Dropdown overlay={menu}><Button icon="more" shape="circle"></Button></Dropdown> ]}>
                        <List.Item.Meta 
                          title={`${payment.name}`}
                        />
                        <div> 
                          {payment.amount}
                        </div>
                      </List.Item>
                    )
                  }}
                />
                <br />
              </Col>
            </Row>
            : null }
            
            <Row>
              <Col>
                <Button type="dashed" block size="large" onClick={() => this.setState({ openModalAddPayment: true })}>
                  Add Payment 
                </Button>
              </Col>
              <Modal
                title="Add Payment"
                visible={this.state.openModalAddPayment}
                maskClosable={false}
                onCancel={() => this.setState({ openModalAddPayment: false })}
                footer={null}
              >
                <PaymentForm />
              </Modal>
            </Row>
            
            <Divider />
            <Row>
              <Col>
                <Form.Item>
                  <Input.TextArea 
                    value={note}
                    onChange={this.handleNote}
                    placeholder="Reservation Note"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button loading={this.state.statusSubmit === 'loading'} type="primary" block size="large" icon="file-done" shape="round" onClick={this.handleSubmitReservation}>
                  Create Reservation
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </BasePage>
    )
  }
}

export default ReservationForm;