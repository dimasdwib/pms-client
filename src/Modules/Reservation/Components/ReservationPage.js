import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { AdminUrl } from '../../../Helper/RouteHelper';

const { confirm } = Modal;

class ReservationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
    };
  }

  columns = [
    {
      title: 'Number',
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: 'Booker',
      key: 'booker',
      dataIndex: 'booker',
      render: (booker) => (
        <span>{ booker ? booker.name : null }</span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
    },
    {
      title: 'Note',
      key: 'note',
      dataIndex: 'note',
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Link to={AdminUrl(`/reservation/${record.id_reservation}`)}>
            <Button icon="edit" type="primary" />
          </Link>
          &nbsp;
          <Button icon="delete" type="danger" onClick={() => this.confirmDelete(record, this.deleteBed)} />
        </span>
      ),
    }
  ];

  deleteReservation = (id, resolve, reject) => {
    axios.delete(`/reservation/${id}`)
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

  confirmDelete = (record, deleteReservation) => {
    confirm({
      title: `Do you want to delete reservation ${record.number}?`,
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        return new Promise((resolve, reject) => {
          deleteReservation(record.id_reservation, resolve, reject);
        });
      },
      onCancel() {},
    });
  }

  tableAction = [
    {
      label: 'Create',
      icon: 'plus',
      linkTo: AdminUrl('/reservation/create'),
    }
  ];

  render() {
    return (
      <BasePage>
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_reservation"
              tableAction={this.tableAction}
              key={this.state.tableKey}
              resourceUrl={'/reservation'}
              columns={this.columns}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default ReservationPage;