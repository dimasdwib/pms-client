import React from 'react';
import { Row, Col, Card, Typography, Table, notification } from 'antd';
import axios from 'axios';
import { DateTimeFormat } from '../../../../Helper/DateTime';

class ReservationList extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoadingData: false,
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
      title: 'Created',
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

  fetchReservationList = () => {
    this.setState({ isLoadingData: true });
    axios.get('/report/reservation_list')
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
    const { data, isLoadingData } = this.state;

    return (
      <div>
        <Row>
          <Col>
            <Card>
              <Typography.Title level={4}> Reservation List </Typography.Title>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <Table
                loading={isLoadingData}
                columns={this.columns}
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

export default ReservationList;