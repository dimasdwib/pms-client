import React from 'react';
import { Layout } from 'antd';
import SideMenu from './SideMenu';
import AuthProvider from '../../../Providers/AuthProvider';

const { Content, Footer, Header, Sider } = Layout;

class AdminLayout extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.onCollapse = this.onCollapse.bind(this);
  }

  onCollapse(collapsed){
    this.setState({ collapsed });
  }

  bgColor = '#001529';

  render() {
    return (
      <AuthProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            width={200}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            style={{
              overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
            }}
          >
            <SideMenu match={this.props.match} />
          </Sider>
          <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200, backgroundColor: this.bgColor }}>
            <Header style={{ height: 40, lineHeight: '14px', position: 'fixed', zIndex: 1, width: '100%', background: this.bgColor, padding: '12px 0', color: 'rgba(255, 255, 255, 0.65)' }}>
              <div style={{ textAlign: 'center', margin: 'auto', marginRight: '3%' }}>
                Property Management System
              </div>
            </Header>
            <Content style={{ marginTop: 40, background: '#fff', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, height: '79vh', overflow: 'auto' }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                {this.props.children}
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', height: 40, padding: 8, backgroundColor: this.bgColor, color: 'rgba(255, 255, 255, 0.65)' }}>
              <small>Property Management System &copy; 2019 </small>
            </Footer>
          </Layout>
        </Layout>
      </AuthProvider>
    );
  }
}

export default AdminLayout;
