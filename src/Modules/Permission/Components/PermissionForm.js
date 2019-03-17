import React from 'react';
import { Select, Form, Icon, Button, notification, Spin, Modal } from 'antd';
import validator from 'validator';
import { map } from 'lodash';
import TextField from '../../../Components/Form/TextField';
import axios from 'axios';

const { confirm } = Modal;

class PermissionForm extends React.Component {

  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      name: data.title || '',
      id_group: data.id_parent || null,
      errors: {},
      roles: [],
      users: [],
    };
  }

  rules = {
    name: {
      validate: () => {
        const { name, errors } = this.state;
        if (validator.isEmpty(name)) {
          errors.name = 'This field is required';
          this.setState({ errors });
          return false;
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.data.id) {
      this.fetchPermision();
    }
  }

  fetchPermision = () => {
    const { data } = this.props;
    this.setState({ permissionStatus: 'loading' });
    axios.get(`/permission/${data.id}`)
    .then(res => {
      const users = [];
      const roles = [];
      res.data.users.forEach(user => {
        users.push(user.id.toString());
      });
      res.data.roles.forEach(role => {
        roles.push(role.name);
      });
      this.setState({
        permissionData: res.data,
        permissionStatus: 'success',
        roles,
        users,
      });
    })
    .catch(err => {
      this.setState({
        permissionStatus: 'error',
      });
    });
  }

  handleChange = (e) => {
    const { errors } = this.state;
    if (errors[e.target.name] && !validator.isEmpty(errors[e.target.name])) {
      delete errors[e.target.name];
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleGroup = (e) => {
    this.setState({ id_group: e || null });
  }

  submitPermission = () => {
    const { name, id_group, roles, users } = this.state;

    let isValid = true;
    map(this.rules, rule => {
      if (rule.validate() === false) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    const data = {
      name: name,
      id_permission_group: id_group,
      roles: roles.join(','),
      users: users.join(','),
    };

    let request;
    let actType;
    if (this.props.data.id) {
      // update
      actType = 'update';
      request = axios.put(`/permission/${this.props.data.id}`, data);
    } else {
      // store
      actType = 'store';
      request = axios.post(`/permission`, data);
    }

    this.setState({ permissionStatus: 'loading' });
    request.then(res => {
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.setState({ permissionStatus: 'success' });
      if (this.props.onActionSuccess) {
        this.props.onActionSuccess({ type: actType, permission: res.data.permission });
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ permissionStatus: 'success' });
    });
  }

  handleRoles = (roles) => {
    this.setState({ roles });
  }

  handleUsers = (users) => {
    this.setState({ users });
  }

  deletePermission = (id, resolve, reject) => {
    axios.delete(`/permission/${id}`)
    .then(res => {
      resolve();
      if (this.props.onActionSuccess) {
        this.props.onActionSuccess({ type: 'delete' });
      }
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

  confirmDelete = (record, deletePermission) => {
    confirm({
      title: `Do you want to delete ${record.title}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deletePermission(record.id, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    const { name, id_group, errors, permissionStatus, roles, users } = this.state;
    const { data, groupData, userData, roleData } = this.props;

    return(
      <div>
        <h2><Icon type="safety" /> {data.title || 'Create new permission'} </h2>
        <Spin spinning={permissionStatus === 'loading'}>
          <Form>
            <TextField
              labelCol={{
                xs: { span: 24 },
                sm: { span: 6 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 18 },
              }}
              error={errors.name}
              label="Permission Name"
              placeholder="Permission Name"
              onChange={this.handleChange}
              value={name}
              name="name"
              onValidate={this.rules.name}
            />
            <Form.Item
              labelCol={{
                xs: { span: 24 },
                sm: { span: 6 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 18 },
              }}
              label="Permission Group"
            >
              <Select
                placeholder="Permission Group"
                name="group"
                value={id_group !== null ? id_group : undefined}
                onChange={this.handleGroup}
                allowClear
              >
                { 
                  groupData.map(g => {
                    return (
                      <Select.Option key={g.id} value={g.id}> { g.group } </Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: { span: 24 },
                sm: { span: 6 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 18 },
              }}
              label="Roles"
              help="The role that uses this permission (optional)"
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Roles"
                value={roles}
                onChange={this.handleRoles}
              >
                {
                  roleData.map((r) => {
                    return (
                      <Select.Option key={r.name} value={r.name}> { r.name } </Select.Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              labelCol={{
                xs: { span: 24 },
                sm: { span: 6 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 18 },
              }}
              label="Users"
              help="Users who use this permission directly (optional)"
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Users"
                value={users}
                onChange={this.handleUsers}
              >
                {
                  userData.map((u) => {
                    return (
                      <Select.Option key={u.id} value={u.id.toString()}> { u.name } </Select.Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 16,
                  offset: 6,
                },
              }}
            >
              <Button onClick={this.submitPermission} type="primary"> { data.title ? 'Update' : 'Create' } </Button>
              &nbsp;
              &nbsp;
              { data.title ? <Button icon="delete" onClick={() => this.confirmDelete(data, this.deletePermission)} type="danger"> Delete </Button> : null }
            </Form.Item>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default PermissionForm;