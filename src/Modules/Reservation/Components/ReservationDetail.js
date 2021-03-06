import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import { Col, Tag, Row, List, Card, Divider, notification, Spin, Typography } from 'antd';
import axios from 'axios';
import { size } from 'lodash';
import { AdminUrl } from '../../../Helper/RouteHelper';
import RoomPage from './Page/RoomPage';
import InformationPage from './Page/InformationPage';
import FolioPage from './Page/FolioPage';
import BasePage from '../../../Components/Layout/Admin/BasePage';

const { Title } = Typography;

class ReservationDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reservation: {},
      statusReservation: null,
    }
  }

  componentDidMount() {
    this.fetchReservation();
  }

  fetchReservation = () => {
    this.setState({ statusReservation: 'loading' });
    axios.get(`reservation/${this.props.id}`)
    .then(res => {
      this.setState({
        statusReservation: 'success',
        reservation: res.data,
      });
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.message,
        });
      }
      this.setState({ statusReservation: 'error' });
    });
  }

  componentDidUpdate(props) {
   const query = qs.parse(window.location.search.replace('?', ''));
   if (size(query) > 0 && (this.state.page !== query.page || this.state.id !== query.id)) {
     this.setState({
      page: query.page,
      id: query.id,
     });
   } else if (size(query) === 0 && this.state.page !== 'information') {
     this.setState({
      page: 'information',
     });
   }
  }
  
  render() {

    const { reservation, statusReservation, page, id } = this.state;

    return(
      <BasePage pageTitle={`Reservation ${reservation.number || ''}`} permission="view-reservation">
        <Spin spinning={statusReservation === 'loading'}>
          <Row gutter={16}>
            <Col span={4}>
              <List 
                size="small"
                dataSource={[
                  {
                    label: 'Information'
                  },
                ]}
                renderItem={item => (
                  <List.Item> <Link to={AdminUrl(`/reservation/${this.props.id}`)}> {item.label} </Link></List.Item>
                )}
              />
              <List 
                header="Room"
                size="small"
                dataSource={reservation.rooms || []}
                renderItem={item => (
                  <List.Item> 
                    <Link to={AdminUrl(`/reservation/${this.props.id}?page=room&id=${item.id_reservation_room}`)}>
                      {item.number}
                    </Link>
                    { item.guests[0].date_checkin !== null && item.guests[0].date_checkout === null ?
                      <div style={{ textAlign: 'right' }}>
                        &nbsp; &nbsp; <Tag color="green"> checked-in </Tag>
                      </div>
                    : null }
                    { item.guests[0].date_checkout !== null ?
                      <div style={{ textAlign: 'right' }}>
                        &nbsp; &nbsp; <Tag color="red"> checked-out </Tag>
                      </div>
                    : null }
                  </List.Item>
                )}
              />
              <List
                header="Folio"
                size="small"
                dataSource={reservation.bills || []}
                renderItem={item => (
                  <List.Item>
                    <Link to={AdminUrl(`/reservation/${this.props.id}?page=folio&id=${item.id_bill}`)}> {item.number} </Link>
                    &nbsp; &nbsp;
                    { item.status === 'closed' ? 
                      <Tag color="red"> { item.status } </Tag>
                      :
                      <Tag color="green"> { item.status } </Tag>
                    }
                  </List.Item>
                )}
              />
            </Col>
            <Col span={20}>
              <Card>
                { page === 'information' ? <InformationPage data={reservation} fetchReservation={this.fetchReservation} /> : null }
                { page === 'room' ? <RoomPage key={id} id={id} reservation={reservation} fetchReservation={this.fetchReservation} /> : null }
                { page === 'folio' ? <FolioPage key={id} id={id} data={reservation.bills ? reservation.bills.find((v) => Number(v.id_bill) === Number(id)) : {}} reservation={reservation} fetchReservation={this.fetchReservation} /> : null }
              </Card>  
            </Col>
          </Row>
        </Spin>
      </BasePage>
    );
  }
}

export default ReservationDetail;