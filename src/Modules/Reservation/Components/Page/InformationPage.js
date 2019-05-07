import React from 'react';
import { Row, Col, Divider, Table, Tag, Spin, Typography } from 'antd';
import { Currency } from '../../../../Helper/Currency';
import { DateFormat } from '../../../../Helper/DateTime';
import { IconArrival, IconDeparture } from '../../../../Components/Icon/Reservation';

const { Title } = Typography;

const columnRoom = [
  {
    title: 'Room',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Guest',
    dataIndex: 'guest',
    key: 'guest',
    render: (field, record) => (
      record.guests ? record.guests[0].guest.name : null
    ),
  },
  {
    title: 'Arrival',
    dataIndex: 'arrival',
    key: 'arrival',
    render: (field, record) => (
      record.guests ? <span><IconArrival /> { DateFormat(record.guests[0].date_arrival) } </span> : null
    ),
  },
  {
    title: 'Departure',
    dataIndex: 'departure',
    key: 'departure',
    render: (field, record) => (
      record.guests ? <span><IconDeparture /> { DateFormat(record.guests[0].date_departure) } </span> : null
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (field, record) => {
      const guest = record.guests ? record.guests[0] : {};
      if (guest.date_checkout !== null) {
        return <Tag color="red">checked-out</Tag>;        
      } else if (guest.date_checkin !== null) {
          return <Tag color="green">checked-in</Tag>;
      } else {
        return null;
      }
    },
  }
];

const columnFolio = [
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
      guest.name
    ),
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (balance) => (
      <span style={{ color: balance > 0 ? 'red' : 'green' }}> { Currency(balance) } </span>
    )
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'closed' ? 'red' : 'green'}> { status } </Tag>
    )
  },
];

class InformationPage extends React.Component {
  render() {
    const { data } = this.props;
    const booker = data.booker || {};

    return (
      <Spin spinning={false}>
        <Row>
          <Col>
            <Title level={3}> Information </Title>
          </Col>
        </Row>
        <Row> 
          <Col span={12}>
            <small>Booker</small>
            <Title level={4}> {booker.name} .{booker.title} </Title>
            <span> { booker.phone } </span> | 
            <span> { booker.email } </span> <br />
            <span> { booker.address } </span> <br />
          </Col>
          <Col span={12}>
            <small> Note </small> <br />
            { data.note || '-' }
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <Title level={4}> Room </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table 
              columns={columnRoom}
              dataSource={data.rooms}
              pagination={false}
              size="small"
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col>
            <Title level={4}> Folio </Title>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              columns={columnFolio}
              dataSource={data.bills}
              pagination={false}
              size="small"
            />
          </Col>
        </Row>
      </Spin>
    )
  }
}

export default InformationPage;