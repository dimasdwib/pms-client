import React from 'react';
import { Tag } from 'antd';

export function RoomChargeStatus(props) {
  switch(props.status) {
    case 'pending' :
      return <Tag color="orange"> Pending </Tag>
    case 'charged' :
      return <Tag color="green"> charged </Tag>
    case 'cancel' :
      return <Tag> Cancel </Tag>
    default :
      return '-';
  }
}