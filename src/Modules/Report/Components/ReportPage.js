import React from 'react';
import BasePage from '../../../Components/Layout/Admin/BasePage';

class ReportPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BasePage pageTitle="Report">
        <ul>
          <li> Reservation List </li>
          <li> Guest In House </li>
          <li> Room Status </li>
          <li> Daily Revenue </li>
          <li> Arrival List </li>
          <li> Departure List </li>
        </ul>
      </BasePage>
    );
  }
}

export default ReportPage;