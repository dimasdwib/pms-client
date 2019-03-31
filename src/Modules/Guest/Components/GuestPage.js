import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';

const { confirm } = Modal;

class GuestPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Link to={AdminUrl(`/guest/${record.id_guest}`)}>
            <Button icon="edit" type="primary" />
          </Link>
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

  render() {
    return (
      <BasePage>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_guest"
              key={this.state.tableKey}
              resourceUrl={'/guest'}
              columns={this.columns}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default GuestPage;