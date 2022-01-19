import React, { useEffect, useState } from "react"
import { GetServerSideProps } from "next"
import { Form, Input, Button, Layout, message, Row, Switch, Popconfirm, Select } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { FormDefault, ColDefault, FormItemDefault, TitleDefault } from '../styles/Form.styles'
import { LoadSSRProps } from '../src/loadSsrProps'

interface usuario {
  id: string;
  nome: string;
  email: string;
  fone: string;
  senha: string;
}

interface infosDisp {
  _id: string;
  nome: string;
  prefSerie: string;
  qtdItens: number;
  qtdSensores: number;
  customizado: boolean;
}

interface Props {
  modelos: Array<infosDisp>
}

interface dispositivo{
  idDisp:string;
  nome:string;
  idModelo:string;
  ativo:boolean;
  itens:Array<string>;
  senha:string;
  nrSerie:string;
}

interface infoCadast{
  senha:string;
  nrSerie:string;
}

function Users({ modelos }: Props): JSX.Element {
  console.log(modelos)
  const { Search } = Input;
  const { Option } = Select;
  const [cadastros] = Form.useForm()

  const [disposVindo, setDisp] = useState<dispositivo>()
  const [infoCadastrado, setInfoCadastrado] = useState<infoCadast>()

  let key = 'updatable'

  const achaUser = async () => {
    await axios.get(`http://localhost:3001/dispositivos/${cadastros.getFieldValue("nome")}`).then((retorno) => {
      const dispositivo:dispositivo = {
        idDisp: retorno.data._id,
        nome: retorno.data.nome,
        idModelo: retorno.data.modelo._id,
        ativo: retorno.data.ativo,
        itens: [],
        senha:retorno.data.senha,
        nrSerie:retorno.data.nrSerie,
      }
      const retornoCadastro:infoCadast={
        senha:retorno.data.senha,
        nrSerie:retorno.data.nrSerie
      }
      setDisp(dispositivo)
      setInfoCadastrado(retornoCadastro)
      if (!retorno.data) message.error('Dispositivo não encontrado');
      
    }).catch((erro) => {

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
    message.loading({ content: 'Um momento, por favor...', key });
    await axios.delete(`http://localhost:3001/dispositivo/${cadastros.getFieldValue("idDisp")}`).then((retorno) => {
      message.success({ content: 'Usuário deletado com sucesso!', key, duration: 2 });
      cadastros.resetFields()
      console.log(retorno)
    }).catch((erro) => {
      message.error('Falha ao deletar o usuário, tente novamente.');
      console.log(erro)
    })
  }

  const cancelar = () => { cadastros.resetFields(); setInfoCadastrado(undefined) }

  async function setValues(valores:dispositivo) {
    const novoDispositivo = {
      idDisp:valores.idDisp,
      nome: valores.nome,
      idModelo: valores.idModelo,
      ativo:valores.ativo,
      itens:[]
    }
    console.log('Valores do formulário')
    console.log(novoDispositivo)

    if (valores.idDisp) {
      message.loading({ content: 'Um momento, por favor...', key });
      await axios.put(`http://localhost:3001/dispositivos/${valores.idDisp}`, novoDispositivo).then((retorno) => {
        console.log(retorno)
        const retornoCadastro:infoCadast={
          senha:retorno.data.senha,
          nrSerie:retorno.data.nrSerie
        }
        message.success({ content: 'Alterado com sucesso!', key, duration: 2 });
        setInfoCadastrado(retornoCadastro)
        cadastros.resetFields()
      }).catch((erro) => {
        message.error('Falha ao editar usuário, tente novamente.');
        console.log(erro)
      })
    } else {
      message.loading({ content: 'Um momento, por favor...', key });
      await axios.post('http://localhost:3001/novoDispositivo', novoDispositivo).then((retorno) => {
        const retornoCadastro:infoCadast={
          senha:retorno.data.senha,
          nrSerie:retorno.data.nrSerie
        }
        setInfoCadastrado(retornoCadastro)
        message.success({ content: 'Cadastrado com sucesso!', key, duration: 2 });
        cadastros.resetFields()
        console.log(retorno)
      }).catch((erro) => {
        message.error('Falha ao cadastrar usuário, tente novamente.');
        console.log(erro)
      })
    }

  }

  return (

    <Row >

      <ColDefault style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <TitleDefault>Cadastro de dispositivos</TitleDefault>
        <FormDefault
          name="basic"
          initialValues={{ remember: false }}
          autoComplete="off"
          form={cadastros}
          onFinish={setValues}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          
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
              {modelos?.map((modelo)=>{
                return (<Option key={modelo._id} value={modelo._id}>{modelo.nome}</Option>)
              })}
            </Select>
            
          </FormItemDefault>

          <FormItemDefault 
            name='ativo'
            label='Ativo'
            style={{width:'150px', marginLeft:'5px'}}
            labelCol={{ span: 15 }}
            wrapperCol={{ span: 9 }}
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

          </FormItemDefault>

        </FormDefault>
      </ColDefault>
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