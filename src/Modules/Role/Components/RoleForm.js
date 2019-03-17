import React from 'react';
import { Row, Col, Input, Form, Checkbox,
  Icon, Spin, Tree, Button, Divider, notification, Modal } from 'antd';
import axios from 'axios';
import { map } from 'lodash';
import validator from 'validator';
import TextField from '../../../Components/Form/TextField';

const { TreeNode } = Tree;
const { confirm } = Modal;

class RoleForm extends React.Component {

  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      name: data.name || '',
      users: [],
      errors: {},
      permissions: [],
      searchPermission: '',
      searchUser: '',
      autoExpandParent: true,
    }
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
      this.fetchRole();
    }
  }

  onCheckPermission = (checkedKeys, info) => {
    const permissions = [];
    info.checkedNodes.forEach(node => {
      if (node.props.dataRef.type === 'permission') {
        permissions.push(node.props.dataRef.title);
      }
    });
    this.setState({ 
      checkedPermissions: checkedKeys,
      permissions,
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  getParentKey = (tree, search, expandKey) => {
    if (validator.isEmpty(search.toString())) {
      return [];
    }

    const res = expandKey || [];
    tree.forEach((d) => {
      if (d.title.toLowerCase().search(search.toLowerCase()) > -1) {
        if (d.key_parent !== null && res.indexOf(d.key_parent) === -1) {
          res.push(d.key_parent);
        }
      }
      if (d.type === 'group' && d.children.length > 0) {
        this.getParentKey(d.children, search, res);
      }
    });

    return res;
  }

  handleSearchPermission = (e) => {
    const expandedKeys = this.getParentKey(this.props.treeData, e.target.value);
    this.setState({
      searchPermission: e.target.value,
      expandedKeys,
      autoExpandParent: true,
    });
  }

  handleSearchUser = (e) => {
    this.setState({
      searchUser: e.target.value,
    });
  }

  renderTreeNodes = (data) => {
    const res = data.map((item) => {
      const { searchPermission: search } = this.state;
      const index = item.title.toLowerCase().indexOf(search.toLowerCase());
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + search.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ backgroundColor: 'yellow' }}>{item.title.substr(index, search.length)}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>;
  
      if (item.children) {
        return (
          <TreeNode title={title} key={item.key} dataRef={item} icon={<Icon type="folder" />}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} title={title} dataRef={item} icon={item.type === 'group' ? <Icon type="folder" /> : <Icon type="safety" />} />;
    }).filter((arr) => { return arr !== null });

    return res;
  }

  renderCheckbox = () => {
    const { searchUser, users } = this.state;
    const { userData } = this.props;
    return map(userData, user => {
      const index = user.name.toLowerCase().indexOf(searchUser.toLowerCase());
      if (index === -1) {
        return null;
      }
      const beforeStr = user.name.substr(0, index);
      const afterStr = user.name.substr(index + searchUser.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ backgroundColor: 'yellow' }}>{user.name.substr(index, searchUser.length)}</span>
          {afterStr}
        </span>
      ) : <span>{user.name}</span>;
      return (
        <div
          style={{ margin: 6 }}
          key={user.id}
        >
          <Checkbox
            value={user.id.toString()}
            checked={users.includes(user.id.toString())}
            onChange={this.handleCheckUser}
          > {title} </Checkbox>
          <br />
        </div>
      )
    });
  }

  submitRole = () => {
    const { name, permissions, users } = this.state;

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
      name,
      permissions: permissions.join(','),
      users: users.join(','),
    };

    let request;
    let actType;
    if (this.props.data.id) {
      // update
      actType = 'update';
      request = axios.put(`role/${this.props.data.id}`, data);
    } else {
      // store
      actType = 'store';
      request = axios.post(`role`, data);      
    }

    this.setState({ roleStatus: 'loading' });
    request.then(res => {
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.setState({ roleStatus: 'success' });
      if (this.props.onActionSuccess) {
        this.props.onActionSuccess({ type: actType, role: res.data.role });
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ roleStatus: 'success' });
    });
  }

  fetchRole = () => {
    this.setState({ roleStatus: 'loading' });
    axios.get(`role/${this.props.data.id}`)
    .then(res => {
      const users = [];
      const permissions = [];
      const checkedPermissions = [];
      res.data.users.forEach(user => {
        users.push(user.id.toString());
      });
      res.data.permissions.forEach(permission => {
        permissions.push(permission.name);
        checkedPermissions.push(`permission_${permission.id}`);
      });
      this.setState({
        users,
        permissions,
        checkedPermissions,
        name: res.data.name,
        roleStatus: 'success',
      });
    })
    .catch(err => {
      this.setState({ roleStatus: 'error' });
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

  handleCheckUser = (e) => {
    const { users } = this.state;
    if (e.target.checked) {
      if (users.indexOf(e.target.value) === -1) {
        users.push(e.target.value);
      }
    } else {
      if (users.indexOf(e.target.value) !== -1) {
        users.splice(users.indexOf(e.target.value), 1);
      }
    }
    this.setState({ users });
  }

  deleteRole = (id, resolve, reject) => {
    axios.delete(`/role/${id}`)
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

  confirmDelete = (record, deleteRole) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteRole(record.id, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    const { roleStatus, errors, name, checkedPermissions,
      searchPermission, searchUser } = this.state;
    const { data, treeData } = this.props;
    return(
      <div>
        <h2><Icon type="file-protect" /> {data.name || 'Create new role'} </h2>
        <Spin spinning={roleStatus === 'loading'}>
          <Form>
            <TextField
              labelCol={{
                xs: { span: 24 },
                sm: { span: 5 },
              }}
              wrapperCol={{
                xs: { span: 24 },
                sm: { span: 19 },
              }}
              error={errors.name}
              label="Role Name"
              placeholder="Role Name"
              onChange={this.handleChange}
              value={name}
              name="name"
              onValidate={this.rules.name}
            />
          </Form>
          <Row gutter={16}>
            <Col span={12}>
              <h4> Permission that uses in this role </h4>
              <Input.Search
                placeholder="Search permission"
                onChange={this.handleSearchPermission}
                value={searchPermission}
              />
              {!treeData ? null :
                <Tree
                  checkable={true}
                  showIcon={true}
                  showLine={true}
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  checkedKeys={checkedPermissions}
                  onCheck={this.onCheckPermission}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
              }
            </Col>
            <Col span={12}>
              <h4> Users in this role </h4>
              <Input.Search
                placeholder="Search user"
                onChange={this.handleSearchUser}
                value={searchUser}
              />
              <div style={{ margin: 8 }}>
              { this.renderCheckbox() }
              </div>
            </Col>
          </Row>
          <Divider />
          <Button
            type="primary"
            onClick={this.submitRole}
          >
            { data.id ? 'Update' : 'Create' }
          </Button>
          &nbsp;
          &nbsp;
          { data.id ?
          <Button
            type="danger"
            onClick={() => this.confirmDelete(data, this.deleteRole)}
          >
            Delete
          </Button>
          : null }
        </Spin>
      </div>
    );
  }
}

export default RoleForm;