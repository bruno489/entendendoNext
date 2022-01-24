import React,{Dispatch, SetStateAction, useEffect, useState} from "react"
import { Form, Input,Table , Row, Space, Col, Button,Tag, Select, Modal, Switch, Divider, Popconfirm, Typography } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { FormDefault, FormItemDefault } from '../../../styles/Form.styles'
import { InfosDisp } from '../interfaces/infosDisp'
import { Usuario } from "../interfaces/usuario"
import { Itens } from '../interfaces/itens';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';

interface Props {
  modalEdit: boolean;
  closeModalEdit: () => void;
  sendEditDispositivo: (valores: any) => Promise<void>;
  dispositivo: InfosDisp;
  modelosDB: Array<InfosDisp>;
  usuario:Usuario;
  setUsuario: Dispatch<SetStateAction<Usuario>>;
  setTabItens: Dispatch<SetStateAction<any[]>>;
  tabItens:any[];
}

const { Title } = Typography;

export default function ModalEditar({ modalEdit, closeModalEdit, sendEditDispositivo, dispositivo, modelosDB,usuario,setTabItens,tabItens}: Props) {
  const { Option } = Select;
  console.log('dispositivo')
  console.log(dispositivo)
  
  const [cadItens] = Form.useForm()
  const [sensor,setSensor] = useState<boolean>()
  const [ligado,setLigado] = useState<boolean>()
  const [ativo,setAtivo] = useState<boolean>()
  const dispositivoVindo = dispositivo;
  const usuarioVindo = usuario;

  useEffect(()=>{
    (!dispositivo)?setTabItens([]):setTabItens(dispositivo?.itens);
  },[dispositivo])

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome'
    },
    {
      title: 'Sensor',
      dataIndex: 'sensor',
      render:(sensor: boolean)=>(
        <Tag color={sensor ? 'green' : 'volcano'}>
          {sensor ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Ligado',
      dataIndex: 'ligado',
      render:(ligado:boolean)=>(
        <Tag color={ligado ? 'green' : 'volcano'}>
          {ligado ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      render:(ativo:boolean)=>(
        <Tag color={ativo ? 'green' : 'volcano'}>
          {ativo ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Editar/Excluir',
      dataIndex: 'acao',
      render:(nome,record)=>(
        <Space>
          <Button onClick={()=>{edit(record)}} style={{ color: "yellow" }}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este item?"
            onConfirm={()=>{deleteItem(record)}}
            okText="Sim"
            cancelText="Não"
          >
          <Button style={{ color: "red" }}>
            <DeleteFilled />
          </Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const edit=(valores:Itens)=>{
    setAtivo(valores.ativo)
    setLigado(valores.ligado)
    setSensor(valores.sensor)
    cadItens.setFieldsValue(valores)
    console.log('valores edit')
    console.log(valores)
  }

  function deleteItem(valores){
    const novosItens=tabItens.filter(item=>{
      return valores.nome != item.nome
    })

    setTabItens(novosItens)

  }

  function addItem(valores:Itens){
    if(!valores._id){
      const item={
        _id: Math.random()*1000,
        nome:valores.nome,
        sensor:valores.sensor,
        ligado:valores.ligado,
        ativo:valores.ativo,
        leituras:[]
      }
      setTabItens(itens => [...itens, item])
    }else{
      const novosItens=tabItens.filter(item=>{
        return valores._id != item._id
      })
      setTabItens(novosItens)
      const item={
        nome:valores.nome,
        sensor:valores.sensor,
        ligado:valores.ligado,
        ativo:valores.ativo,
        leituras:[]
      }
      setTabItens(itens => [...itens, item])
    }
    
    cadItens.resetFields()
  }

  const cancelCadItens = () => {
    cadItens.resetFields()
  }

  return <Modal title="Editar"
    visible={modalEdit}
    closable={false}
    width={800}

    footer={[
      <Button key="back" onClick={closeModalEdit}>
        Cancelar
      </Button>,
      <Button key="submit" form="formEditDispositivo" type="primary" htmlType="submit">
        Enviar
      </Button>
    ]}
  >
    <FormDefault
      name="formEditDispositivo"
      initialValues={{ remember: false }}
      autoComplete="off"
      onFinish={sendEditDispositivo}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <FormItemDefault
        name='idDispositivo'
        rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
        initialValue={dispositivo?._id}
        hidden
      >
        <Input />

      </FormItemDefault>
      <FormItemDefault
        label="Nome"
        name='nome'
        rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
        initialValue={dispositivo?.nome}
      >
        <Input placeholder="Nome" />

      </FormItemDefault>
      <FormItemDefault
        label="Modelo"
        name="idModelo"
        rules={[{ required: true, message: 'Por favor, digite um id.' }]}
        initialValue={ dispositivo?.modelo._id }
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
        valuePropName={(dispositivo?.ativo) ? "checked" : "unchecked"}
        initialValue={dispositivo?.ativo}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </FormItemDefault>
    </FormDefault>

    <Divider />

    <Title level={4}>Adicionar itens</Title>
    <Form
      onFinish={addItem}
      form={cadItens}
    >
      <Form.Item name='_id' hidden>
        <Input />
      </Form.Item>
      <Form.Item label='Nome' name='nome'>
        <Input />
      </Form.Item>

      <Row style={{justifyContent:'center'}}>
        <Col span={5}>
          <Form.Item  label='Sensor' name='sensor'>
            <Switch checked={sensor}  onClick={()=>{setSensor(!sensor)}}/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item  label='Ligado' name='ligado'>
            <Switch checked={ligado} onClick={()=>{setLigado(!ligado)}}/>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item  label='Ativo' name='ativo'>
            <Switch checked={ativo} onClick={()=>{setAtivo(!ativo)}}/>
          </Form.Item>
        </Col>
      </Row>

      <FormItemDefault>
        <Space>
          <Button type="primary" htmlType="submit">Adicionar item</Button>
          <Button onClick={cancelCadItens}>Cancelar</Button>
        </Space>
      </FormItemDefault>

    </Form>

    <Table columns={columns} dataSource={tabItens}/>

  </Modal>
}