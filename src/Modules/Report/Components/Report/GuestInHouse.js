import React from 'react';
import { Row, Col, Card, Typography, Table, notification } from 'antd';
import axios from 'axios';
import { DateFormat, DateTimeFormat } from '../../../../Helper/DateTime';

class GuestInHouse extends React.PureComponent {
  
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
      title: 'Check In',
      dataIndex: 'checkin',
      key: 'checkin',
      render: (checkin) => (DateTimeFormat(checkin)),
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
    this.fetchGuestInHouse();
  }

  fetchGuestInHouse = () => {
    this.setState({ isLoadingData: true });
    axios.get('/report/guest_in_house')
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
              <Typography.Title level={4}> Guest In House </Typography.Title>
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

export default GuestInHouse;