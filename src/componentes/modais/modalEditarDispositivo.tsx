import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Form, Input, Table, Row, Space, Col, Button, Tag, Select, Modal, Switch, Divider, Popconfirm, Typography } from 'antd'
import { AppstoreAddOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { FormDefault, FormItemDefault } from '../../../styles/Form.styles'
import { FiltroDispositivo } from '../interfaces/filtroDispositivo'
import { ColumnsType } from 'antd/es/table'
import { FiltroItens } from '../interfaces/filtroItens';
import { EditOutlined, DeleteFilled } from '@ant-design/icons';
import api from "../../backendApi"

interface Props {
  estadoModalEditarDispositivo: boolean;
  closeModalEdit: () => void;
  editaAdicionaDispositivo: (dispositivo: FiltroDispositivo, index?:number) => Promise<void>;
  dispositivoVindoParaModal?: FiltroDispositivo;
  setDispositivoVaiParaModal: Dispatch<SetStateAction<FiltroDispositivo>>;
  modelosDB: Array<FiltroDispositivo>;
}

const { Title } = Typography;

export default function ModalEditarDispositivo({ estadoModalEditarDispositivo, closeModalEdit, editaAdicionaDispositivo, dispositivoVindoParaModal, setDispositivoVaiParaModal, modelosDB }: Props) {
  const { Option } = Select;

  const [cadItens] = Form.useForm()
  const [sensor, setSensor] = useState<boolean>()
  const [ligado, setLigado] = useState<boolean>()
  const [ativo, setAtivo] = useState<boolean>()
  const [dispAtualizado,setDispAtualizado] = useState<FiltroDispositivo>(undefined)
  const [formEditaDispositivo] = Form.useForm()
  const [itemEnviar,setItemEnviar] = useState<Array<FiltroItens>>([])

  useEffect(() => {
    console.log('dispositivo useffect da modal')
    console.log(dispositivoVindoParaModal)
    if (dispositivoVindoParaModal) {
      formEditaDispositivo.setFieldsValue(dispositivoVindoParaModal)
      setItemEnviar(dispositivoVindoParaModal.itens)
    }
  }, [dispositivoVindoParaModal])

  const columns: ColumnsType<any>= [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key:'nome'
    },
    {
      title: 'Sensor',
      dataIndex: 'sensor',
      key:'sensor',
      render: (sensor: boolean) => (
        <Tag color={sensor ? 'green' : 'volcano'}>
          {sensor ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Ligado',
      dataIndex: 'ligado',
      key:'ligado',
      render: (ligado: boolean) => (
        <Tag color={ligado ? 'green' : 'volcano'}>
          {ligado ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      key:'ativo',
      render: (ativo: boolean) => (
        <Tag color={ativo ? 'green' : 'volcano'}>
          {ativo ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Editar/Excluir',
      dataIndex: 'acao',
      key:'acao',
      render: (nome, record,index) => (
        <Space>
          <Button onClick={() => { adicionaEditarItem(record,index) }} style={{ color: "yellow" }}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este item?"
            onConfirm={() => { deleteItem(record,index) }}
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

  const adicionaEditarItem = (valores: FiltroItens,index:Number) => {
    cadItens.setFieldsValue(valores)
    cadItens.setFieldsValue({index})
  }

  function deleteItem(valores,index) {
    console.log('valores delete item')
    console.log(valores)

    setItemEnviar(itemEnviar.filter((item, idx) => idx !== index ))
  }

  async function addItem(valores: FiltroItens) {
    console.log('valores para add item')
    console.log(valores)

    const item = {
      _id: valores._id || null,
      nome: valores.nome,
      sensor: valores.sensor || false,
      ligado: valores.ligado || false,
      ativo: valores.ativo || false,
      leituras: []
    }

    if (valores.index>=0) {
      console.log('entrou no if do item')
      setItemEnviar(itens => [
        ...itens.slice(0, valores.index),
        item,
        ...itens.slice(valores.index + 1),
      ])
    } else {
      console.log('entrou no else do item')
      setItemEnviar([...itemEnviar, item])
    }

    cadItens.resetFields()
  }

  const cancelCadItens = () => {
    //cadEditaDisp.resetFields()
    cadItens.resetFields()
  }

  const envia = (valores) => {
    //editaAdicionaDispositivo(valores,dispAtualizado)
    formEditaDispositivo.resetFields()
    closeModalEdit()
  }

  return <Modal title="Editar"
    visible={estadoModalEditarDispositivo}
    closable={false}
    width={800}

    footer={[
      <Button key="back" onClick={() => { formEditaDispositivo.resetFields(); closeModalEdit(); }}>
        Cancelar
      </Button>,
      <Button key="submit" form="formEditDispositivo" type="primary" htmlType="submit">
        Enviar
      </Button>
    ]}
  >
    <FormDefault
      name="formEditDispositivo"
      onFinish={envia}
      form={formEditaDispositivo}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <FormItemDefault
        name='id'
        hidden
      >
        <Input />

      </FormItemDefault>
      <FormItemDefault
        label="Nome"
        name='nome'
        rules={[{ required: true, message: 'Por favor, digite um nome.' }]}
      >
        <Input placeholder="Nome" />

      </FormItemDefault>
      <FormItemDefault
        label="Modelo"
        name="idModelo"
        rules={[{ required: true, message: 'Por favor, selecione um modelo.' }]}
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
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </FormItemDefault>
    </FormDefault>

    <Divider />

    <Title level={4}>Adicionar itens</Title>
    <Form
      name="formAddItem"
      onFinish={addItem}
      form={cadItens}
    >
      <Form.Item name='index' hidden>
        <Input />
      </Form.Item>
      <Form.Item name='_id' hidden>
        <Input />
      </Form.Item>
      <Form.Item label='Nome' name='nome' rules={[{ required: true, message: 'Por favor, digite o nome do item.' }]}>
        <Input />
      </Form.Item>

      <Row style={{ justifyContent: 'center' }}>
        <Col span={5}>
          <Form.Item label='Sensor' name='sensor' valuePropName="checked">
            <Switch checked={sensor} onClick={() => { setSensor(!sensor) }} />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='Ligado' name='ligado' valuePropName="checked">
            <Switch checked={ligado} onClick={() => { setLigado(!ligado) }} />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label='Ativo' name='ativo' valuePropName="checked">
            <Switch checked={ativo} onClick={() => { setAtivo(!ativo) }} />
          </Form.Item>
        </Col>
      </Row>

      <FormItemDefault>
        <Space>
          <Button type="primary" htmlType="submit" form="formAddItem">Adicionar item</Button>
          <Button onClick={cancelCadItens}>Cancelar</Button>
        </Space>
      </FormItemDefault>

    </Form>

    <Table
      columns={columns}
      dataSource={itemEnviar}
      locale={{
        emptyText: (<>
          <AppstoreAddOutlined style={{ fontSize: '50px' }} />
          <p style={{ fontSize: '30px' }}>Adicione um item.</p>
        </>)
      }}
    />

  </Modal>
}