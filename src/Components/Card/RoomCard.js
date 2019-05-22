import React from 'react';

class RoomCard extends React.Component {

  handleClick = () => {
    this.props.onClick({
      idRoom: this.props.id,
      idBed: this.props.bed.id_bed,
      idRoomType: this.props.roomType.id_room_type,
    });
  }

  render() {

    const container = {
      width: '120px',
      minHeight: '80px',
      borderRadius: '12px',
      display: 'inline-block',
      margin: '8px',
      border: this.props.selected ? '4px solid #065f12' : null,
      padding: '8px',
      backgroundColor: '#b3f73d',
      cursor: 'pointer',
    };

    return (
      <div style={container} onClick={this.handleClick}>
        <span style={{ fontWeight: 600, fontSize: '1.4em', color: '#065f12' }}> { this.props.number } </span>
        <br />
        <span style={{ color: '#065f12' }}> { this.props.roomType.code } </span>
        <br />
        <span style={{ color: '#065f12' }}> { this.props.bed.code } </span>
      </div>
    )
  }
}

export default RoomCard;