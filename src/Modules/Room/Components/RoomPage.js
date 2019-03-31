import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';

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
      title: 'Action',
      render: (text, record) => (
        <span>
          <Link to={AdminUrl(`/room/${record.id_room}`)}>
            <Button icon="edit" type="primary" />
          </Link>
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

  render() {
    return (
      <BasePage>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_room"
              key={this.state.tableKey}
              resourceUrl={'/room'}
              columns={this.columns}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default RoomPage;