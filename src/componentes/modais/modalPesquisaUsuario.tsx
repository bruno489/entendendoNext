import React from "react"
import { Form, Input, Modal, Button } from 'antd'

interface Props{
  isModalVisible:boolean;
  handleOk:()=>void;
  handleCancel:()=>void;
}

export default function ModalPesquisaUsuario({isModalVisible,handleOk,handleCancel}:Props) {
  const { Search } = Input;

  return <Modal 
            title="Pesquisar usuário." 
            visible={isModalVisible} 
            onCancel={handleCancel}
            footer={[]}
            >
  <Form.Item
    label="Usuário"
    name="pesquisa"
    rules={[{ required: true, message: 'Por favor, digite um usuário.' }]}
  >
    <Search placeholder="Procurar usuário" onSearch={handleOk} enterButton />
  </Form.Item>
</Modal>
}