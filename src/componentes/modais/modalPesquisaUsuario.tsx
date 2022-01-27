import React from "react"
import { Form, Input, Modal, Button } from 'antd'

interface Props{
  estadoModalPesquisaUsuario:boolean;
  quandoApertarOkUsuario:()=>void;
  quandoApertarCancelUsuario:()=>void;
}

export default function ModalPesquisaUsuario({estadoModalPesquisaUsuario,quandoApertarOkUsuario,quandoApertarCancelUsuario}:Props) {
  const { Search } = Input;

  return <Modal 
            title="Pesquisar usuário." 
            visible={estadoModalPesquisaUsuario} 
            onCancel={quandoApertarCancelUsuario}
            footer={[]}
            >
  <Form.Item
    label="Usuário"
    name="pesquisa"
    rules={[{ required: true, message: 'Por favor, digite um usuário.' }]}
  >
    <Search placeholder="Procurar usuário" onSearch={quandoApertarOkUsuario} enterButton />
  </Form.Item>
</Modal>
}