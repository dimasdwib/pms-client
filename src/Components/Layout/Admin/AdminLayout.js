import React from 'react';
import { Layout } from 'antd';
import SideMenu from './SideMenu';
import AuthProvider from '../../../Providers/AuthProvider';

const { Content, Footer, Header, Sider } = Layout;

class AdminLayout extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse(collapsed){
    this.setState({ collapsed });
  }

  render() {
    return (
      <AuthProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            width={200}
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            style={{
              overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
            }}
          >
            <SideMenu match={this.props.match} />
          </Sider>
          <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200 }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#fff', padding: '0 16px' }}> Header </Header>
            <Content style={{ padding: '16px', marginTop: 64 }}>
              <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                {this.props.children}
              </div>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
        </Layout>
      </AuthProvider>
    );
  }
}

export default AdminLayout;
