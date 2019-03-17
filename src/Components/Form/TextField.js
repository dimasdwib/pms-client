import React from 'react';
import { Form, Input } from 'antd';

class TextField extends React.PureComponent {

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

  onBlur = (e) => {
    if (this.props.onValidate) {
      this.props.onValidate.validate();
    }
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  render() {
    let help = this.props.help; // true; // if true ->> no padding :D
    let validateStatus = null;
    if (this.props.error && this.props.error !== '') {
      help = this.props.error;
      validateStatus = 'error';
    } else if (this.props.warning && this.props.warning !== '') {
      help = this.props.warning;
      validateStatus = 'warning';
    } else if (this.props.success && this.props.success !== '') {
      help = this.props.success === true ? '' : this.props.success;
      validateStatus = 'success';
    }

    return (
      <Form.Item
        labelCol={this.props.labelCol || this.formItemLayout.labelCol}
        wrapperCol={this.props.wrapperCol || this.formItemLayout.wrapperCol}
        label={this.props.label}
        help={help}
        validateStatus={validateStatus}
        hasFeedback
      >
        <Input
          name={this.props.name}
          onChange={this.props.onChange}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.props.value}
          onBlur={this.props.onBlur || this.onBlur}
        />
      </Form.Item>
    );
  }
}

export default TextField;