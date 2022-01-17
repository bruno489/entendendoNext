import React from 'react'
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu'
import {useRouter} from 'next/router';

import {
  AppstoreOutlined,
  TeamOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';


function MenuExport() {
  const router = useRouter()
  const ChamaIndex = ()=>{ router.push('/') }
  const ChamaDisp=()=>{ router.push('/dispositivos') }
  const ChamaMod=()=>{ router.push('/modelo') }
  return <div >
  
  <Menu
    defaultSelectedKeys={['1']}
    defaultOpenKeys={['sub1']}
    mode="inline"
    theme="dark"
    inlineCollapsed={false}
  >
    <Menu.Item key="1" icon={<TeamOutlined />} onClick={ChamaIndex}>
      Usuários
    </Menu.Item>
    <Menu.Item key="2" icon={<TeamOutlined />} onClick={ChamaDisp}>
      Dispositivos
    </Menu.Item>
    <Menu.Item key="3" icon={<TeamOutlined />} onClick={ChamaMod}>
      Modelos
    </Menu.Item>
   
  </Menu>
</div>
}

export default MenuExport
