import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Empty, List } from 'antd';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import { AdminUrl } from '../../../Helper/RouteHelper';
import ReservationList from './Report/ReservationList';
import DepartureList from './Report/DepartureList';
import RoomStatus from './Report/RoomStatus';
import DailyRevenue from './Report/DailyRevenue';
import ArrivalList from './Report/ArrivalList';
import GuestInHouse from './Report/GuestInHouse';
import FolioHistory from './Report/FolioHistory';

class ReportPage extends React.Component {

  renderPage() {
    switch(this.props.id) {
      case 'reservation_list' :
        return <ReservationList />;
      case 'departure_list' :
        return <DepartureList />;
      case 'room_status' :
        return <RoomStatus />;
      case 'daily_revenue' :
        return <DailyRevenue />;
      case 'arrival_list' :
        return <ArrivalList />;
      case 'guest_in_house' :
        return <GuestInHouse />;
      case 'folio_history' :
        return <FolioHistory />;
      default :
        return <Empty />;
    }
  }

  render() {
    return (
      <BasePage pageTitle="Report">
        <Row gutter={16}>
          <Col span={4}>
            <List 
              size="small"
              dataSource={[
                {
                  label: 'Reservation List',
                  link: AdminUrl('/report/reservation_list')
                },
                {
                  label: 'Guest In House',
                  link: AdminUrl('/report/guest_in_house')
                },
                {
                  label: 'Arrival List',
                  link: AdminUrl('/report/arrival_list')
                },
                {
                  label: 'Departure List',
                  link: AdminUrl('/report/departure_list')
                },
                {
                  label: 'Room Status',
                  link: AdminUrl('/report/room_status')
                },
                {
                  label: 'Folio History',
                  link: AdminUrl('/report/folio_history')
                },
                // {
                //   label: 'Daily Revenue',
                //   link: AdminUrl('/report/daily_revenue')
                // },
              ]}
              renderItem={item => (
                <List.Item> <Link to={item.link}> {item.label} </Link></List.Item>
              )}
            />
          </Col>
          <Col span={20}>
            { this.renderPage() }
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default ReportPage;