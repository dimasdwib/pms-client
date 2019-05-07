import React from 'react';
import { Button, notification } from 'antd';
import axios from 'axios';
import BasePage from '../../../Components/Layout/Admin/BasePage';
import ResourceTable from '../../../Components/Table/ResourceTable';
import { RoomFoStatus, RoomHkStatus } from '../../../Components/Label/Label';

class HouseKeppingPage extends React.Component {

  columns = [
    {
      title: 'Room',
      dataIndex: 'number',
      key: 'number',
    }, 
    {
      title: 'Room Type',
      dataIndex: 'room_type',
      key: 'room_type',
      render: (roomType) => (
        <span> { roomType ? roomType.name : null } </span>  
      )
    },
    {
      title: 'Bed',
      dataIndex: 'bed',
      key: 'bed',
      render: (bed) => (
        <span> { bed ? bed.name : null } </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (fo_status, record) => (
        <span> <RoomFoStatus status={record.fo_status} /> <RoomHkStatus status={record.hk_status} /> </span>
      )
    },
    {
      title: 'Action',
      render: (text, record) => (
        <span>
          { record.hk_status === 'dirty' ? <Button icon="sync" type="primary" onClick={() => this.cleanRoom(record.id_room)}> Clean </Button> : null }
        </span>
      ),
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0,
    };
  }

  cleanRoom = (idRoom) => {
    axios.put(`/housekeeping/clean/${idRoom}`)
    .then(res => {
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      this.setState({ tableKey: this.state.tableKey + 1 });
    })
    .catch(err => {

    });
  }

  render() {
    return (
      <BasePage pageTitle="House Keeping" permission="view-room-status">
        <ResourceTable
          rowKey="id_room"
          key={this.state.tableKey}
          resourceUrl={'/room'}
          columns={this.columns}
        />
      </BasePage>
    );
  }
}

export default HouseKeppingPage;