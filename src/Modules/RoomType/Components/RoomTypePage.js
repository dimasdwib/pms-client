import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { RoomFoStatus, RoomHkStatus } from '../../../Components/Label/Label';
import RoomTypeForm from './RoomTypeForm';

const { confirm } = Modal;

class RoomTypePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
      editRoomType: null,
    };
  }

  columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
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
          <Button icon="edit" type="primary" onClick={() => this.setState({ openRoomForm: true, editRoom: record.id_room })} />
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

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openRoomTypeForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openRoomTypeForm: true, editRoomType: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Room Type">
        <Modal
          title="Room Type"
          centered
          visible={this.state.openRoomTypeForm}
          maskClosable={false}
          onCancel={() => this.setState({ openRoomTypeForm: false })}
          footer={null}
        >
          <RoomTypeForm
            id={this.state.editRoomType}
            onSuccess={this.onSuccess}
          />
        </Modal>
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
