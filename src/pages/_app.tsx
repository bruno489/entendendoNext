import 'antd/dist/antd.css';
import { Layout } from 'antd'
import MenuExport from '../componentes/menu';

function MyApp({ Component, pageProps }) {
  const { Sider, Content, Header } = Layout

  return <Layout style={{ width: '100%' }} >

    <Sider style={{
      overflow: 'auto',
      height: '100vh',
      left: 0,
      top: 0,
      bottom: 0,
    }}>
      <div style={{ height: '50px', color: 'white', textAlign: 'center' }}>Lauro Dev</div>
      <MenuExport />
    </Sider>
    <Content>
      <Component {...pageProps} />
    </Content>

  </Layout>

}

export default MyApp
