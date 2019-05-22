import React from 'react';
import validator from 'validator';
import { map } from 'lodash';
import axios from 'axios';
import { Button, Row, Col, Form, Tree,
  Checkbox, Upload, Icon, Divider, Spin,
  notification, message, Typography, Input
} from 'antd';
import { Redirect } from 'react-router-dom';
import { AdminUrl } from '../../../Helper/RouteHelper';
import PageLoader from '../../../Components/Layout/Admin/PageLoader'; 
import BasePage from '../../../Components/Layout/Admin/BasePage';
import TextField from '../../../Components/Form/TextField';

const { Text } = Typography;
const { TreeNode } = Tree;

class UserForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      name: '',
      username: '',
      email: '',
      password: '',
      role: [],
      permission: [],
      confirmPassword: '',
      errors: {},
      success: {},
      roleData: [],
      checkedPermissions: [],
      expandKeys: [],
      treeData: [],
      statusTree: null,
      searchPermission: '',
      searchRole: '',
      autoExpandParent: true,
      isLoadingPage: false,
    }
  }

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  rules = {
    name: {
      validate: () => {
        if (validator.isEmpty(this.state.name)) {
          const { errors } = this.state;
          errors.name = 'This field is required';
          this.setState({ errors }); return false;
        }
      }
    },
    email: {
      validate: () => {
        const { errors } = this.state;
        if (validator.isEmpty(this.state.email)) {
          errors.email = 'This field is required';
          this.setState({ errors }); return false;
        } else if (!validator.isEmail(this.state.email)) {
          errors.email = 'Invalid email';
          this.setState({ errors }); return false;
        }
      }
    },
    username: {
      validate: () => {
        if (validator.isEmpty(this.state.username)) {
          const { errors } = this.state;
          errors.username = 'This field is required';
          this.setState({ errors }); return false;
        }
      }
    },
    password: {
      validate: () => {
        if (this.props.id && validator.isEmpty(this.state.password)) {
          return true;
        }
        const { errors, success } = this.state;
        if (validator.isEmpty(this.state.password)) {
          errors.password = 'This field is required';
          this.setState({ errors }); return false;
        } else if (!validator.isEmpty(this.state.confirmPassword) && this.state.password === this.state.confirmPassword) {
          success.password = true;
          success.confirmPassword = true;
          this.setState({ success });
        }
      }
    },
    confirmPassword: {
      validate: () => {
        if (this.props.id && validator.isEmpty(this.state.password)) {
          return true;
        }
        const { errors, success } = this.state;
        if (validator.isEmpty(this.state.confirmPassword)) {
          errors.confirmPassword = 'This field is required';
          this.setState({ errors }); return false;
        } else if (this.state.password !== this.state.confirmPassword) {
          errors.confirmPassword = 'Password not match';
          this.setState({ errors }); return false;
        } else if (!validator.isEmpty(this.state.password) && this.state.password === this.state.confirmPassword) {
          success.confirmPassword = true;
          success.password = true;
          this.setState({ success });
        }
      }
    }
  }

  componentDidMount() {
    this.fetchPermissionTree();
    axios.get('/role/all')
    .then(res => {
      this.setState({
        roleData: res.data,
      });
    });
    if (this.props.id) {
      this.fetchUser(this.props.id);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.id && prevProps.id !== this.props.id) {
      this.fetchUser(this.props.id);
    }
  }

  fetchPermissionTree = () => {
    this.setState({ statusTree: 'loading' });
    axios.get('/permission/group/tree')
    .then(res => {
      this.setState({ 
        treeData: res.data,
        statusTree: 'success',
      })
    })
    .catch(err => {
      console.log(err);
      this.setState({ statusTree: 'error' });
    });
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheckPermission = (checkedKeys, info) => {
    const permission = [];
    info.checkedNodes.forEach(node => {
      if (node.props.dataRef.type === 'permission') {
        permission.push(node.props.dataRef.title);
      }
    });
    this.setState({ 
      checkedPermissions: checkedKeys,
      permission,
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
    const expandedKeys = this.getParentKey(this.state.treeData, e.target.value);
    this.setState({
      searchPermission: e.target.value,
      expandedKeys,
      autoExpandParent: true,
    });
  }

  handleSearchRole = (e) => {
    this.setState({
      searchRole: e.target.value,
    });
  }

  fetchUser = (id) => {
    this.setState({ isLoadingPage: true });
    axios.get(`/users/${id}`)
    .then(res => {
      const permission = [];
      const checkedPermissions = [];
      res.data.permission.forEach(p => {
        permission.push(p.name);
        checkedPermissions.push(`permission_${p.id}`);        
      });
      this.setState({
        isLoadingPage: false,
        ...res.data,
        permission,
        checkedPermissions,
      });
    })
    .catch(err => {
      if (err.response.data) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
          isLoadingPage: false,
        });
        this.setState({
          redirectTo: `${AdminUrl('/404')}`,
        });
      }
    });
  }

  handleChange = (e) => {
    const { errors } = this.state;
    if (errors[e.target.name] && !validator.isEmpty(errors[e.target.name])) {
      delete errors[e.target.name];
    }
    this.setState({
      errors,
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit = (e) => {

    const { name, username, email, password, permission, role } = this.state;
    let isValid = true;
    map(this.rules, rule => {
      if (rule.validate() === false) {
        isValid = false;
      }
    });

    if (role.length === 0) {
      message.error('At least user must has one role');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const data = {
      name, 
      username,
      email,
      password,
      role: role.join(','),
      permission: permission.join(','),
    };

    this.setState({ isLoading: true });
    let request;
    if (this.props.id) {
      request = axios.put(`/users/${this.props.id}`, data);
    } else {
      request = axios.post('/users', data);
    }

    request.then(res => {
      this.setState({ isLoading: false });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      if (!this.props.id) {
        this.setState({
          redirectTo: `${AdminUrl('/user')}/${res.data.user.id}`
        });
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message || err.response.data.error,
        });
      }
      this.setState({ isLoading: false });
    });
  }

  handlePermission = (e) => {
    const { permission } = this.state;
    if (e.target.checked) {
      permission.push(e.target.value);
    } else {
      permission.splice(permission.indexOf(e.target.value), 1);
    }
    this.setState({ permission });
  }

  handleRole = (e) => {
    const { role } = this.state;
    if (e.target.checked) {
      role.push(e.target.value);
    } else {
      role.splice(role.indexOf(e.target.value), 1);
    }
    this.setState({ role });
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

  render() {

    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }

    if (this.state.isLoadingPage) {
      return <PageLoader />
    }

    const { imageUrl, errors, success, name, isLoadingPage, statusTree,
      username, email, password, confirmPassword, isLoading,
      treeData, roleData, searchPermission, role, checkedPermissions,
      searchRole
    } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'user'} />
        <div className="ant-upload-text"> Upload </div>
      </div>
    );

    let pagePermission = 'create-users';
    if (this.props.id) {
      pagePermission = 'update-users';
    }
    return (
      <BasePage permission={pagePermission} pageTitle="User" >
        <Spin spinning={isLoadingPage}>
          <Form>
            <Row gutter={16}>
              <Col span={10}>
                <Divider>User Detail</Divider>
                <div style={{ padding: 16 }}>
                  <Form.Item
                    {...this.formItemLayout}
                    label="Picture"
                    style={{ display: 'none' }}
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                    >
                      {imageUrl !== null ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload>
                  </Form.Item>
                  <TextField
                    error={errors.name}
                    label="Full Name"
                    placeholder="Full Name"
                    name="name"
                    onChange={this.handleChange}
                    value={name}
                    onValidate={this.rules.name}
                  />
                  <TextField
                    error={errors.username}
                    label="Username"
                    placeholder="Username"
                    name="username"
                    onChange={this.handleChange}
                    value={username}
                    onValidate={this.rules.username}
                  />
                  <TextField
                    error={errors.email}
                    label="Email"
                    placeholder="Email"
                    name="email"
                    onChange={this.handleChange}
                    value={email}
                    onValidate={this.rules.email}
                  />
                  { this.props.id ? <Divider> Change Password </Divider> : null }
                  { this.props.id ? <div style={{ textAlign: 'center' }}><Text type="secondary">* Leave it blank if you dont want to change password </Text></div> : null }
                  <TextField
                    error={errors.password}
                    success={success.password}
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={this.handleChange}
                    value={password}
                    onValidate={this.rules.password}
                  />
                  <TextField
                    error={errors.confirmPassword}
                    success={success.confirmPassword}
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    onChange={this.handleChange}
                    value={confirmPassword}
                    onValidate={this.rules.confirmPassword}
                  />
                  <Form.Item
                    {...this.tailFormItemLayout}
                  >
                    <Button
                      type='primary'
                      loading={isLoading}
                      onClick={this.handleSubmit}
                    >
                      {this.props.id ? 'Update' : 'Create'} 
                    </Button>   
                  </Form.Item>
                </div>
              </Col>
              <Col span={6}>
                <Divider>Role</Divider>
                <Input.Search
                  placeholder="Search role"
                  value={searchRole}
                  onChange={this.handleSearchRole}
                />
                <div style={{ padding: 16 }}>
                  {
                    roleData.map(r => {
                      const index = r.name.toLowerCase().indexOf(searchRole.toLowerCase());
                      if (index === -1) {
                        return null;
                      }
                      const beforeStr = r.name.substr(0, index);
                      const afterStr = r.name.substr(index + searchRole.length);
                      const title = index > -1 ? (
                        <span>
                          {beforeStr}
                          <span style={{ backgroundColor: 'yellow' }}>{r.name.substr(index, searchRole.length)}</span>
                          {afterStr}
                        </span>
                      ) : <span>{r.name}</span>;
                      return (
                        <div style={{ margin: 8 }} key={r.id}>
                          <Checkbox
                            value={r.name}
                            checked={role.indexOf(r.name) !== -1}
                            onChange={this.handleRole}
                          >
                            {title}
                          </Checkbox>
                        </div>
                      );
                    })  
                  }
                </div>
              </Col>
              <Col span={6}>
                <Divider>Direct Permission</Divider>
                <Input.Search
                  placeholder="Search permission"
                  value={searchPermission}
                  onChange={this.handleSearchPermission}
                />
                <div style={{ padding: 16 }}>
                  <Spin spinning={statusTree === 'loading'}>
                    <Tree
                      checkable={true}
                      showIcon={true}
                      showLine={true}
                      onExpand={this.onExpand}
                      expandedKeys={this.state.expandedKeys}
                      autoExpandParent={this.state.autoExpandParent}
                      checkedKeys={statusTree === 'loading' ? [] : checkedPermissions}
                      onCheck={this.onCheckPermission}
                    >
                      {this.renderTreeNodes(treeData)}
                    </Tree>
                  </Spin>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </BasePage>
    );
  }
}

export default UserForm;