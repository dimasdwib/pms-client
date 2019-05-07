import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { RoomFoStatus, RoomHkStatus } from '../../../Components/Label/Label';

const { confirm } = Modal;

class RoomTypePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
    };
  }

  columns = [
    {
      title: 'COde',
      dataIndex: 'code',
      key: 'code',
    }, 
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Adult/Child',
      dataIndex: 'adultchild',
      key: 'adultchild',
      render: (adult, record) => (
        <span> { record.max_adult } / { record.max_child } </span>
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Link to={AdminUrl(`/roomtype/${record.id_room_type}`)}>
            <Button icon="edit" type="primary" />
          </Link>
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteRoom)} />
        </span>
      ),
    }
  ];

  deleteRoom = (id, resolve, reject) => {
    axios.delete(`/roomtype/${id}`)
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
      title: `Do you want to delete room type ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteRoom(record.id_room_type, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      linkTo: AdminUrl('/roomtype/create'),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Room Type">
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_room_type"
              key={this.state.tableKey}
              resourceUrl={'/roomtype'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default RoomTypePage;