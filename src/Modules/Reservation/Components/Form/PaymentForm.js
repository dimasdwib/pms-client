import React from 'react';
import { Form, Select, Button } from 'antd';
import TextField from '../../../../Components/Form/TextField';

class PaymentForm extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      id_payment: 1,
    };
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

  payments = [
    {
      id_payment: 1,
      name: 'cash',
    },
  ];

  handleAddPayment = () => {
    const { amount, id_payment } = this.state;
    const payment = this.payments.find((v) => v.id_payment === id_payment);

    if (amount <= 0) {
      return;
    }

    const data = {
      amount: parseFloat(amount),
      ...payment,
    };

    if (this.props.onAddPayment) {
      this.props.onAddPayment(data);
    }
  }
  
  render() {

    const { amount, id_payment } = this.state;

    return (
      <div>
        <Form>
          <Form.Item
            label="Type"
            {...this.formItemLayout}
          >
            <Select
              onChange={(e) => this.setState({ type: e })}
              value={id_payment}
            >
              { this.payments.map(p => (<Select.Option key={p.id_payment} value={p.id_payment}> {p.name} </Select.Option>)) }
            </Select>
          </Form.Item>
          <TextField
            name="amount"
            label="Amount"
            value={amount}
            type="number"
            onChange={(e) => this.setState({ amount: e.target.value })}
          />
        </Form>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={this.handleAddPayment} type="primary">
            Submit
          </Button>
        </div>
      </div>
    );
  };
}

export default PaymentForm;