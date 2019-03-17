import React from 'react';
import { Form, Select, Icon, 
  Button, notification, Modal
} from 'antd';
import validator from 'validator';
import axios from 'axios';
import { map } from 'lodash';
import TextField from '../../../Components/Form/TextField';

const { confirm } = Modal;

class GroupForm extends React.Component {

  constructor(props) {
    super(props);
    const { data} = this.props;
    this.state = {
      name: data.title || '',
      id_parent: data.id_parent || null,
      errors: {},
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

  submitGroup = () => {
    const { name, id_parent } = this.state;
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
      group: name,
      id_parent,
    };

    this.setState({ isLoadingSubmit: true });
    let request;
    let actType;
    if (this.props.data.id) {
      request = axios.put(`/permission/group/${this.props.data.id}`, data);
      actType = 'update';
    } else {
      request = axios.post('/permission/group', data);
      actType = 'store';
    }

    request.then(res => {
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.setState({ isLoadingSubmit: false });
      if (this.props.onActionSuccess) {
        this.props.onActionSuccess({ type: actType, group: res.data.group});
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ isLoadingSubmit: false });
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

  handleParent = (e) => {
    this.setState({
      id_parent: e || null,
    });
  }

  deleteGroup = (id, resolve, reject) => {
    axios.delete(`/permission/group/${id}`)
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

  confirmDelete = (record, deleteGroup) => {
    confirm({
      title: `Do you want to delete ${record.title}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteGroup(record.id, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  render() {
    const { name, errors, id_parent, isLoadingSubmit } = this.state;
    const { data, groupData, mappedTree } = this.props;

    const exclusion = [];
    if (data.key) {
      const indexMap = mappedTree.filter((v) => {
        return v.search(data.key) !== -1; 
      });
      let indexParent = null;
      indexMap.forEach(chain => {
        chain.split('|').forEach((key, i) => {
          if ((key === data.key || exclusion.length > 0) && exclusion.indexOf(key) === -1) {
            if (indexParent === null) {
              indexParent = i;
              exclusion.push(key);              
            } else if (i > indexParent) {
              exclusion.push(key);
            }
          }
        });
      });
    }
    
    return(
      <div>
        <h2><Icon type="folder-open" /> {data.title || 'Create new group'} </h2>
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
            label="Group Name"
            placeholder="Group Name"
            value={name}
            onChange={this.handleChange}
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
            label="Parent"
          >
            <Select
              allowClear
              placeholder="Parent"
              name="parent"
              value={id_parent !== null ? id_parent : undefined}
              onChange={this.handleParent}
            >
              { 
                groupData.map(g => {
                  if (exclusion.indexOf(`group_${g.id}`) === -1) {
                    return (
                      <Select.Option key={g.id} value={g.id}> { g.group } </Select.Option>
                    )
                  }
                  return null;
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
            <Button 
              loading={isLoadingSubmit}
              type="primary"
              onClick={this.submitGroup}> { data.title ? 'Update' : 'Create' } </Button>
            &nbsp;
            &nbsp;
            { data.title ? <Button icon="delete" onClick={() => this.confirmDelete(data, this.deleteGroup)} type="danger"> Delete </Button> : null }
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default GroupForm;