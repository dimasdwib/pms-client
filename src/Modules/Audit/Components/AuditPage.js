import React from 'react';
import { Row, Col } from 'antd';
import BasePage from '../../../Components/Layout/Admin/BasePage';

class AuditPage extends React.Component {
  render() {
    return (
      <BasePage pageTitle="Audit">
        <Row>
          <Col>
            <ul>
              <li> Expected Departure </li>
              <li> Expected Arrival </li>
              <li> Outstanding Folio </li>
              <li> Charges </li>
            </ul>
          </Col>
        </Row>
      </BasePage>
    );
  }
}

export default AuditPage;