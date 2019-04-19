import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { LineChart, Line, XAxis, YAxis } from 'recharts';
import DashboardPanel from './DashboardPanel';
import PageLoader from '../../../Components/Layout/Admin/PageLoader';

class DashboardPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: null,
    };
  }
  
  componentDidMount() {
    this.fetchDashboard();
  }

  fetchDashboard = () => {
    this.setState({ status: 'loading' });
    axios.get('/dashboard')
    .then(res => {
      this.setState({
        ...res.data,
        status: 'done',
      });
    });
  }

  render() {

    const { status, room_occupied_total, room_vacant_dirty_total, room_total } = this.state;
    const { user } = this.props;

    if (status === 'loading') {
      return <PageLoader />
    }

    const chartData =[
      {
        name: 'test 1',
        occ: 10,
      },
      {
        name: 'test 2',
        occ: 3,
      },
      {
        name: 'test 3',
        occ: 5,
      },
      {
        name: 'test 4',
        occ: 9,
      },
      {
        name: 'test 5',
        occ: 7,
      },
    ];

    return (
      <div>
        <Row>
          <Col>
            <Typography.Title level={3}> Hi, { user.name } </Typography.Title>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={6}>
            <DashboardPanel
              title="Occupied/Room"
              value={`${room_occupied_total}/${room_total}`}
            />
          </Col>
          <Col span={6}>
            <DashboardPanel
              title="Vacant Dirty"
              value={room_vacant_dirty_total}
            />
          </Col>
          <Col span={6}>
            <DashboardPanel
              title="Expected Arrival"
            />
          </Col>
          <Col span={6}>
            <DashboardPanel
              title="Expected Departure"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <LineChart
                data={chartData}
                width={500}
                height={300}
                margin={{ left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Line type="monotone" dataKey="occ" stroke="red" />
              </LineChart>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.Auth.user,
  }
}

export default connect(mapStateToProps)(DashboardPage);