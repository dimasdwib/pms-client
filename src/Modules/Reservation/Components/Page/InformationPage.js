import React from 'react';
import { Row, Col, Divider, Table, Tag, Spin, Typography, Icon,
  Modal, Form, Input, Button, notification, Menu, Dropdown } from 'antd';
import Axios from 'axios';
import { Currency } from '../../../../Helper/Currency';
import { DateFormat } from '../../../../Helper/DateTime';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';
import GuestForm from '../Form/GuestForm';
import EditRoomForm from '../Form/EditRoomForm';

const { Title } = Typography;
const { confirm } = Modal;

const columnFolio = [
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Guest',
    dataIndex: 'guest',
    key: 'guest',
    render: (guest) => (
      guest.name
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (balance) => (
      <span style={{ color: balance > 0 ? 'red' : 'green' }}> { Currency(balance) } </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'closed' ? 'red' : 'green'}> { status } </Tag>
    )
  },
];

class InformationPage extends React.Component {

  columnRoom = [
    {
      title: 'Room',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Guest',
      dataIndex: 'guest',
      key: 'guest',
      render: (field, record) => (
        record.guests ? record.guests[0].guest.name : null
      ),
    },
    {
      title: 'Arrival',
      dataIndex: 'arrival',
      key: 'arrival',
      render: (field, record) => (
        record.guests ? <span><IconArrival /> { DateFormat(record.guests[0].date_arrival) } </span> : null
      ),
    },
    {
      title: 'Departure',
      dataIndex: 'departure',
      key: 'departure',
      render: (field, record) => (
        record.guests ? <span><IconDeparture /> { DateFormat(record.guests[0].date_departure) } </span> : null
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (field, record) => {
        const guest = record.guests ? record.guests[0] : {};
        if (guest.date_checkout !== null) {
          return <Tag color="red">checked-out</Tag>;        
        } else if (guest.date_checkin !== null) {
            return <Tag color="green">checked-in</Tag>;
        } else {
          return null;
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'id_reservation_room',
      key: 'id_reservation_room',
      render: (id_reservation_room, record) => {
        const menu = (
          <Menu>
            <Menu.Item>
              <a onClick={() => this.setState({ openModalRoom: true, editRoomData: record })}><Icon type="edit" /> Change Room </a>
            </Menu.Item>
            { this.props.data.rooms.length > 1 ?
            <Menu.Item>
              <a onClick={() => this.confirmDeleteRoom(record, this.deleteRoom)}><Icon type="delete" /> Delete </a>
            </Menu.Item>
            : null }
          </Menu>
        );
        return (
          <Dropdown overlay={menu}><Button icon="more" shape="circle"></Button></Dropdown>
        );
      }
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      openModalBooker: false,
      openModalNote: false,
      editRoomData: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data && prevProps.data) {
      if (this.props.data.note !== prevProps.data.note) {
        this.setState({
          note: this.props.data.note,
        });
      }
    }
  } 

  handleEditBooker = (booker) => {
    const data = {
      id_guest: booker.id_guest,
    };
    const { id_reservation } = this.props.data;
    
    Axios.put(`/reservation/${id_reservation}/booker`, data)
    .then(res => {
      this.setState({ openModalBooker: false });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.props.fetchReservation();
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  handleUpdateNote = () => {
    const { note } = this.state;
    const data = {
      note: note,
    };
    const { id_reservation } = this.props.data;
    Axios.put(`/reservation/${id_reservation}/note`, data)
    .then(res => {
      this.setState({ openModalNote: false });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.props.fetchReservation();
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  handleSelectRoom = (room) => {
    const id_reservation_room = room.id_reservation_room;
    Axios.put(`/reservation/room/${id_reservation_room}`, room)
    .then(res => {
      this.setState({ openModalRoom: false });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.props.fetchReservation();
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
    });
  }

  deleteRoom = (id, resolve, reject) => {
    Axios.delete(`/reservation/room/${id}`)
    .then(res => {
      resolve();
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.props.fetchReservation();
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

  confirmDeleteRoom = (record, deleteRoom) => {
    confirm({
      title: `Do you want to delete room${record.number}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteRoom(record.id_reservation_room, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    const { data } = this.props;
    const { editRoomData } = this.state;
    const booker = data.booker || {};

    return (
      <Spin spinning={false}>
        <Row>
          <Col>
            <Title level={3}> Information </Title>
          </Col>
        </Row>
        <Row> 
          <Col span={12}>
            <small>Booker</small> &nbsp; <a onClick={() => this.setState({ openModalBooker: true })}><Icon type="edit" /> </a>
            <Title level={4}> {booker.name} .{booker.title} </Title>
            <span> { booker.phone } </span> | 
            <span> { booker.email } </span> <br />
            <span> { booker.address } </span> <br />

            <Modal
              width='80%'
              title="Booker"
              centered
              visible={this.state.openModalBooker}
              maskClosable={false}
              onCancel={() => this.setState({ openModalBooker: false })}
              footer={null}
            >
              <GuestForm
                isOpen={this.state.openModalBooker}
                onAddGuest={this.handleEditBooker}
                data={{
                  selectedGuest: booker,
                  search: booker.name
                }}
              />
            </Modal>

          </Col>
          <Col span={12}>
            <small> Note </small> &nbsp; <a onClick={() => this.setState({ openModalNote: true })}><Icon type="edit" /> </a> <br />
            { data.note || '-' }

            <Modal
              title="Edit"
              centered
              visible={this.state.openModalNote}
              maskClosable={false}
              onCancel={() => this.setState({ openModalNote: false })}
              footer={null}
            >
              <Form>
                <Form.Item
                  label="Note"
                >
                  <Input.TextArea
                    value={this.state.note}
                    onChange={(e) => this.setState({ note: e.target.value })}
                  />
                </Form.Item>
                <Button type="primary" onClick={this.handleUpdateNote}> Update </Button>
              </Form>
            </Modal>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <Title level={4}> Room </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table 
              columns={this.columnRoom}
              dataSource={data.rooms}
              pagination={false}
              size="small"
            />
            <Modal
              width='80%'
              title="Edit Room"
              centered
              visible={this.state.openModalRoom}
              maskClosable={false}
              onCancel={() => this.setState({ openModalRoom: false, editRoomData: null })}
              footer={null}
            >
              <EditRoomForm
                isOpen={this.state.openModalRoom}
                onSelectRoom={this.handleSelectRoom}
                data={editRoomData}
                dateArrival={editRoomData === null ? '' : editRoomData.guests[0].date_arrival}
                dateDeparture={editRoomData === null ? '' : editRoomData.guests[0].date_departure}
              />
            </Modal>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <Title level={4}> Folio </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnFolio}
              dataSource={data.bills}
              pagination={false}
              size="small"
            />
          </Col>
        </Row>
      </Spin>
    )
  }
}

export default InformationPage;