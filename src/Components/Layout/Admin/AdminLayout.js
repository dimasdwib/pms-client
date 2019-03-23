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

  bgColor = '#001529';

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
          <Layout style={{ marginLeft: this.state.collapsed ? 80 : 200, backgroundColor: this.bgColor }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: this.bgColor, padding: '0 16px', color: 'rgba(255, 255, 255, 0.65)' }}> Header </Header>
            <Content style={{ padding: '16px', marginTop: 64, background: '#fff', borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}>
              <div style={{ padding: 24, minHeight: 360 }}>
                {this.props.children}
              </div>
            </Content>
            <Footer style={{ backgroundColor: this.bgColor, color: 'rgba(255, 255, 255, 0.65)' }}>&copy;2019</Footer>
          </Layout>
        </Layout>
      </AuthProvider>
    );
  }
}

export default AdminLayout;
