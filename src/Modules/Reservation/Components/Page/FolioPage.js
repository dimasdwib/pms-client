import React from 'react';
import { Row, Col, Table, Divider, Typography, 
  Card, Button, Modal, notification, Tag } from 'antd';
import axios from 'axios';
import FolioPaymentForm from '../Form/FolioPaymentForm';
import { Currency } from '../../../../Helper/Currency';
import { DateTimeFormat } from '../../../../Helper/DateTime';

const { Title } = Typography;
const { confirm } = Modal;

class RoomPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openModalAddPayment: false,
    }
  }

  columns = [{
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (date) => (DateTimeFormat(date))
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  }, {
    title: 'Amount',
    dataIndex: 'amount_nett',
    key: 'amount_nett',
    render: (value, record) => {
      return <h4 style={{ fontWeight: 600, color: record.pos === 'dr' ? 'red' : 'green' }}> { Currency(value) } </h4>
    } 
  }];

  handleAddPayment = (payment) => {
    this.setState({ openModalAddPayment: false });
    this.props.fetchReservation();
  }

  handleModalAddPayment = () => {
    if (this.state.openModalAddPayment) {
      this.setState({ openModalAddPayment: false });
    } else {
      this.setState({ openModalAddPayment: true });
    }
  }

  handleCloseFolio = (id, resolve, reject) => {
    axios.post(`/transaction/close_reservation_bill/${id}`)
    .then(res => {
      resolve();
      this.props.fetchReservation();
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

  confirmCloseFolio = (record, closeFolio) => {
    if (record.balance <= 0) {
      confirm({
        title: `Do you want to close folio ${record.number}?`,
        okText: 'Yes',
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            closeFolio(record.id_bill, resolve, reject);
          });
        },
        onCancel() {},
      });
    } else {
      Modal.warning({
        title: 'Please check the balance',
        content: (
          <div>
            <p>Folio balance must be 0 to close the folio</p>
          </div>
        ),
        onOk() {},
      });
    }
  }

  render() {
    const { data } = this.props;
    const guest = data.guest || {};
    return (
      <div>
        
        <Row>
          <Col span={12}>
          { data.status === 'open' ?
            <div>
              <Button type="primary" shape="round" onClick={() => this.setState({ openModalAddPayment: true })}> Add Payment </Button>
              &nbsp;&nbsp;
              {/* <Button type="primary" shape="round"> Add Charges </Button> */}
              <Button type="danger" shape="round" onClick={() => this.confirmCloseFolio(data, this.handleCloseFolio)}> Close Folio </Button>
            </div>
            :
            <Tag color="red"> Closed </Tag>
          }
          </Col>
          <Col span={12}>
            {/* <Button style={{ float: 'right' }} shape="round" type="primary"> Print </Button> */}
          </Col>
        </Row>
        <Divider />
        <Card>
          <Row>
            <Col>
              <Title level={3}> Folio { data.number } </Title>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <small>Guest</small>
              <Title level={4}> {guest.name} .{guest.title} </Title>
              <span> { guest.phone } </span> | 
              <span> { guest.email } </span> <br />
              <span> { guest.address } </span> <br />
            </Col>
            <Col span={8}>
              <small> Balance </small>
              <Title level={4}> { Currency(data.balance) } </Title>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col>
              <Table
                rowKey="id_transaction"
                size="small"
                dataSource={data.transactions || []}
                columns={this.columns}
                pagination={false}
              />
            </Col>
          </Row>
          <Row>
            <Col>

            </Col>
          </Row>
        </Card>

        <Modal
          title="Add Payment"
          visible={this.state.openModalAddPayment}
          maskClosable={false}
          onCancel={() => this.setState({ openModalAddPayment: false })}
          footer={null}
        >
          <FolioPaymentForm
            onAddPayment={this.handleAddPayment}
            data={data}
            closeModal={this.handleModalAddPayment}
          />
        </Modal>
      </div>
    )
  }
}

export default RoomPage;