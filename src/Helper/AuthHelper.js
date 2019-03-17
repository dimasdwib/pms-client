import React from 'react';
import { Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AdminUrl } from './RouteHelper';

const { confirm } = Modal;

export function logout() {
  localStorage.removeItem('aToken');
  window.location.href = '/';
}

export function confirmLogout() {
  confirm({
    title: 'Are you sure want to logout?',
    content: '',
    icon: <Icon type="logout" />,
    onOk() {
      logout();
    },
  });
}

const ProtectComponentComp = (props) => {
  const arrPermission = [];
  const allPermission = props.auth.user.all_permission;
  allPermission.forEach(p => { arrPermission.push(p.name) });

  if (props.permission) {
    if (typeof props.permission === 'object') {
      console.log('object type', props.permission, arrPermission);
    }
    if (typeof props.permission === 'string') {
      if (!arrPermission.includes(props.permission)) {
        return null;
      }
    }
  }
  return props.children;
}

const ProtectPageComp = (props) => {
  const arrPermission = [];
  const allPermission = props.auth.user.all_permission;
  allPermission.forEach(p => { arrPermission.push(p.name) });

  if (props.permission) {
    if (typeof props.permission === 'object') {
      console.log('object type', props.permission, arrPermission);
    }
    if (typeof props.permission === 'string') {
      if (!arrPermission.includes(props.permission)) {
        return <Redirect to={AdminUrl('/401')} />
      }
    }
  }
  return props.children;
}

function mapStateToProps(state) {
  return {
    auth: state.Auth,
  }
}

export const ProtectPage = connect(mapStateToProps)(ProtectPageComp);
export const ProtectComponent = connect(mapStateToProps)(ProtectComponentComp);