import React from 'react';
import { Row, Col, Card, Typography, Table } from 'antd';

class DailyRevenue extends React.PureComponent {
  render() {
    return (
      <div>
        <Row>
          <Col>
            <Card>
              <Typography.Title level={4}> Daily Revenue </Typography.Title>
            </Card>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card>
              <Table

              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DailyRevenue;