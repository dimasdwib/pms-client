import React from 'react';
import { Row, Col, Divider, Spin, Typography } from 'antd';

const { Title } = Typography;

class InformationPage extends React.Component {
  render() {
    const { data } = this.props;
    const booker = data.booker || {};

    return (
      <Spin spinning={false}>
        <Row>
          <Col>
            <Title level={3}> Information </Title>
          </Col>
        </Row>
        <Row> 
          <Col span={12}>
            <small>Booker</small>
            <Title level={4}> {booker.name} .{booker.title} </Title>
            <span> { booker.phone } </span> | 
            <span> { booker.email } </span> <br />
            <span> { booker.address } </span> <br />
          </Col>
          <Col span={12}>
            <small> Note </small> <br />
            { data.note || '-' }
          </Col>
        </Row>
        <Row>
          <Col>

          </Col>
        </Row>
        <Row>
          <Col>

          </Col>
        </Row>
        <Row>
          <Col>
          
          </Col>
        </Row>
      </Spin>
    )
  }
}

export default InformationPage;