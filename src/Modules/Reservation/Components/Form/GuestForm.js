import React from 'react';
import { Row, Col, Form, Button, notification, Spin,
  Tabs, Select, Input, Table, Empty } from 'antd';
import TextField from '../../../../Components/Form/TextField';
import axios from 'axios';

class GuestForm extends React.PureComponent {

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  }, {
    title: 'Id Card',
    dataIndex: 'idcard',
    key: 'idcard',
  }, {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  }];

  fetchGuestTimeout = null;

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      activeKey: 'find',
      statusSubmit: null,
      name: '',
      title: 'mr',
      email: '',
      phone: '',
      idcard: '',
      address: '',
      zipcode: '',
      id_country: '',
      id_state: '',
      id_city: '',
      guestData: [],
      selectedRowKeys: [],
      selectedGuest: {},
    }
  }

  componentDidMount() {
    if (this.props.data && this.props.isOpen) {
      this.setState({
        search: this.props.data.search,
        selectedGuest: this.props.data.selectedGuest,
        selectedRowKeys: [this.props.data.selectedGuest.id_guest]
      });
      this.fetchGuest(this.props.data.search);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.data) {
      if (prevProps.isOpen !== this.props.isOpen) {
        this.setState({
          search: this.props.data.search,
          selectedGuest: this.props.data.selectedGuest,
          selectedRowKeys: [this.props.data.selectedGuest.id_guest]
        });
        this.fetchGuest(this.props.data.search);
      }
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleTitle = (title) => {
    this.setState({ title });
  }

  handleSearch = (e) => {
    if (e.target.value !== '') {
      if (this.fetchGuestTimeout !== null) {
        window.clearTimeout(this.fetchGuestTimeout);
      }
      this.fetchGuestTimeout = window.setTimeout(() => {
        this.fetchGuest();
      }, 400);
    }

    this.setState({ search: e.target.value });
  }

  fetchGuest = (searchValue) => {
    let { search } = this.state;
    if (searchValue) {
      search = searchValue;
    }
    this.setState({ isLoadingSearch: true });
    axios.get(`/guest/all?search=${search}`)
    .then(res => {
      this.setState({ 
        guestData: res.data,
        isLoadingSearch: false,
      })
    });
  }

  handleSubmit = () => {
    const { name, phone, email, address, idcard, title, zipcode } = this.state;
    const data = {
      name,
      phone,
      email,
      zipcode,
      address,
      idcard,
      title,
    };

    this.setState({ statusSubmit: 'loading' });
    axios.post('/guest', data)
    .then(res => {
      this.setState({ statusSubmit: null });
      notification.success({
        message: 'Success',
        description: res.data.message,
      });
      if (this.props.onAddGuest) {
        this.props.onAddGuest(res.data.guest);
      }
    })
    .catch(err => {
      if (err.response) {
        notification.error({
          message: 'Error',
          description: err.response.data.message,
        });
      }
      this.setState({ statusSubmit: null });
    });
  }

  handleSelect = () => {
    const { selectedGuest } = this.state;
    if (this.props.onAddGuest) {
      console.log(selectedGuest);
      this.props.onAddGuest(selectedGuest);
    }
  }

  render() {
    const { name, idcard, phone, address, zipcode, email, title, search, guestData, isLoadingSearch, activeKey } = this.state;
    return (
      <Spin spinning={this.state.statusSubmit === 'loading'}>
        <Tabs activeKey={activeKey} onChange={(activeKey) => this.setState({ activeKey })}>
          <Tabs.TabPane tab="Find" key='find'>
            <Form>
              <Form.Item>
                <Input.Search
                  name="search"
                  onChange={this.handleSearch}
                  value={search}
                  placeholder="Search by name, id, email, phone, etc"
                />
              </Form.Item>
              <Form.Item>
                <Table
                  dataSource={guestData}
                  columns={this.columns}
                  loading={isLoadingSearch}
                  rowSelection={{ 
                    type: "radio",
                    selectedRowKeys: this.state.selectedRowKeys,
                    onSelect: (guest) => this.setState({ selectedGuest: guest }),
                    onChange: (selectedRowKeys) => this.setState({ selectedRowKeys }),
                  }}
                  pagination={false}
                  size="small"
                  rowKey="id_guest"
                  locale={{
                    emptyText: <Empty> <Button type="primary" onClick={() => this.setState({ activeKey: 'create' })}>Create New</Button> </Empty>
                  }}
                />
              </Form.Item>
              <Button type="primary" onClick={this.handleSelect}>
                Select
              </Button>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Create new" key='create'>
            <Row>
              <Col span={12}>
                <TextField 
                  label="Name"
                  placeholder="Name"
                  name="name"
                  onChange={this.handleChange}
                  value={name}
                />
                <Form.Item
                  {...this.formItemLayout}
                  label="Title"
                >
                  <Select
                    placeholder="Title"
                    value={title}
                    onChange={this.handleTitle}
                  >
                    <Select.Option value="mr"> mr </Select.Option>
                    <Select.Option value="mrs"> mrs </Select.Option>
                    <Select.Option value="ms"> ms </Select.Option>
                  </Select>
                </Form.Item>
                <TextField 
                  label="Phone"
                  placeholder="Phone"
                  name="phone"
                  onChange={this.handleChange}
                  value={phone}
                />
                <TextField 
                  label="Email"
                  placeholder="Email"
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                />
                <TextField  
                  label="ID Card"
                  placeholder="ID Card"
                  name="idcard"
                  onChange={this.handleChange}
                  value={idcard}
                />
              </Col>
              <Col span={12}>
                <TextField 
                  label="Address"
                  placeholder="Address"
                  name="address"
                  onChange={this.handleChange}
                  value={address}
                />
                <TextField 
                  label="Zipcode"
                  placeholder="Zipcode"
                  name="zipcode"
                  onChange={this.handleChange}
                  value={zipcode}
                />
                <TextField 
                  label="Country"
                  placeholder="Country"
                />
                <TextField 
                  label="State"
                  placeholder="State"
                />
                <TextField 
                  label="City"
                  placeholder="City"
                />
              </Col>
            </Row>
            <Button type="primary" onClick={this.handleSubmit}>
              Add new
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    );
  };
}

export default GuestForm;