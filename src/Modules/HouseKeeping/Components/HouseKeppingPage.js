import React from 'react';
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

  render() {
    return (
      <BasePage pageTitle="House Keeping">
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