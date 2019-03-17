import React from 'react';
import { Row, Col, Button, Card, 
  Spin, Divider, Input, Empty, Tree, Icon
} from 'antd';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import RoleForm from './RoleForm';

const { TreeNode } = Tree;

class RolePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      search: '',
      roleData: [],
      selectedKeys: [],
      selectedData: {},
      treeData: [],
    }
  }

  componentDidMount() {
    this.fetchRoles();
    this.fetchUsers();
    this.fetchPermissionTree();
  }

  fetchRoles = () => {
    this.setState({ roleStatus: 'loading' });
    axios.get('/role/all')
    .then(res => {
      this.setState({
        roleData: res.data,
        roleStatus: 'success',
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({ roleStatus: 'error' });
    });
  }

  fetchUsers = () => {
    axios.get('/users/all')
    .then(res => {
      this.setState({
        userData: res.data,
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  fetchPermissionTree = () => {
    this.setState({ statusTree: 'loading' });
    axios.get('permission/group/tree')
    .then(res => {
      const mappedTree = this.mappingTree(res.data);
      this.setState({
        treeData: res.data,
        statusTree: 'success',
        mappedTree,
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        statusTree: 'error',
      });
    });
  }

  mappingTree = (tree, chainKey, res) => {
    const result = res || [];
    tree.forEach(t => {
      let nextChainKey = `${t.key}`;
      if (chainKey) {
        nextChainKey = `${chainKey}|${t.key}`; 
      } 
      if (t.children && t.children.length > 0) {
        this.mappingTree(t.children, nextChainKey, result);
      }
      result.push(nextChainKey);
    });

    if (!res) {
      return result;
    }
  }

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  }

  onRoleSelect = (selectedKeys, info) => {
    if (info.selected) {
      this.setState({ 
        selectedKeys,
        selectedData: info.node.props.dataRef,
      });
    }
  }

  onActionSuccess = ({ type, role }) => {
    if (type === 'store' || type === 'update') {
      this.setState({ selectedData: role, selectedKeys: [role.id.toString()] });
    }
    if (type === 'delete') {
      this.setState({ selectedData: {}, selectedKeys: [] });
    }
    this.fetchRoles();
  }

  renderTree = () => {
    const { roleData, search } = this.state;
    return roleData.map(role => {
      const index = role.name.toLowerCase().indexOf(search.toLowerCase());
      if (index === -1) {
        return null;
      }
      const beforeStr = role.name.substr(0, index);
      const afterStr = role.name.substr(index + search.length);
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ backgroundColor: 'yellow' }}>{role.name.substr(index, search.length)}</span>
          {afterStr}
        </span>
      ) : <span>{role.name}</span>;
      return (
        <TreeNode title={title} key={role.id.toString()} dataRef={role} icon={<Icon type="file-protect" />} />
      )
    }).filter(node => node !== null);
  }

  render(){
    const { search, roleStatus,
      selectedKeys, selectedData, treeData,
      userData
    } = this.state;

    return (
      <BasePage>
        <Row gutter={16}>
          <Col span={8}>
            <Button
              type="primary"
              size="small"
              icon="file-protect"
              shape="round"
              onClick={() => this.setState({ selectedData: {type: 'create'}, selectedKeys: [] })}
            >
              Create Role
            </Button>
            <Divider />
            <Input.Search
              placeholder="Search Role"
              value={search}
              onChange={this.handleSearch}
            />
            <Spin spinning={roleStatus === 'loading'}>
              <Tree
                showIcon={true}
                multiple={false}
                onSelect={this.onRoleSelect}
                selectedKeys={selectedKeys}
              >
              { this.renderTree() }
              </Tree>
            </Spin>
          </Col>
          <Col span={16}>
            <Card>
              { selectedData.id ? 
                <RoleForm 
                  key={selectedData.id}
                  data={selectedData}
                  treeData={treeData}
                  userData={userData}
                  onActionSuccess={this.onActionSuccess}
                /> : null }
              { selectedData.type === 'create' ?
                <RoleForm
                  key={'create'}
                  data={{}}
                  treeData={treeData}
                  userData={userData}
                  onActionSuccess={this.onActionSuccess}
                /> : null }
              { !selectedData.id && !selectedData.type ? <Empty /> : null }
            </Card>
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default RolePage;