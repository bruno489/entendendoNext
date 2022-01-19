import 'antd/dist/antd.css';
import {Layout} from 'antd'
import MenuExport from '../componentes/menu';


function MyApp({ Component, pageProps }) {
  const {Sider, Content} = Layout
  return <div>
    <Layout>
      <Sider>
        <MenuExport />
      </Sider>
      <Content>
        <Component {...pageProps} />
      </Content>
    </Layout>
    </div>
  
}

export default MyApp
