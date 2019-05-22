import React from 'react';
import { Row, Col, Card, Typography, Table, notification, Button } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AdminUrl } from '../../../../Helper/RouteHelper';
import { DateFormat, DateTimeFormat } from '../../../../Helper/DateTime';

class DepartureList extends React.PureComponent {
  
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
      render: (value, record) => (<Link to={AdminUrl(`/reservation/${record.id_reservation}`)}> { value } </Link>)
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
      render: (checkin) => DateTimeFormat(checkin),
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
    this.fetchDepartureList();
  }

  fetchDepartureList = () => {
    this.setState({ isLoadingData: true });
    axios.get('/report/departure_list')
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
        <Row className="noprint">
          <Col>
            <Card>
              <Typography.Title level={4}> Departure List </Typography.Title>
              <Button type="primary" onClick={() => window.print()} icon="printer"> Print </Button>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <div id="printarea">
                <h1 className="printonly"> Departure List </h1>
                <Table
                  columns={this.columns}
                  loading={isLoadingData}
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

export default DepartureList;