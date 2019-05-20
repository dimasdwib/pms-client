import React from 'react';
import { Row, Col, Card, Typography, Table, notification,
  DatePicker, Form, Button, message } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AdminUrl } from '../../../../Helper/RouteHelper';
import { DateFormat } from '../../../../Helper/DateTime';
import { Currency } from '../../../../Helper/Currency';
import moment from 'moment';

class FolioHistory extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      from: moment(),
      to: moment(),
      total: 0,
    };
  }

  columns = [
    {
      title: 'Folio Number',
      dataIndex: 'folio_number',
      key: 'folio_number',
      render: (value, record) => (<Link to={AdminUrl(`/reservation/${record.id_reservation}?page=folio&id=${record.id_folio}`)}> { value } </Link>)
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => DateFormat(date),
    },
    {
      title: 'Guest',
      dataIndex: 'guest',
      key: 'guest',
      render: (guest) => (
        <span> { guest ? guest.name : null } </span>  
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => Currency(revenue),
    },
  ];

  componentDidMount() {
    this.fetchFolioHistory();
  }

  handleFilter = () => {
    this.fetchFolioHistory();
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

  fetchFolioHistory = () => {
    const { from, to } = this.state;
    this.setState({ isLoadingData: true });
    axios.get(`/report/folio_history?from=${from.format('YYYY-MM-DD')}&to=${to.format('YYYY-MM-DD')}`)
    .then(res => {
      this.setState({
        data: res.data.folios,
        total: res.data.total,
        isLoadingData: false,
      });
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        })
      }
      this.setState({ isLoadingData: false });
    });
  }
  
  render() {
    const { isLoadingData, data, from, to, total } = this.state;

    return (
      <div>
        <Row className="noprint">
          <Col>
            <Card>
              <Typography.Title level={4}> Folio History </Typography.Title>
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
                  <h1 className="printonly"> Folio History { from.format('DD-MM-YYYY') } - { to.format('DD-MM-YYYY') }</h1>
                  <Table
                    columns={this.columns}
                    loading={isLoadingData}
                    dataSource={data}
                    size="small"
                    pagination={false}
                    rowKey="folio_number"
                  />
                  <Card>
                    <div style={{ textAlign: 'right', fontSize: '1.5em', paddingRight: 50 }}>
                      <b> Total : { Currency(total) } </b>
                    </div>
                  </Card>
                </div>
              </Card>
            </Col>
          </Row>
      </div>
    );
  }
}

export default FolioHistory;