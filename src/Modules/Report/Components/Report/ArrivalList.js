import React from 'react';
import { Row, Col, Card, Typography, Table, notification } from 'antd';
import axios from 'axios';
import { DateFormat } from '../../../../Helper/DateTime';

class ArrivalList extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
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
      title: 'Guest',
      dataIndex: 'guest',
      key: 'guest',
      render: (guest) => (
        <span> { guest ? guest.name : null } </span>  
      )
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Arrival',
      dataIndex: 'arrival',
      key: 'arrival',
      render: (arrival) => (DateFormat(arrival)),
    },
    {
      title: 'Departure',
      dataIndex: 'adeparture',
      key: 'departure',
      render: (departure) => (DateFormat(departure)),
    }
  ];

  componentDidMount() {
    this.fetchArrivalList();
  }

  fetchArrivalList = () => {
    this.setState({ isLoadingData: true });
    axios.get('/report/arrival_list')
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
        })
      }
      this.setState({ isLoadingData: false });
    });
  }
  
  render() {
    const { isLoadingData, data } = this.state;

    return (
      <div>
        <Row>
          <Col>
            <Card>
              <Typography.Title level={4}> Arrival List </Typography.Title>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <Table
                columns={this.columns}
                loading={isLoadingData}
                dataSource={data}
                size="small"
                pagination={{ position: 'none' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ArrivalList;