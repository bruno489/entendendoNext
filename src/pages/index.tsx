import React, { useEffect, useState } from "react"
import { Form, Input, Button, message, Row, Col, Popconfirm, Tag, Space, Table, Layout } from 'antd'
import MaskedInput from 'antd-mask-input'
import { SearchOutlined, DeleteFilled, PlusSquareOutlined, EditOutlined } from '@ant-design/icons'
import { FormDefault, FormItemDefault, TitleDefault, GreenButton } from '../../styles/Form.styles'
import { GetServerSideProps } from "next"
import { LoadSSRProps } from '../loadSsrProps'
import api from '../backendApi'
import ModalEditar from '../componentes/modais/modalEditar'
import ModalAdicionar from '../componentes/modais/modalAdicionar'
import ModalPesquisaUsuario from '../componentes/modais/modalPesquisaUsuario'
import { Usuario } from '../componentes/interfaces/usuario'
import { InfosDisp } from '../componentes/interfaces/infosDisp'
import { Itens } from '../componentes/interfaces/itens'

interface Props {
  modelosDB: Array<InfosDisp>
}

function Users({ modelosDB }: Props): JSX.Element {
  const { Header, Sider, Content } = Layout;
  const { Search } = Input;
  const [cadastros] = Form.useForm()

  const [usuario, setUsuario] = useState<Usuario>()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalAdd, setModalAdd] = useState(false);
  const [dispositivo, setDispositivo] = useState<InfosDisp>(undefined)
  const [tabItens, setTabItens] = useState([])
  const [modalEdit, setModalEdit] = useState(false);


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

  const showModalEdit = () => {
    setModalEdit(true);
  };
  const closeModalEdit = () => {
    setModalEdit(false);
  };

  const achaUser = async () => {
    const key = 'user'
    message.loading({ content: 'Um momento, por favor...', key });
    await api.get(`usuarios/pesquisausuario?nomeUser=${cadastros.getFieldValue("pesquisa")}`)
      .then((retorno) => {
        message.success({ content: 'Usuário encontrado!', key });
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

      }).catch((erro) => {
        message.error('Erro ao encontrar usuário.')
        console.log(erro)
      })

  }

  useEffect(() => {
    if (!usuario) return
    console.log("Useeffect do usuário...")
    cadastros.setFieldsValue(usuario)

    console.log('tá chegando do useEffect')
  }, [usuario, cadastros])

  const deletar = async () => {
    let key = 'deletar'
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

  const cancelar = () => { cadastros.resetFields();setUsuario(undefined) }

  const setValues = async valores => {
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
    const key = 'alterar'
    if (valores.id) {

      message.loading({ content: 'Um momento, por favor...', key });
      await api.put(`usuarios/${valores.id}`, novoUser).then((retorno) => {
        console.log(retorno)
        message.success({ content: 'Alterado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
        setUsuario(undefined)
      }).catch((erro) => {
        message.error('Falha ao editar usuário, tente novamente.');
        console.log(erro)
      })
    } else {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.post('novoUsuario', novoUser).then((retorno) => {
        message.success({ content: 'Cadastrado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
        setUsuario(undefined)
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
    },
    {
      title: 'Itens',
      dataIndex: 'itens',
      render: (itens) => (
        <>
          {itens.map((item) => {
            return <Tag color='geekblue'>{item.nome}</Tag>
          })}
        </>

      )
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      render: (ativo: boolean) => (
        <Tag color={ativo ? 'green' : 'volcano'}>
          {ativo ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Editar/Deletar',
      dataIndex: 'Acao',
      render: (nome, record) => (
        <Space>
          <Button onClick={() => {
            onEditDispositivo(record)
          }} style={{ color: "yellow" }}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este dispositivo?"
            onConfirm={()=>onDeleteDispositivo(record)}
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


  const onEditDispositivo = (record) => {
    console.log('usuario antes add')
    console.log(usuario)
    console.log('record interno')
    console.log(record)
    setDispositivo(record)
    showModalEdit()

  }

  //send
  const sendEditDispositivo = async (valores) => {
    console.log('valores')
    console.log(valores)

    const novoModelo = await api.get(`modelosid/${valores.idModelo}`).then(resultado => {
      return resultado.data
    }).catch(resultado => {
      console.log('retorno deu errado')
      console.log(resultado)
    })

    const dispositivoEscolhido = usuario.dispositivos.find(dispositivo => {
      return dispositivo._id == valores.idDispositivo
    })

    console.log('dispositivoEscolhido')
    console.log(dispositivoEscolhido)

    const novoDispositivo = {
      ativo: valores.ativo,
      _id: valores.idDispositivo,
      idModelo: dispositivoEscolhido.modelo._id,
      itens: tabItens,
      nome: valores.nome,
      modelo: novoModelo,
      nrserie: dispositivoEscolhido.nrserie,
      senha: dispositivoEscolhido.senha
    }


    let index = usuario.dispositivos.findIndex(dispositivo => {
      return dispositivo._id != valores.idDispositivo
    })

    if (novoDispositivo) usuario.dispositivos.splice(index, 1, novoDispositivo)
    setModalEdit(false)
  }

  const addDispositivo = async (valores) => {
    valores.itens = []
    const key = 'addDisp'
    message.loading({ content: 'Um momento, por favor...', key })
    // const novoDispositivo = await axios.post(`http://localhost:3001/novoDispositivo`,{valores}).then((retorno) => {
    const novoDispositivo = await api.post(`novoDispositivo`, { valores }).then((retorno) => {
      message.success({ content: 'Dispositivo cadastrado com sucesso!', key, duration: 2 });
      console.log(retorno)
      setModalAdd(false);
      return retorno.data
    }).catch((erro) => {
      message.error('Falha ao deletar o usuário, tente novamente.');
      console.log(erro)
      return undefined
    })

    const dispositivosAtuais = usuario.dispositivos || []
    if (novoDispositivo) dispositivosAtuais.push(novoDispositivo)

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
    console.log('usuario apos add')
    console.log(usuario)

  }

  async function onDeleteDispositivo(record) {

    let novoDispositivos = usuario.dispositivos.filter(dispo => {
      return dispo._id != record._id
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
    onChange: (selectedRowKeys: React.Key[], selectedRows: InfosDisp[]) => {
      selecionados = selectedRows
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

    }
  };

  console.log(selecionados)
  return (<Layout>


    <Content style={{ marginTop: '20px' }}>

      <Layout>
        <TitleDefault style={{ textAlign: 'center' }} >Cadastro de usuários</TitleDefault>
        <FormDefault
          name="basic"
          initialValues={{ remember: false }}
          autoComplete="off"
          form={cadastros}
          onFinish={setValues}
          {...layout}
        >
          <Row>

            <Col span={11}>


              <Col style={{ paddingTop: '40px', paddingBottom: '40px' }}>

                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>

                <FormItemDefault
                  name="nome"
                  label="Nome"
                  rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
                >
                  <Search placeholder="Nome" onSearch={showModal} enterButton />

                </FormItemDefault>

                <FormItemDefault
                  label="E-mail"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor, digite um E-mail.' },
                    {type:'email',message:'Formato de e-mail inválido.'}
                  ]}
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

                <ModalPesquisaUsuario
                  isModalVisible={isModalVisible}
                  handleOk={handleOk}
                  handleCancel={handleCancel}

                />

                <ModalEditar
                  modalEdit={modalEdit}
                  closeModalEdit={closeModalEdit}
                  sendEditDispositivo={sendEditDispositivo}
                  dispositivo={dispositivo}
                  modelosDB={modelosDB}
                  usuario={usuario}
                  setUsuario={setUsuario}
                  setTabItens={setTabItens}
                  tabItens={tabItens}
                />

                <ModalAdicionar
                  ModalAdd={ModalAdd}
                  handleOkAdd={handleOkAdd}
                  handleCancelAdd={handleCancelAdd}
                  addDispositivo={addDispositivo}
                  modelosDB={modelosDB}
                />

              </Col>

            </Col>

            <Col span={12}>
              <GreenButton type="primary" onClick={showModalAdd}> Adicionar Dispositivo </GreenButton>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={usuario ? [...usuario?.dispositivos] : []}
              />
            </Col>
            <FormItemDefault >
              <Space>
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
              </Space>
            </FormItemDefault>
          </Row>

        </FormDefault>
      </Layout>

    </Content>

  </Layout>


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