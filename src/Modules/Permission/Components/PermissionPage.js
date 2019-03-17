import React from 'react';
import { Button, Tree, Divider, Icon,
  Row, Col, Input, Checkbox, Card,
  Empty, Spin
} from 'antd';
import axios from 'axios';
import validator from 'validator';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import PermissionForm from './PermissionForm';
import GroupForm from './GroupForm';

const { TreeNode } = Tree;

class PermissionPage extends React.Component {

  state = {
    statusTree: null,
    treeData: [],
    expandedKeys: [],
    selectedKeys: [],
    selectedData: {},
    checkedKeys: [],
    groupData: [],
    roleData: [],
    userData: [],
    mappedTree: [],
    autoExpandParent: true,
    search: '',
    strictSearch: false,
  }

  componentDidMount() {
    this.fetchPermissionTree();
    this.fetchGroup();
    this.fetchRoleUser();
  }

  fetchPermissionTree = (key) => {
    this.setState({ statusTree: 'loading' });
    axios.get('permission/group/tree')
    .then(res => {
      const mappedTree = this.mappingTree(res.data);
      let expandedKeys = [];
      if (key) {
        expandedKeys = this.getParentKeyByKey(mappedTree, key);
      }
      this.setState({
        treeData: res.data,
        statusTree: 'success',
        mappedTree,
        expandedKeys,
      });
    })
    .catch(err => {
      console.log(err);
      this.setState({
        statusTree: 'error',
      });
    });
  }

  fetchGroup = () => {
    axios.get('/permission/group')
    .then(res => {
      this.setState({
        groupData: res.data, 
      });
    })
    .catch(err => {
      console.log(err);
    });
  }

  fetchRoleUser() {
    axios.get('/role/all')
    .then(res => {
      this.setState({
        roleData: res.data,
      });
    });

    axios.get('/users/all')
    .then(res => {
      this.setState({
        userData: res.data,
      });
    });
  }

  onActionSuccessGroup = ({type, group}) => {
    if (type === 'store' || type === 'update') {
      const selectedData = {
        id: group.id,
        id_parent: group.id_parent,
        key: `group_${group.id}`,
        title: group.group,
        type: 'group',
      };
      this.setState({ selectedData, selectedKeys: [`group_${group.id}`] });
      this.fetchPermissionTree(`group_${group.id}`);
    }

    if (type === 'delete') {
      this.setState({ selectedData: {} });
      this.fetchPermissionTree();
    }

    this.fetchGroup();
  }

  onActionSuccessPermission = ({type, permission}) => {
    if (type === 'store' || type === 'update') {
      const selectedData = {
        id: permission.id,
        id_parent: permission.id_parent,
        key: `permission_${permission.id}`,
        title: permission.name,
        type: 'permission',
      };
      this.setState({ selectedData, selectedKeys: [`permission_${permission.id}`] });
      this.fetchPermissionTree(`permission_${permission.id}`);
    }

    if (type === 'delete') {
      this.setState({ selectedData: {} });
      this.fetchPermissionTree();
    }

  }

  onExpand = (expandedKeys) => {
    // console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info.node);
    if (info.selected) {
      this.setState({ 
        selectedKeys,
        selectedData: info.node.props.dataRef,
      });
    }
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
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

  getParentKeyByKey = (mappedTree, searchKey) => {
    const chain = mappedTree.find((v) => {
      return v.search(searchKey) !== -1; 
    });
    let result = [];
    const chainArr = chain.split('|'); 
    for(let i = 0; i < chainArr.length; i++) {
      if (chainArr[i] !== searchKey && chainArr[i].search('group') !== -1) {
        result.push(chainArr[i]);
      } else {
        break;
      }
    };

    return result;
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
    const expandedKeys = this.getParentKey(this.state.treeData, e.target.value);
    this.setState({
      search: e.target.value,
      expandedKeys,
      autoExpandParent: true,
    });
  }

  renderTreeNodes = (data) => {
    const res = data.map((item) => {
      const { search, expandedKeys, strictSearch } = this.state;
      if (strictSearch && item.title.toLowerCase().search(search.toLowerCase()) === -1 && expandedKeys.indexOf(item.key) === -1) {
        return null;
      }

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

  createPermission = () => {
    this.setState({
      selectedData: { type: 'new_permission' },
      selectedKeys: [],
    });
  }

  createGroup = () => {
    this.setState({
      selectedData: { type: 'new_group' },
      selectedKeys: [],
    });
  }
  

  render() {

    const { search, selectedData, groupData, statusTree, roleData, userData, mappedTree } = this.state;

    return (
      <BasePage>
        <Row gutter={16}>
          <Col span={8}>
            <Button onClick={this.createPermission} icon="safety" shape="round" size="small" type="primary"> Create Permission </Button>
            &nbsp;
            &nbsp;
            <Button onClick={this.createGroup} icon="folder" shape="round" size="small" type="primary"> Create Group </Button>
            <Divider />
            <Input.Search
              placeholder="Search"
              onChange={this.handleSearch}
              value={search}
              addonAfter={
                <Checkbox
                  onChange={(e) => this.setState({ strictSearch: e.target.checked })}
                > Strict </Checkbox>
              }
            />
            <Spin spinning={statusTree === 'loading'} tip="Loading...">
              <Tree
                checkable={false}
                showIcon={true}
                showLine={true}
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {this.renderTreeNodes(this.state.treeData)}
              </Tree>
            </Spin>
          </Col>
          <Col span={16}>
              <Card>
              { selectedData.type === 'permission' ? 
                <PermissionForm 
                  key={selectedData.id}
                  data={selectedData}
                  roleData={roleData}
                  userData={userData}
                  onActionSuccess={this.onActionSuccessPermission}
                  groupData={groupData} />
              : null }
              { selectedData.type === 'group' ?
                <GroupForm
                  key={selectedData.id}
                  data={selectedData}
                  onActionSuccess={this.onActionSuccessGroup}
                  mappedTree={mappedTree}
                  groupData={groupData} />
              : null }
              { selectedData.type === 'new_group' ?
                <GroupForm
                  key={'new_group'}
                  data={{}}
                  onActionSuccess={this.onActionSuccessGroup}
                  mappedTree={mappedTree}
                  groupData={groupData} />
              : null }
              { selectedData.type === 'new_permission' ?
                <PermissionForm
                  roleData={roleData}
                  userData={userData}
                  key={'new_permission'}
                  data={{}}
                  onActionSuccess={this.onActionSuccessPermission}
                  groupData={groupData} />
              : null }              
              { !selectedData.type ? <Empty /> : null }
              </Card>
          </Col>
        </Row>

      </BasePage>
    );
  }
}

export default PermissionPage;