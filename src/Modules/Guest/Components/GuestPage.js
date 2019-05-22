import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import GuestForm from './GuestForm';

const { confirm } = Modal;

class GuestPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
      editGuest: null,
    };
  }

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>{text} .{record.title}</span>
      ),
    }, 
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button icon="edit" type="primary" onClick={() => this.setState({ openGuestForm: true, editGuest: record.id_guest })} />
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteGuest)} />
        </span>
      ),
    }
  ];

  deleteGuest = (id, resolve, reject) => {
    axios.delete(`/guest/${id}`)
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

  confirmDelete = (record, deleteGuest) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteGuest(record.id_guest, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openGuestForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openGuestForm: true, editGuest: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Guest">
        <Modal
          title="Guest"
          centered
          visible={this.state.openGuestForm}
          maskClosable={false}
          onCancel={() => this.setState({ openGuestForm: false })}
          footer={null}
        >
          <GuestForm
            key={this.state.editGuest}
            id={this.state.editGuest}
            onSuccess={this.onSuccess}
          />
        </Modal>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_guest"
              key={this.state.tableKey}
              resourceUrl={'/guest'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default GuestPage;