import React, { useEffect, useState } from "react"
import { Form, Input, Button, Select, message, Row, Popconfirm, Modal, Tooltip, Space, Table, Switch } from 'antd'
import MaskedInput from 'antd-mask-input'
import { SearchOutlined, DeleteFilled, PlusSquareOutlined, CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { FormDefault, ColDefault, FormItemDefault, TitleDefault, GreenButton } from '../styles/Form.styles'
import { GetServerSideProps } from "next"
import { LoadSSRProps } from '../src/loadSsrProps'
import api from '../src/backendApi'

interface usuario {
  id: string;
  nome: string;
  email: string;
  fone: string;
  senha: string;
  dispositivos: Array<infosDisp>
}

interface infosMod {
  _id: string;
  nome: string;
  prefSerie: string;
  qtdItens: number;
  qtdSensores: number;
  customizado: boolean;
}

interface infosDisp {
  _id: string;
  idModelo: string;
  nome: string;
  modelo: infosMod;
  nrserie: string;
  senha: string;
  ativo: boolean;
}

interface Props {
  modelosDB: Array<infosDisp>
}

function Users({ modelosDB }: Props): JSX.Element {
  
  // console.log('Modelos')
  // console.log(modelosDB)

  const { Search } = Input;
  const { Option } = Select;
  const [cadastros] = Form.useForm()

  const [usuario, setUsuario] = useState<usuario>()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [modelo,setModelos]=useState()
  const [tabelaDispositivos, setTabelaDispositivos] = useState<Array<infosDisp>>([])
  const [dispositivo, setDispositivo ] = useState<infosDisp>(undefined)
  const [modalEdit, setModalEdit] = useState(false);

  let key = 'updatable'

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    achaUser()
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /* Modal Adicionar dispositivo */
  const showModalAdd = () => {
    setModalAdd(true);
  };

  const handleOkAdd = () => {
    setModalAdd(false);
  };

  const handleCancelAdd = () => {
    setModalAdd(false);
  };

  const handleOkEdit = () => {
    setModalEdit(false);
  };

  const handleCancelEdit = () => {
    setModalEdit(false);
  };

  const showModalEdit = () => {
    setModalEdit(true);
  };

  const achaUser = async () => {
    // await axios.get(`http://localhost:3002/usuarios/pesquisausuario?nomeUser=${cadastros.getFieldValue("pesquisa")}`)
    await api.get(`usuarios/pesquisausuario?nomeUser=${cadastros.getFieldValue("pesquisa")}`)
    .then((retorno) => {
      const usuarioVindo = {
        id: retorno.data._id,
        nome: retorno.data.nome,
        email: retorno.data.email,
        fone: retorno.data.fone.toString(),
        senha: '',
        dispositivos: retorno.data.dispositivos
      }
      setUsuario(usuarioVindo)
      if (!retorno.data) message.error('Usuário não encontrado');
      console.log('qualquer coisa escrita')
      console.log(retorno.data)

    }).catch((erro) => {

      console.log(erro)
    })

  }

  useEffect(() => {
    if (!usuario) return
    console.log("Useeffect do usuário...")
    cadastros.setFieldsValue(usuario)
    console.log(usuario.dispositivos)
    
  }, [usuario])


  const deletar = async () => {
    message.loading({ content: 'Um momento, por favor...', key });
    await api.delete(`usuarios/${cadastros.getFieldValue("id")}`)
    .then((retorno) => {
      message.success({ content: 'Usuário deletado com sucesso!', key, duration: 2 });
      cadastros.resetFields()
    }).catch((erro) => {
      message.error('Falha ao deletar o usuário, tente novamente.');
      console.log(erro)
    })
  }

  const cancelar = () => { cadastros.resetFields() }

  async function setValues(valores: usuario) {
    const novoUser = {
      nome: valores.nome,
      id: valores.id,
      email: valores.email,
      fone: valores.fone.toString().replace(/\D/g, ""),
      senha: valores.senha,
      dispositivos: usuario?.dispositivos
    }
    console.log('Valores do formulário')
    console.log(novoUser)

    if (valores.id) {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.put(`usuarios/${valores.id}`, novoUser).then((retorno) => {
        console.log(retorno)
        message.success({ content: 'Alterado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
      }).catch((erro) => {
        message.error('Falha ao editar usuário, tente novamente.');
        console.log(erro)
      })
    } else {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.post('novoUsuario', novoUser).then((retorno) => {
        message.success({ content: 'Cadastrado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
        console.log(retorno)
      }).catch((erro) => {
        message.error('Falha ao cadastrar usuário, tente novamente.');
        console.log(erro)
      })
    }

  }

  //Tabela

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Modelo',
      dataIndex: ['modelo', 'nome'],
      key:'modelo.nome'
    },
    {
      title: 'Itens',
      dataIndex: 'Itens',
    },
    {
      title: 'Excluir',
      dataIndex: 'excluir',
      render: (nome, record) => (
        <Button onClick={() => {
          onDeleteDispositivo(record)
        }} style={{ color: "red" }}>
          <DeleteFilled />
        </Button>
      )
    },
    {
      title: 'Editar',
      dataIndex: 'editar',
      render: (nome, record) => (
        <Button onClick={() => {
          onEditDispositivo(record)
        }} style={{ color: "yellow" }}>
          <EditOutlined />
        </Button>
      )
    },

  ];


  const onEditDispositivo=(record)=>{
    console.log('record interno')
    console.log(record)
    setDispositivo(record)
    showModalEdit()
  }

  const addDispositivo= async (valores)=>{
    valores.itens = []

    console.log('usuario')
    console.log(usuario)

    // const novoDispositivo = await axios.post(`http://localhost:3001/novoDispositivo`,{valores}).then((retorno) => {
    const novoDispositivo = await api.post(`novoDispositivo`,{valores}).then((retorno) => {
      message.success({ content: 'Dispositivo cadastrado com sucesso!', key, duration: 2 });
      console.log(retorno.data)
      return retorno.data
    }).catch((erro) => {
      message.error('Falha ao deletar o usuário, tente novamente.');
      console.log(erro)
      return undefined
    })

    const dispositivosAtuais = usuario.dispositivos || []
    if(novoDispositivo) dispositivosAtuais.push(novoDispositivo)

    const novoUsuario = {
      nome: usuario.nome,
      fone: usuario.fone,
      email: usuario.email,
      dispositivos: dispositivosAtuais,
      senha: usuario.senha,
      id: usuario.id
    }

    console.log('novoUsuario')
    console.log(novoUsuario)
    
    setUsuario(novoUsuario)
  }

  const getNomeModelo=(inputValue, option)=>{
    setModelos(option.children)
  }

  async function onDeleteDispositivo(record) {

    let novoDispositivos = usuario.dispositivos.filter(dispo => {
      return dispo.idModelo != record.idModelo
    })

    let novoUsuario = {
      nome: usuario.nome,
      fone: usuario.fone,
      email: usuario.email,
      dispositivos: novoDispositivos,
      senha: usuario.senha,
      id: usuario.id
    }

    setUsuario(novoUsuario)

  }

  let selecionados
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: infosDisp[]) => {
      selecionados = selectedRows
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

    }
  };

  console.log(selecionados)
  return (

    <Row >
      <TitleDefault>Cadastro de usuários</TitleDefault>
      <FormDefault
        name="basic"
        initialValues={{ remember: false }}
        autoComplete="off"
        form={cadastros}
        onFinish={setValues}
        {...layout}
      >

        <ColDefault style={{ paddingTop: '40px', paddingBottom: '40px' }}>

          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <FormItemDefault
            label="Nome"
            rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
          >
            <Space>
              <Form.Item name="nome" style={{ width: '350px', margin: 0 }} >
                <Input placeholder="Nome" />
              </Form.Item>
              <Tooltip title="Useful information">
                <SearchOutlined onClick={showModal} />
              </Tooltip>
            </Space>
          </FormItemDefault>

          <FormItemDefault
            label="E-mail"
            name="email"
            rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
          >
            <Input placeholder="usuário@gmail.com" />
          </FormItemDefault>

          <FormItemDefault
            label="Telefone"
            name="fone"
            rules={[{ required: true, message: 'Por favor, insira seu telefone.' }]}

          >
            <MaskedInput mask="(11) 1 1111-1111" style={{ width: '100%' }} placeholder="(99) 99999-9999" min={0} max={9999999999} />
          </FormItemDefault>

          <FormItemDefault
            label="Senha"
            name="senha"
            rules={[{ required: true, message: 'Por favor, digite sua senha.' }]}
          >
            <Input.Password />
          </FormItemDefault>

          <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Form.Item
              label="Usuário"
              name="pesquisa"
              rules={[{ required: true, message: 'Por favor, digite um usuário.' }]}
            >
              <Search placeholder="Procurar usuário" onSearch={handleOk} enterButton />
            </Form.Item>
          </Modal>
          <Modal title="Editar" visible={modalEdit} onOk={handleOkEdit} onCancel={handleCancelEdit}>
                <FormDefault
                  name="formEditDispositivo"
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
                    initialValue={dispositivo?.nome}
                  >
                    <Input placeholder="Nome"/>

                  </FormItemDefault>
                  <FormItemDefault
                    label="Modelo"
                    name="idModelo"
                    rules={[{ required: true, message: 'Por favor, digite um id.' }]}
                    initialValue={{value:dispositivo?.modelo._id, key:dispositivo?.modelo.nome}}
                  >
                    <Select onChange={getNomeModelo} style={{ width: '100%' }}>
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
                </FormDefault>
          </Modal>
          <Modal title="Adicionar" visible={ModalAdd} onOk={handleOkAdd} onCancel={handleCancelAdd}>
            <Row >

              <ColDefault style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <FormDefault
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
                    <Select onChange={getNomeModelo} style={{ width: '100%' }}>
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

                  <FormItemDefault >
                    <Button type="primary" htmlType="submit">
                      Salvar
                    </Button>
                  </FormItemDefault>

                </FormDefault>
              </ColDefault>
            </Row>
          </Modal>

        </ColDefault>
        <GreenButton onClick={showModalAdd}> <PlusSquareOutlined /> </GreenButton>
        <ColDefault>

          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={[...usuario.dispositivos]}
          />

        </ColDefault>

        <FormItemDefault >
          <Button type="primary" htmlType="submit">
            Salvar
          </Button>

          <Popconfirm placement="bottom"
            title={'Tem certeza que dejesa excluir?'}
            onConfirm={deletar}
            okText="Sim"
            cancelText="Não">
            <Button>Excluir</Button>
          </Popconfirm>

          <Button onClick={cancelar}>
            Cancelar
          </Button>
          <Button onClick={() => {
            console.log("=-=-=-=-=-=-=-=-=-=-=-")
            console.log("usuario:")
            console.log(usuario)
            console.log("=-=-=-=-=-=-=-=-=-=-=-")
          }}>
            Mostrar Usuário
          </Button>

        </FormItemDefault>

      </FormDefault>

    </Row >
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const modelosDB = await LoadSSRProps('todosModelos', context)
    return {
      props: {
        modelosDB,
      },
    }
  } catch (error) {
    return { props: {} }
  }
}

export default Users;