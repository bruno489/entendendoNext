import React, { useEffect, useState } from "react"
import { Form, Input, Button, message, Row, Col, Popconfirm, Tag, Space, Table, Layout } from 'antd'
import MaskedInput from 'antd-mask-input'
import { AppstoreAddOutlined, DeleteFilled, EditOutlined } from '@ant-design/icons'
import { FormDefault, FormItemDefault, TitleDefault, GreenButton } from '../../styles/Form.styles'
import { GetServerSideProps } from "next"
import { LoadSSRProps } from '../loadSsrProps'
import api from '../backendApi'
import ModalEditarDispositivo from '../componentes/modais/modalEditarDispositivo'
import { FiltroUsuario } from '../componentes/interfaces/filtroUsuario'
import { FiltroDispositivo } from '../componentes/interfaces/filtroDispositivo'
import { ColumnsType } from 'antd/es/table'

interface Props {
  modelosDB: Array<FiltroDispositivo>
}

function Users({ modelosDB }: Props): JSX.Element {
  const { Content } = Layout;
  const { Search } = Input;
  const [formCadastroUsuario] = Form.useForm()

  const [usuario, setUsuario] = useState<FiltroUsuario>()
  const [dispositivoVaiParaModal, setDispositivoVaiParaModal] = useState<FiltroDispositivo>(undefined)
  const [indexDispositivoSelecionadoEditar, setIndexDispositivoSelecionadoEditar] = useState(-1)
  const [estadoModalEditarDispositivo, setEstadoModalEditarDispositivo] = useState(false);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const mostraModalEditDispositivo = () => {
    setEstadoModalEditarDispositivo(true);
  };
  const closeModalEdit = () => {
    setEstadoModalEditarDispositivo(false);
    setDispositivoVaiParaModal(undefined)
  };

  const PesquisaUsuario = async () => {
    const key = 'user'
    message.loading({ content: 'Um momento, por favor...', key });
    const nome=formCadastroUsuario.getFieldValue("nome")
    if(nome=='' || !nome){message.error({ content: 'Por favor, digite o nome.', key });return}
    await api.get(`usuarios/pesquisausuario?nomeUser=${nome}`)
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
    formCadastroUsuario.setFieldsValue(usuario)
  }, [usuario, formCadastroUsuario])

  const deletarUsuario = async () => {
    let key = 'deletar'
    message.loading({ content: 'Um momento, por favor...', key });
    await api.delete(`usuarios/${formCadastroUsuario.getFieldValue("id")}`)
      .then((retorno) => {
        message.success({ content: 'Usuário deletado com sucesso!', key, duration: 2 });
        formCadastroUsuario.resetFields()
      }).catch((erro) => {
        message.error('Falha ao deletar o usuário, tente novamente.');
        console.log(erro)
      })
  }

  const cancelar = () => { formCadastroUsuario.resetFields(); setUsuario(undefined) }

  const enviaUsuarioBackEnd = async valoresDoFormUsuario => {
    console.log('valores setValues')
    console.log(valoresDoFormUsuario)
    const novoUser = {
      nome: formCadastroUsuario.getFieldValue('nome'),
      id: valoresDoFormUsuario?.id,
      email: formCadastroUsuario.getFieldValue('email'),
      fone: formCadastroUsuario.getFieldValue('fone').toString().replace(/\D/g, ""),
      senha: formCadastroUsuario.getFieldValue('senha'),
      dispositivos: usuario?.dispositivos
    }
    console.log('Valores do formulário')
    console.log(novoUser)

    const key = 'alterar'
    if (valoresDoFormUsuario.id) {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.put(`usuarios/${valoresDoFormUsuario.id}`, novoUser).then((retorno) => {
        message.success({ content: 'Alterado com sucesso!', key, duration: 2 });
        formCadastroUsuario.resetFields()
        setUsuario(undefined)
      }).catch((erro) => {
        message.error('Falha ao editar usuário, tente novamente.');
        console.log(erro)
      })
    } else {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.post('novoUsuario', novoUser).then((retorno) => {
        message.success({ content: 'Cadastrado com sucesso!', key, duration: 2 });
        formCadastroUsuario.resetFields()
        setUsuario(undefined)
      }).catch((erro) => {
        message.error('Falha ao cadastrar usuário, tente novamente.');
        console.log(erro)
      })
    }

  }

  //Tabela

  const columns: ColumnsType<any> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome'
    },
    {
      title: 'Modelo',
      dataIndex: ['modelo', 'nome'],
      key: 'nomeModelo'
    },
    {
      title: 'Itens',
      dataIndex: 'itens',
      key: 'itens',
      render: (itens) => (
        <>
          {itens?.map((item, idx) => {
            return <Tag key={idx} color='geekblue'>{item.nome}</Tag>
          })}
        </>
      )
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (ativo: boolean) => (
        <Tag color={ativo ? 'green' : 'volcano'}>
          {ativo ? 'Sim' : 'Não'}
        </Tag >
      )
    },
    {
      title: 'Editar/Deletar',
      dataIndex: 'Acao',
      key: 'acao',
      render: (nome, record, index) => (
        <Space>
          <Button onClick={() => {
            abriModalEditaDispositivo(record, index)
          }} style={{ color: "yellow" }}>
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir este dispositivo?"
            onConfirm={() => deletarDispositivo(record, index)}
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


  const abriModalEditaDispositivo = (record, index) => {
    setDispositivoVaiParaModal(record)
    setIndexDispositivoSelecionadoEditar(index)
    mostraModalEditDispositivo()
  }

  //Editar/Adicionar
  const editaAdicionaDispositivo = (dispositivoAtualizado:FiltroDispositivo) => {
    console.log('index vindo para a função')
    console.log(indexDispositivoSelecionadoEditar)
    console.log('dispositivoAtualizado no edita/add')
    console.log(dispositivoAtualizado)

    const dispositivosDoUsuario = usuario.dispositivos
    let novoDispositivo = []

    if (indexDispositivoSelecionadoEditar>=0) {
      console.log('entrou no if do dispositivo')

      novoDispositivo = [
        ...dispositivosDoUsuario.slice(0, indexDispositivoSelecionadoEditar),
        dispositivoAtualizado,
        ...dispositivosDoUsuario.slice(indexDispositivoSelecionadoEditar + 1),
      ]

      console.log('novoDispositivo')
      console.log(novoDispositivo)
    } else {
      console.log('entrou no else do dispositivo')
      novoDispositivo = [...dispositivosDoUsuario, dispositivoAtualizado]

      console.log('novoDispositivo')
      console.log(novoDispositivo)
    }

    let novoUsuario = {
      nome: usuario?.nome || formCadastroUsuario.getFieldValue('nome'),
      fone: usuario?.fone || formCadastroUsuario.getFieldValue('fone'),
      email: usuario?.email || formCadastroUsuario.getFieldValue('email'),
      dispositivos: novoDispositivo,
      senha: usuario?.senha || formCadastroUsuario.getFieldValue('senha'),
      id: usuario?.id
    }
    setUsuario(novoUsuario)

    console.log('Usuário pos preparo')
    console.log(novoUsuario)

    setIndexDispositivoSelecionadoEditar(-1)

  }

  async function deletarDispositivo(record, index) {

    let novoDispositivos = usuario.dispositivos
    novoDispositivos.splice(index, 1)
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

  return (<Layout>


    <Content style={{ marginTop: '20px' }}>

      <Layout>
        <TitleDefault style={{ textAlign: 'center' }} >Cadastro de usuários</TitleDefault>
        <FormDefault
          name="basic"
          initialValues={{ remember: false }}
          autoComplete="off"
          form={formCadastroUsuario}
          onFinish={enviaUsuarioBackEnd}
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
                  rules={[{ required: true, message: 'Por favor, digite o nome.' }]}
                >
                  <Search placeholder="Nome" onSearch={PesquisaUsuario} enterButton />

                </FormItemDefault>

                <FormItemDefault
                  label="E-mail"
                  name="email"
                  rules={[
                    { required: true, message: 'Por favor, digite um E-mail.' },
                    { type: 'email', message: 'Formato de e-mail inválido.' }
                  ]}
                >
                  <Input placeholder="usuário@gmail.com" />
                </FormItemDefault>

                <FormItemDefault
                  label="Telefone"
                  name="fone"
                  rules={[{ required: true, message: 'Por favor, insira o telefone.' }]}

                >
                  <MaskedInput mask="(11) 1 1111-1111" style={{ width: '100%' }} placeholder="(99) 99999-9999" min={0} max={9999999999} />
                </FormItemDefault>

                <FormItemDefault
                  label="Senha"
                  name="senha"
                  rules={[{ required: usuario?.id ? false : true, message: 'Por favor, digite sua senha.' }]}
                  style={usuario?.id ? { display: 'none' } : { display: 'flex' }}
                >
                  <Input.Password />
                </FormItemDefault>

                <ModalEditarDispositivo
                  estadoModalEditarDispositivo={estadoModalEditarDispositivo}
                  closeModalEdit={closeModalEdit}
                  editaAdicionaDispositivo={editaAdicionaDispositivo}
                  setDispositivoVaiParaModal={setDispositivoVaiParaModal}
                  dispositivoVindoParaModal={dispositivoVaiParaModal}
                  modelosDB={modelosDB}
                />

              </Col>

            </Col>

            <Col span={12}>
              <GreenButton type="primary" onClick={() => { setDispositivoVaiParaModal(undefined); mostraModalEditDispositivo(); }}> Adicionar Dispositivo </GreenButton>
              <Table
                columns={columns}
                dataSource={usuario ? [...usuario?.dispositivos] : []}
                pagination={{ pageSize: 4 }}
                locale={{ emptyText: (<><AppstoreAddOutlined style={{ fontSize: '50px' }} /> <p style={{ fontSize: '30px' }}>Nenhum dispositivo.</p></>) }}
              />
            </Col>
            <FormItemDefault >
              <Space>
                <Button type="primary" htmlType="submit">
                  Salvar
                </Button>

                <Popconfirm placement="bottom"
                  title={'Tem certeza que deseja excluir?'}
                  onConfirm={deletarUsuario}
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