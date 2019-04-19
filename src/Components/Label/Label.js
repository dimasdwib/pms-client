import React from 'react';
import { Tag } from 'antd';

export function RoomChargeStatus(props) {
  switch(props.status) {
    case 'pending' :
      return <Tag color="orange"> Pending </Tag>
    case 'charged' :
      return <Tag color="green"> Charged </Tag>
    case 'cancel' :
      return <Tag> Cancel </Tag>
    default :
      return '-';
  }
}

export function ReservationStatus(props) {
  switch(props.status) {
    case 'tentative' :
      return <Tag color="orange"> Tentative </Tag>
    case 'definite' :
      return <Tag color="green"> Definite </Tag>
    case 'canceled' :
      return <Tag color="red"> Canceled </Tag>
    default :
      return '-';
  }
}

export function RoomFoStatus(props) {
  switch(props.status) {
    case 'vacant' :
      return <Tag color="green"> Vacant </Tag>
    case 'occupied' :
      return <Tag color="red"> Occupied </Tag>
    case 'houseuse' :
      return <Tag color="blue"> House Use </Tag>
    default :
      return '-';
  }
}

export function RoomHkStatus(props) {
  switch(props.status) {
    case 'clean' :
      return <Tag color="green"> Clean </Tag>
    case 'dirty' :
      return <Tag color="red"> Dirty </Tag>
    default :
      return '-';
  }
}

