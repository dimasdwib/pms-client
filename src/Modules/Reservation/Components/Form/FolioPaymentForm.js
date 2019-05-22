import React from 'react';
import { Button, Row, Col, Input, Form, notification } from 'antd';
import Axios from 'axios';

class FolioPaymentForm extends React.Component {

  constructor(props) {
    super(props);
    const data = this.props.data || {};
    this.state = {
      amount: data.balance > 0 ? data.balance : 0,
      statusSubmit: null,
    }
  }

  handleSubmit = () => {
    const { amount } = this.state;
    const { data } = this.props;

    if (amount <= 0) {
      return;
    }

    this.setState({
      statusSubmit: 'loading',
    });
    Axios.post(`/transaction/payment/${data.id_bill}`, { amount })
    .then(res => {
      this.setState({ statusSubmit: null });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      if (this.props.onAddPayment) {
        this.props.onAddPayment(res.data.payment);
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ statusSubmit: null });
    });
  }

  render() {

    const { amount, statusSubmit } = this.state;

    return (
      <div>
        <Row>
          <Col>
            <Form>
              <Form.Item
                label="Amount"
              >
                <Input
                  size="large"
                  value={amount}
                  onChange={(e) => this.setState({ amount: e.target.value })}
                />
              </Form.Item>
              <div style={{ float: 'right' }}>
                <Button onClick={this.props.closeModal}> Cancel </Button>
                &nbsp;
                &nbsp;
                <Button type="primary" loading={statusSubmit === 'loading'} onClick={this.handleSubmit}> Submit </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FolioPaymentForm;