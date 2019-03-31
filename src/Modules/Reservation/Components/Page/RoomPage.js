import React from 'react';
import { Row, Col, Spin, Icon, Divider, Skeleton,
  Button, Modal, notification, List, Typography } from 'antd';
import axios from 'axios';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';
import { RoomChargeStatus } from '../../../../Components/Label/Label';
import { Currency } from '../../../../Helper/Currency';

const { confirm } = Modal;
const { Title } = Typography;

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      statusFetch: null,
    };
  }

  componentDidMount() {
    this.fetchReservationRoom();
  }

  fetchReservationRoom() {
    this.setState({ statusFetch: 'loading' });
    const idReservationRoom = this.props.id;
    axios.get(`/reservation/room/${idReservationRoom}`)
    .then(res => {
      this.setState({
        data: res.data,
        statusFetch: 'success',
      })
    })
    .catch(err => {
      this.setState({ statusFetch: 'error' });
    });
  }

  submitCheckin = (id, resolve, reject) => {
    axios.put(`/reservation/checkin/${id}`)
    .then(res => {
      resolve();
      this.fetchReservationRoom();
      this.props.fetchReservation();
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
    })
    .catch(err => {
      reject();
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  confirmCheckin = (record, submitCheckin) => {
    confirm({
      title: `Do you want to check in ${record.guest.name}?`,
      okText: 'Yes',
      onOk() {
        return new Promise((resolve, reject) => {
          submitCheckin(record.id_reservation_room_guest, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  submitCheckout = (id, resolve, reject) => {
    axios.put(`/reservation/checkout/${id}`)
    .then(res => {
      resolve();
      this.fetchReservationRoom();
      this.props.fetchReservation();
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
    })
    .catch(err => {
      reject();
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  confirmCheckout = (record, submitCheckout) => {
    confirm({
      title: `Do you want to check out ${record.guest.name}?`,
      okText: 'Yes',
      onOk() {
        return new Promise((resolve, reject) => {
          submitCheckout(record.id_reservation_room_guest, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  submitRoomCharge = (id, resolve, reject) => {

    // will be dynamic in the future
    const idBill = this.props.reservation.bills[0].id_bill;
    
    axios.post(`/transaction/post_room_charge/${id}`, { id_bill: idBill })
    .then(res => {
      resolve();
      this.fetchReservationRoom();
      this.props.fetchReservation();
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
    })
    .catch(err => {
      reject();
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  confirmRoomCharge = (record, submitRoomCharge) => {

    // dynamic in the future
    const number = this.props.reservation.bills[0].number;

    confirm({
      title: `Do you want to post this room charge to ${number}?`,
      okText: 'Yes',
      onOk() {
        return new Promise((resolve, reject) => {
          submitRoomCharge(record.id_room_charge, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    const { statusFetch, data } = this.state;
    if (statusFetch === 'loading') {
      return <Skeleton />
    }
    const room = data.room || {};
    const room_guest = data.guests ? data.guests[0] : {};
    const guest = room_guest.guest || {};
    return (
      <Spin spinning={statusFetch === 'update'}>
        <Row>
          <Col>
            <Title level={3}> {room.number} <Divider type="vertical" /> <IconArrival /> { room_guest.date_arrival } <Icon type="swap-right" /> <IconDeparture /> { room_guest.date_departure } </Title>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <small>Guest</small>
            <Title level={4}> {guest.name} .{guest.title} </Title>
            <span> { guest.phone } </span> | 
            <span> { guest.email } </span> <br />
            <span> { guest.address } </span> <br />
          </Col>
          <Col span={12}>
            <small> Room Charges </small>
            <List
              size="small"
              bordered
              dataSource={data.rate ? data.rate.charges : []}
              renderItem={ch => (
                <List.Item> 
                  <div>
                    {ch.date} - {Currency(ch.amount_nett)} &nbsp;&nbsp; <RoomChargeStatus status={ch.status} />
                    { ch.status === 'pending' && room_guest.date_checkin !== null ?
                      <Button style={{ float: 'right'}} shape="round" size="small" type="primary" onClick={() => this.confirmRoomCharge(ch, this.submitRoomCharge)}> Post </Button>
                      : null 
                    }
                    </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            { room_guest.date_checkin === null ?
            <Button size="large" type="primary" icon="key" shape="round" onClick={() => this.confirmCheckin(room_guest, this.submitCheckin)}>
              Check-In
            </Button>
            : null
            }
            { room_guest.date_checkin !== null && room_guest.date_checkout === null ?
            <Button size="large" type="danger" icon="logout" shape="round" onClick={() => this.confirmCheckout(room_guest, this.submitCheckout)}>
              Check-Out
            </Button>
            : null
            }
          </Col>
        </Row>
      </Spin>
    )
  }
}

export default RoomPage;