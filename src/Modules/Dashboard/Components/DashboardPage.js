import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import DashboardPanel from './DashboardPanel';
import { Currency } from '../../../Helper/Currency';
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

    const { status, room_occupied_total, room_vacant_dirty_total, room_total, 
      expected_departure_total, expected_arrival_total, last_week_revenue_chart, last_week_occupancy_chart } = this.state;
    const { user } = this.props;

    if (status === 'loading') {
      return <PageLoader />
    }

    return (
      <div>
        <Row>
          <Col>
            <Typography.Title level={3}> Hi, { user.name } </Typography.Title>
          </Col>
        </Row>
        <Row gutter={8}>
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
              value={expected_arrival_total}
            />
          </Col>
          <Col span={6}>
            <DashboardPanel
              title="Expected Departure"
              value={expected_departure_total}
            />
          </Col>
        </Row>
        <br />
        <Row gutter={8}>
          <Col span={12}>
            <Card title="Revenue">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={last_week_revenue_chart || []}
                    margin={{ left: 10, bottom: 10, top: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -4 }} />
                    <YAxis dateKey="revenue" label={{ value: 'Revenue', angle: -90, position: 'insideLeft', offset: -4 }} />
                    <Tooltip
                      formatter={(value, name) => [Currency(value), 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Occupancy">
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={last_week_occupancy_chart || []}
                    margin={{ left: 10, bottom: 10, top: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -4 }} />
                    <YAxis dateKey="occ" label={{ value: 'Occupancy', angle: -90, position: 'insideLeft', offset: -4 }} />
                    <Tooltip
                      formatter={(value, name) => [value, 'Occupancy']}
                    />
                    <Area type="monotone" dataKey="occ" fill="#ffa159" fillOpacity={0.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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