import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu  } from 'antd';
import SideMenuData from './SideMenuData';
import { ProtectComponent } from '../../../Helper/AuthHelper'; 

const { SubMenu } = Menu;
class SideMenu extends React.Component {

  constructor(props) {
    super(props);
    this.mapMenu = this.mapMenu.bind(this);
  }

  componentDidMount() {
    const ACTIVE_MENU = this.searchByPath(this.props.match.location.pathname, SideMenuData);
    if (ACTIVE_MENU) {
      this.setState({
        activeMenu: [ACTIVE_MENU.id],
      });
    }
  }

  mapMenu(SideMenuData) {
    const MainMenu = [];
    SideMenuData.forEach((menu, i) => {
      if (menu.child) {
        const child = this.mapMenu(menu.child, true);
        MainMenu.push(
          <SubMenu 
            key={menu.id || i} 
            title={
              <span>
                {menu.icon ? <Icon type={menu.icon} /> : null }
                <span>{menu.label}</span>
              </span>
            }
          >
            {child}
          </SubMenu>
        );
      } else {
        if (menu.action) {
          MainMenu.push(
            <Menu.Item key={menu.id || i} onClick={() => menu.action()}>
              {menu.icon ? <Icon type={menu.icon} /> : null }
              <span>{menu.label}</span>
            </Menu.Item>
          );
        } else {
          MainMenu.push(
            <Menu.Item key={menu.id || i}>
              <Link to={menu.path}>
                {menu.icon ? <Icon type={menu.icon} /> : null }
                <span>{menu.label}</span>
              </Link>
            </Menu.Item>
          );
        }
      }
    });
    return MainMenu;
  }

  searchByPath(path, arr) {
    for(let i = 0; i < arr.length; i += 1) {
      if (arr[i].child) {
        return this.searchByPath(path, [...arr[i].child]);
      } else if (arr[i].path === path) {
        return arr[i];
      }
    }
  }

  render() {
    const MAIN_MENU = this.mapMenu(SideMenuData);
    return (
      <Menu
        style={{ height: '100%', borderRight: 0 }}
        theme="dark"
        mode="inline"
      >
        {MAIN_MENU}
      </Menu>
    );
  }
}

export default SideMenu;