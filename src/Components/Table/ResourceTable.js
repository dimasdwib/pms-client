import React from 'react';
import PropTypes from 'prop-types';
import { Table, Pagination, Form, Input, Button, Row, Col } from 'antd';
import axios from 'axios';
import qs from 'qs';
import { Link } from 'react-router-dom';
import History from '../../Helper/History';
import { ProtectComponent } from '../../Helper/AuthHelper';

/**
 * Handle Resources CRUD
*/
class ResourceTable extends React.Component {

  static propTypes = {
    resourceUrl: PropTypes.string,
    bulkAction: PropTypes.array,
    tableAction: PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      current: 1,
      total: 0,
      search: null,
      limit: this.props.limit || 20,
      tableAction: [],
    };

    this.fetchData = this.fetchData.bind(this);
    this.handlePaginate = this.handlePaginate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.reloadTable = this.reloadTable.bind(this);
    this.showTotal = this.showTotal.bind(this);
  }

  componentDidMount() {

    // retrieve param from url
    const query = History.location;
    if (query.search !== '') {
      const param = qs.parse(query.search.replace('?', ''));
      // fetch initial data based on url query string
      this.fetchData(param);
    } else {
      // fetch initial data
      this.fetchData({});
    }

    if (this.props.tableAction) {
      const { tableAction } = this.props;
      const action = [];
      tableAction.forEach((a, i) => {
        const btnAct = (
          <Button
            type={a.type || 'primary'}
            style={a.style || {}}
            icon={a.icon || null}
            shape={a.label ? 'round' : 'circle'}
            onClick={a.onClick}
          >{a.label || null}</Button>
        );
        if (a.linkTo) {
          action.push(
            <ProtectComponent permission={a.permission} key={i}>
              <Form.Item>
                <Link to={a.linkTo}>
                  {btnAct}
                </Link>
              </Form.Item>
            </ProtectComponent>
          );
        } else {
          action.push(
            <ProtectComponent permission={a.permission} key={i}>
              <Form.Item>
                {btnAct}
              </Form.Item>
            </ProtectComponent>
          );
        }
      });

      this.setState({
        tableAction: action,
      });
    }
  }

  fetchData(param) {
    const { limit, search } = this.state;
    if (!param.page) {
      param.page = 1;
    }
    if (!param.limit) {
      param.limit = limit;
    } else {
      this.setState({ limit: param.limit });
    }
    if (search !== null && search !== '') {
      param.search = search;
      this.setState({ search });
    }

    const pathname = window.location.pathname;
    History.replace({
      pathname,
      search: qs.stringify(param),
    });

    this.setState({ loading: true });
    axios.get(`${this.props.resourceUrl}?${qs.stringify(param)}`)
    .then(res => {
      this.setState({
        loading: false,
        dataSource: res.data.data,
        current: res.data.current_page || res.data.meta.current_page,
        total: res.data.total || res.data.meta.total,
      });
    })
    .catch(err => {
      this.setState({
        loading: false,
      });
    });
  }

  reloadTable() {
    this.fetchData({ page: 1 });
  }

  deleteData() {

  };

  handlePaginate(page) {
    this.fetchData({ page });
  }

  handleSearch(e) {
    this.setState({
      search: e.target.value,
    });
  }

  handleSubmitSearch(e) {
    e.preventDefault();
    const { search } = this.state;
    this.fetchData({ search });
  }

  showTotal() {
    const { total } = this.state;
    if (total) {
      if (Number(total) > 1) {
        return `Total ${total} items`;
      }
      if (Number(total) === 1) {
        return `Total ${total} item`;
      }
      return null; 
    }

    return null;
  }

  render() {
    const { loading, dataSource, current, total, limit, search } = this.state;

    return (
      <div>
        <Row>
          <Col span={12}>

          </Col>
          <Col span={12}>
            <Form onSubmit={this.handleSubmitSearch} layout="inline" style={{ float: "right" }}>
              <Form.Item>
                <Input placeholder="Search" onChange={this.handleSearch} value={search} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon="search" htmlType="submit" />
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form layout="inline">
              { this.state.tableAction }
            </Form>
          </Col>
          <Col span={12}>
            <Form layout="inline" style={{ float: 'right' }}>
              <Form.Item key="refresh">
                <Button
                  icon="reload"
                  shape="circle"
                  disabled={loading}
                  onClick={this.reloadTable}
                />
              </Form.Item>
              <Form.Item key="pagination">
                <div style={{ paddingTop: 8 }}>
                  <Pagination
                    onChange={this.handlePaginate}
                    current={current}
                    total={total}
                    pageSize={Number(limit)}
                    hideOnSinglePage={false}
                    size="small"
                    showTotal={this.showTotal}
                  />
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <Table
              loading={loading}
              dataSource={dataSource}
              columns={this.props.columns}
              pagination={{position: 'none'}}
              rowKey={this.props.rowKey || 'id'}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResourceTable;
