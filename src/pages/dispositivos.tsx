import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { Form, Input, Button, Space, message, Row, Switch, Popconfirm, Select } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { FormDefault, ColDefault as Col, FormItemDefault, TitleDefault } from '../../styles/Form.styles'

import api from "../backendApi";
import { LoadSSRProps } from '../loadSsrProps'
import { FiltroDispositivo } from "../componentes/interfaces/filtroDispositivo";

interface Props {
  modelos: Array<FiltroDispositivo>
}

interface dispositivo {
  idDisp: string;
  nome: string;
  idModelo: string;
  ativo: boolean;
  itens: Array<string>;
  senha: string;
  nrSerie: string;
}

interface infoCadast {
  senha: string;
  nrSerie: string;
}

function Users({ modelos }: Props): JSX.Element {
  console.log(modelos)
  const { Search } = Input;
  const { Option } = Select;
  const [cadastros] = Form.useForm()

  const [disposVindo, setDisp] = useState<dispositivo>()
  const [infoCadastrado, setInfoCadastrado] = useState<infoCadast>()

  const achaUser = async () => {
    const key = 'busca'
    message.loading({content:'Um momento, por favor...',key})
    await api.get(`dispositivos/${cadastros.getFieldValue("nome")}`).then((retorno) => {
      message.success({content:'Usuário encontrado com sucesso!',key})
      const dispositivo: dispositivo = {
        idDisp: retorno.data._id,
        nome: retorno.data.nome,
        idModelo: retorno.data.modelo._id,
        ativo: retorno.data.ativo,
        itens: [],
        senha: retorno.data.senha,
        nrSerie: retorno.data.nrSerie,
      }
      const retornoCadastro: infoCadast = {
        senha: retorno.data.senha,
        nrSerie: retorno.data.nrSerie
      }
      setDisp(dispositivo)
      setInfoCadastrado(retornoCadastro)
      if (!retorno.data) message.error('Dispositivo não encontrado');

    }).catch((erro) => {
      message.error({content:'Falha ao encontrar usuário.',key})
      console.log(erro)
    })

  }

  useEffect(() => {
    console.log('Console do useEffect:')
    console.log(disposVindo)
    if (!disposVindo) return
    cadastros.setFieldsValue(disposVindo)

  }, [disposVindo])


  const deletar = async () => {
    const key='delete'
    message.loading({ content: 'Um momento, por favor...', key });
    await api.delete(`dispositivo/${cadastros.getFieldValue("idDisp")}`).then((retorno) => {
      message.success({ content: 'Usuário deletado com sucesso!', key, duration: 2 });
      cadastros.resetFields()
      console.log(retorno)
    }).catch((erro) => {
      message.error({content:'Falha ao deletar o usuário, tente novamente.',key});
      console.log(erro)
    })
  }

  const cancelar = () => { cadastros.resetFields(); setInfoCadastrado(undefined) }

  const setValues = async valores => {
    const key='set'
    message.loading({ content: 'Um momento, por favor...', key });
    const novoDispositivo = {
      idDisp: valores.idDisp,
      nome: valores.nome,
      idModelo: valores.idModelo,
      ativo: valores.ativo,
      itens: []
    }
    console.log('Valores do formulário')
    console.log(novoDispositivo)

    if (valores.idDisp) {
      
      await api.put(`dispositivos/${valores.idDisp}`, novoDispositivo).then((retorno) => {
        console.log(retorno)
        const retornoCadastro: infoCadast = {
          senha: retorno.data.senha,
          nrSerie: retorno.data.nrSerie
        }
        message.success({ content: 'Alterado com sucesso!', key, duration: 2 });
        setInfoCadastrado(retornoCadastro)
        cadastros.resetFields()
      }).catch((erro) => {
        message.error({content:'Falha ao editar usuário, tente novamente.',key});
        console.log(erro)
      })
    } else {
      message.loading({ content: 'Um momento, por favor...', key });
      await api.post('novoDispositivo', novoDispositivo).then((retorno) => {
        const retornoCadastro: infoCadast = {
          senha: retorno.data.senha,
          nrSerie: retorno.data.nrSerie
        }
        setInfoCadastrado(retornoCadastro)
        message.success({ content: 'Cadastrado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
        console.log(retorno)
      }).catch((erro) => {
        message.error({content:'Falha ao cadastrar usuário, tente novamente.',key});
        console.log(erro)
      })
    }

  }

  return (

    <Row >

      <Col style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <TitleDefault>Cadastro de dispositivos</TitleDefault>
        <FormDefault
          name="basic"
          initialValues={{ remember: false }}
          autoComplete="off"
          form={cadastros}
          onFinish={setValues}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <FormItemDefault name='idDisp' hidden>
            <Input />
          </FormItemDefault>
          <FormItemDefault
            label="Nome"
            name='nome'
            rules={[{ required: true, message: 'Por favor, digite um E-mail.' }]}
          >
            <Search placeholder="Nome" onSearch={achaUser} enterButton />

          </FormItemDefault>

          <FormItemDefault
            label="Modelo"
            name="idModelo"
            rules={[{ required: true, message: 'Por favor, digite um id.' }]}
          >
            <Select defaultValue="Modelo" style={{ width: '100%' }}>
              {modelos?.map((modelo) => {
                return (<Option key={modelo._id} value={modelo._id}>{modelo.nome}</Option>)
              })}
            </Select>

          </FormItemDefault>

          <FormItemDefault
            name='ativo'
            label='Ativo'
            style={{ width: '150px', marginLeft: '5px' }}
            labelCol={{ span: 20 }}
            wrapperCol={{ span: 4 }}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
          </FormItemDefault>

          {infoCadastrado && (
            <>
              <p>Senha: {infoCadastrado.senha}</p>
              <p>Número de Série: {infoCadastrado.nrSerie}</p>
            </>
          )
          }

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
            </Space>
          </FormItemDefault>

        </FormDefault>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const modelos = await LoadSSRProps('todosModelos', context)
    return {
      props: {
        modelos,
      },
    }
  } catch (error) {
    return { props: {} }
  }
}

export default Users;