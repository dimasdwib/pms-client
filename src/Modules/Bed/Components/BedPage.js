import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';
import BedForm from './BedForm';

const { confirm } = Modal;

class BedPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
      editBed: null,
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Button icon="edit" type="primary" onClick={() => this.setState({ openBedForm: true, editBed: record.id_bed })} />
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteBed)} />
        </span>
      ),
    }
  ];

  deleteBed = (id, resolve, reject) => {
    axios.delete(`/bed/${id}`)
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

  confirmDelete = (record, deleteBed) => {
    confirm({
      title: `Do you want to delete ${record.name}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteBed(record.id_bed, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  onSuccess = (res) => {
    console.log(res);
    this.setState({ openBedForm: false, tableKey: this.state.tableKey + 1 });
    notification.success({
      message: 'success',
      description: res.data.message,
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      onClick: () => this.setState({ openBedForm: true, editBed: null }),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="Bed">
        <Modal
          title="Bed"
          centered
          visible={this.state.openBedForm}
          maskClosable={false}
          onCancel={() => this.setState({ openBedForm: false })}
          footer={null}
        >
          <BedForm
            id={this.state.editBed}
            onSuccess={this.onSuccess}
          />
        </Modal>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_bed"
              key={this.state.tableKey}
              resourceUrl={'/bed'}
              columns={this.columns}
              tableAction={this.tableAction}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default BedPage;