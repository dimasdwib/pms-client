import React from 'react';
import { Skeleton } from 'antd';

class PageLoader extends React.Component {
  render() {
    return <div style={{ padding: 20 }}><Skeleton active /></div>;
  }
}

export default PageLoader;