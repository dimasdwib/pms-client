import React from 'react';
import { Row, Col, Card, Typography, Table, notification, message,
Form, DatePicker, Button } from 'antd';
import { Link } from 'react-router-dom';
import { AdminUrl } from '../../../../Helper/RouteHelper';
import axios from 'axios';
import moment from 'moment';
import { DateTimeFormat } from '../../../../Helper/DateTime';

class ReservationList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoadingData: false,
      from: moment(),
      to: moment(),
    };
  }

  columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      render: (value, record) => (<Link to={AdminUrl(`/reservation/${record.id_reservation}`)}> { value } </Link>)
    }, 
    {
      title: 'Booker',
      dataIndex: 'booker',
      key: 'booker',
      render: (booker) => (
        <span> { booker ? booker.name : null } </span>  
      )
    },
    {
      title: 'Phone',
      dataIndex: 'booker',
      key: 'booker_phone',
      render: (booker) => (
        <span> { booker ? booker.phone : null } </span>  
      )
    },
    {
      title: 'Email',
      dataIndex: 'booker',
      key: 'booker_email',
      render: (booker) => (
        <span> { booker ? booker.email : null } </span>  
      )
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => (
        <span> { DateTimeFormat(created_at) } </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }
  ];
  
  componentDidMount() {
    this.fetchReservationList();
  }

  handleFilter = () => {
    this.fetchReservationList();
  }

  handleFrom = (from) => {
    const { to } = this.state;
    const interval = to.diff(from, 'd');

    if (interval < 0) {
      message.error("Opps, invalid date");
      return;
    }

    this.setState({ from });
  }

  handleTo = (to) => {
    const { from } = this.state;
    const interval = to.diff(from, 'd');

    console.log(interval);
    if (interval < 0) {
      message.error("Opps, invalid date");
      return;
    }

    this.setState({ to });
  }

  fetchReservationList = () => {
    const { from, to } = this.state;
    this.setState({ isLoadingData: true });
    axios.get(`/report/reservation_list?from=${from.format('YYYY-MM-DD')}&to=${to.format('YYYY-MM-DD')}`)
    .then(res => {
      this.setState({
        data: res.data,
        isLoadingData: false,
      });
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ isLoadingData: false });
    });
  }

  render() {
    const { data, isLoadingData, from, to } = this.state;

    return (
      <div>
        <Row className="noprint">
          <Col>
            <Card>
              <Typography.Title level={4}> Reservation List </Typography.Title>
              <Form layout="inline">
                <Form.Item
                  label="From"
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    value={from}
                    onChange={this.handleFrom}
                  />
                </Form.Item>
                <Form.Item
                  label="To"
                >
                  <DatePicker
                    format="DD-MM-YYYY"
                    value={to}
                    onChange={this.handleTo}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={this.handleFilter}> Filter </Button>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={() => window.print()} icon="printer"> Print </Button>
                </Form.Item>
              </Form> 
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <div id="printarea">
                <h1 className="printonly"> Reservation List <small> { from.format('DD-MM-YYYY') } - { to.format('DD-MM-YYYY') } </small></h1>
                <Table
                  loading={isLoadingData}
                  columns={this.columns}
                  dataSource={data}
                  size="small"
                  pagination={false}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReservationList;