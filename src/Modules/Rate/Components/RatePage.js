import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { Currency } from '../../../Helper/Currency';
import RateForm from './RateForm';

const { confirm } = Modal;

class RatePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
    };
  }

  columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',
      render: (roomType) => (
        <span> {roomType ? roomType.name : null} </span>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount_nett',
      key: 'amount_nett',
      render: (amount) => (Currency(amount)),
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button icon="edit" type="primary" onClick={() => this.setState({ openRateForm: true, editRate: record.id_rate })} />
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteRate)} />
        </span>
      ),
    }
  ];

  deleteRate = (id, resolve, reject) => {
    axios.delete(`/rate/${id}`)
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

  confirmDelete = (record, deleteRate) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteRate(record.id_rate, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openRateForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openRateForm: true, editRate: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Rate">
        <Modal
          title="Rate"
          centered
          visible={this.state.openRateForm}
          maskClosable={false}
          onCancel={() => this.setState({ openRateForm: false })}
          footer={null}
        >
          <RateForm
            key={this.state.editRate}
            id={this.state.editRate}
            onSuccess={this.onSuccess}
          />
        </Modal>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_rate"
              key={this.state.tableKey}
              resourceUrl={'/rate'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default RatePage;
