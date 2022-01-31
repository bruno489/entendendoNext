import React, {useState,useEffect} from 'react'
import {Form, Input, InputNumber, Row, Switch, Button, Popconfirm, Space, Typography, message } from 'antd'
import {FormDefault,ColDefault,FormItemDefault,TitleDefault} from '../../styles/Form.styles'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import {FiltroModelo} from '../componentes/interfaces/filtroModelo'
import api from '../backendApi';

export default function Modelo(){

  const [cadModelos]=Form.useForm()

  const [modelo,setModelo] = useState<FiltroModelo>()

  const { Title } = Typography;
  const { Search } = Input;

  const cancelar =()=>{cadModelos.resetFields()}

  const send = async (infosModelo) => {
    console.log(infosModelo)
    const key= 'send'
    message.loading({ content: 'Um momento, por favor...', key });
    if(cadModelos.getFieldValue('_id')!=undefined){
      await api.put(`modelos/${cadModelos.getFieldValue('_id')}`,infosModelo).then((retorno)=>{
        console.log(retorno)
        cadModelos.resetFields()
        message.success({ content: 'Editado com sucesso!', key });
      }).catch((retorno)=>{
        message.error({content:"Falha ao Editar",key})
        console.log(retorno)
      })
    }else{
      await api.post('novoModelo',infosModelo).then((retorno)=>{
        console.log(retorno)
        cadModelos.resetFields()
        message.success({ content: 'Cadastrado com sucesso!', key });
      }).catch((retorno)=>{
        message.error({content:"Falha ao cadastrar",key})
        console.log(retorno)
      })
    }
    
  }

  async function onSearch(){
    const key='pesquisa'
    const nome=cadModelos.getFieldValue("nome")
    if(nome=='' || !nome){message.error({ content: 'Por favor, digite o nome.', key });return}
    message.loading({ content: 'Um momento, por favor...', key });
    await api.get(`modelos/${nome}`).then((retorno)=>{
      setModelo(retorno.data)
      message.success({ content: 'Encontrado com sucesso!', key });
    }).catch((retorno)=>{
      message.error({content:"Falha ao encontrar",key})
      console.log(retorno)
    })
  }

  async function deletar() {
    const key='delete'
    console.log(cadModelos.getFieldValue('_id'))
    message.loading({ content: 'Um momento, por favor...', key });
    await api.delete(`modelos/${cadModelos.getFieldValue('_id')}`).then(()=>{
      message.success({ content: 'Deletado com sucesso.', key });
      cadModelos.resetFields()
    }).catch((retorno)=>{
      console.log(retorno)
      message.error({content:"Falha ao encontrar, tente novamente.",key})
    })
  }

  useEffect(()=>{
    cadModelos.setFieldsValue(modelo)
  },[modelo])

  return <Row>
    
    <ColDefault style={{paddingTop:'40px',paddingBottom:'40px'}}>
    <Title>Cadastro de Modelos</Title>
    <FormDefault
      name='cadModelos'
      initialValues={{ remember: false }}
      autoComplete="off"
      form={cadModelos}
      onFinish={send}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <FormItemDefault name='_id' hidden>
        <Input />
      </FormItemDefault>
      <FormItemDefault 
        name='nome'
        label='Nome'
        rules={[{required:true,message:'Por favor, informe um nome.'}]}
        >
        <Search onSearch={onSearch} enterButton />
      </FormItemDefault>
      <FormItemDefault 
        name='prefSerie'
        label='Nº de série'
        rules={[{required:true,message:'Por favor, informe um nº de série.'}]}
        >
        <Input />
      </FormItemDefault>
      <FormItemDefault 
        name='qtdItens'
        label='Nº de itens'
        rules={[{required:true,message:'Por favor, informe a quantitade.'}]}
        >
        <InputNumber style={{width:'100%'}} min={0} max={5}/>
      </FormItemDefault>
      <FormItemDefault 
        name='qtdSensores'
        label='Nº de sensores'
        rules={[{required:true,message:'Por favor, informe a quantitade.'}]}
        >
        <InputNumber style={{width:'100%'}} min={0} max={5}/>
      </FormItemDefault>
      <FormItemDefault 
        name='customizado'
        label='Customizado'
        style={{width:'150px', marginLeft:'50px'}}
        labelCol={{ span: 18 }}
        wrapperCol={{ span: 6 }}
        valuePropName="checked"
        initialValue={true}
        >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} defaultChecked />
      </FormItemDefault>
    
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
    </ColDefault>
    </Row>

}