import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { ProtectComponent } from '../../../Helper/AuthHelper';

const { confirm } = Modal;

class UserPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0,
    };
  }

  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, 
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <ProtectComponent permission={'update-users'}>
            <Link to={AdminUrl(`/user/${record.id}`)}>
              <Button icon="edit" type="primary" />
            </Link>
          </ProtectComponent>
          &nbsp;
          <ProtectComponent permission={'delete-users'}>
            <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteUser)} />
          </ProtectComponent>
        </span>
      ),
    }
  ];

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      permission: 'create-users',
      linkTo: AdminUrl('/user/create'),
    }
  ];

  deleteUser = (id, resolve, reject) => {
    axios.delete(`/users/${id}`)
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

  confirmDelete = (record, deleteUser) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteUser(record.id, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    return (
      <BasePage permission={'read-users'}>
        <Row>
          <Col span={24}>
            <ResourceTable
              key={this.state.tableKey}
              resourceUrl={'/users'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default withRouter(UserPage);
