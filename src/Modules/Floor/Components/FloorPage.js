import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import FloorForm from './FloorForm';

const { confirm } = Modal;

class FloorPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
      editFloor: null,
    };
  }

  columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
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
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button icon="edit" type="primary" onClick={() => this.setState({ openFloorForm: true, editFloor: record.id_floor })} />
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteFloor)} />
        </span>
      ),
    }
  ];

  deleteFloor = (id, resolve, reject) => {
    axios.delete(`/floor/${id}`)
    .then(res => {
      resolve();
      this.setState({ tableKey: this.state.tableKey + id });
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

  confirmDelete = (record, deleteFloor) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteFloor(record.id_floor, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openFloorForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openFloorForm: true, editFloor: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Floor">
        <Modal
          title="Floor"
          centered
          visible={this.state.openFloorForm}
          maskClosable={false}
          onCancel={() => this.setState({ openFloorForm: false })}
          footer={null}
        >
          <FloorForm
            key={this.state.editFloor}
            id={this.state.editFloor}
            onSuccess={this.onSuccess}
          />
        </Modal>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_floor"
              key={this.state.tableKey}
              resourceUrl={'/floor'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default FloorPage;