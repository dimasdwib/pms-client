import React from 'react';
import { Row, Col, Button, Modal, notification } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { ReservationStatus } from '../../../Components/Label/Label';
import { AdminUrl } from '../../../Helper/RouteHelper';
import { DateFormat, DateTimeFormat } from '../../../Helper/DateTime';

const { confirm } = Modal;

class ReservationPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0, // init table key
    };
  }

  columns = [
    {
      title: 'Reservation',
      key: 'number',
      dataIndex: 'number',
    },
    {
      title: 'Guest',
      key: 'guest',
      dataIndex: 'guest',
      render: (guest) => (
        <span>{ guest ? guest.name : null } { guest ? `.${guest.title}` : null }</span>
      )
    },
    {
      title: 'Room',
      key: 'room',
      dataIndex: 'room',
      render: (room) => (
        <span>{ room ? room.number : null }</span>
      )
    },
    {
      title: 'Date Check In',
      key: 'date_checkin',
      dataIndex: 'date_checkin',
      render: (date) => (DateTimeFormat(date))
    },
    {
      title: 'Expected Departure',
      key: 'date_departure',
      dataIndex: 'date_departure',
      render: (date) => (DateFormat(date))
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          <Link to={AdminUrl(`/reservation/${record.id_reservation}?page=room&id=${record.id_reservation_room}`)}>
            <Button icon="edit" type="primary" />
          </Link>
        </span>
      ),
    }
  ];

  render() {
    return (
      <BasePage pageTitle="In House" permission="view-guest-in-house">
        <Row>
          <Col span={24}>
            <ResourceTable
              rowKey="id_reservation"
              key={this.state.tableKey}
              resourceUrl={'/reservation/inhouse'}
              columns={this.columns}
            />
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default ReservationPage;