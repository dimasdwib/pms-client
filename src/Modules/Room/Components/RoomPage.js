import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { RoomFoStatus, RoomHkStatus } from '../../../Components/Label/Label';
import RoomForm from './RoomForm';

const { confirm } = Modal;

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
    };
  }

  columns = [
    {
      title: 'Room',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',
      render: (roomType) => (
        <span> { roomType ? roomType.name : null } </span>
      )
    },
    {
      title: 'Bed',
      dataIndex: 'bed',
      key: 'bed',
      render: (bed) => (
        <span> { bed ? bed.name : null } </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (fo_status, record) => (
        <span> <RoomFoStatus status={record.fo_status} /> <RoomHkStatus status={record.hk_status} /> </span>
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button icon="edit" type="primary" onClick={() => this.setState({ openRoomForm: true, editRoom: record.id_room })} />
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteRoom)} />
        </span>
      ),
    }
  ];

  deleteRoom = (id, resolve, reject) => {
    axios.delete(`/room/${id}`)
    .then(res => {
      resolve();
      this.setState({ tableKey: id});
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

  confirmDelete = (record, deleteRoom) => {
    confirm({
      title: `Do you want to delete room ${record.number}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteRoom(record.id_room, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openRoomForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openRoomForm: true, editRoom: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Room">
        <Modal
          title="Room"
          centered
          visible={this.state.openRoomForm}
          maskClosable={false}
          onCancel={() => this.setState({ openRoomForm: false })}
          footer={null}
        >
          <RoomForm
            key={this.state.editRoom}
            id={this.state.editRoom}
            onSuccess={this.onSuccess}
          />
        </Modal>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_room"
              key={this.state.tableKey}
              resourceUrl={'/room'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default RoomPage;
