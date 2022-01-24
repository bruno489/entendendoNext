import React from "react"
import { Form, Input, Col, Button, Select, message, Row, Popconfirm, Modal, Tooltip, Space, Table, Switch } from 'antd'
import { FormItemDefault, TitleDefault, GreenButton } from '../../../styles/Form.styles'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {InfosDisp} from '../interfaces/infosDisp'

interface Props{
  ModalAdd:boolean;
  handleOkAdd:()=>void;
  handleCancelAdd:()=>void;
  addDispositivo:(valores: any) => Promise<void>;
  modelosDB:Array<InfosDisp>
}

export default function ModalAdicionar({ModalAdd,handleOkAdd,handleCancelAdd,addDispositivo,modelosDB}:Props) {
  const { Option } = Select;

  return <Modal 
          title="Adicionar" 
          visible={ModalAdd} 
          onCancel={handleCancelAdd}
          footer={[
            <Button key="back" onClick={handleCancelAdd}>
              Cancelar
            </Button>,
            <Button key="back" type="primary" htmlType="submit">
              Enviar
            </Button>
          ]}
          >
  <Row >

    <Col style={{width:'100%'}}>
      <Form
        name="basic"
        initialValues={{ remember: false }}
        autoComplete="off"
        onFinish={addDispositivo}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <FormItemDefault
          label="Nome"
          name='nome'
          rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
        >
          <Input placeholder="Nome"/>

        </FormItemDefault>
        <FormItemDefault
          label="Modelo"
          name="idModelo"
          rules={[{ required: true, message: 'Por favor, digite um id.' }]}
          initialValue="Modelo"
        >
          <Select style={{ width: '100%' }}>
            {modelosDB?.map((modelo) => {
              return (<Option key={modelo._id} value={modelo._id}>{modelo.nome}</Option>)
            })
            }
          </Select>
        </FormItemDefault>

        <FormItemDefault
          name='ativo'
          label='Ativo'
          style={{ width: '150px', marginLeft: '5px' }}
          labelCol={{ span: 15 }}
          wrapperCol={{ span: 9 }}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
        </FormItemDefault>

      </Form>
    </Col>
  </Row>
</Modal>
}