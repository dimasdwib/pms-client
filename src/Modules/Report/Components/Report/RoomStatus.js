import React from 'react';
import { Row, Col, Card, Typography, Table, notification, Button } from 'antd';
import axios from 'axios';

class RoomStatus extends React.PureComponent {

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
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',
    },
    {
      title: 'Bed',
      dataIndex: 'bed',
      key: 'bed',
    },
    {
      title: 'FO Status',
      dataIndex: 'fo_status',
      key: 'fo_status',
    },
    {
      title: 'HK Status',
      dataIndex: 'hk_status',
      key: 'hk_status',
    },
  ];
  
  componentDidMount() {
    this.fetchRoomStatus();
  }

  fetchRoomStatus = () => {
    this.setState({ isLoadingData: true });
    axios.get('/report/room_status')
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
        <Row className="noprint">
          <Col>
            <Card>
              <Typography.Title level={4}> Room Status </Typography.Title>
              <Button type="primary" onClick={() => window.print()} icon="printer"> Print </Button>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <div id="printarea">
                <h1 className="printonly"> Room Status </h1>
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

export default RoomStatus;