import styled from 'styled-components'
import { Form,Col,Typography,Button  } from 'antd'

const { Title } = Typography;

export const FormDefault = styled(Form)`
  padding:0 auto ;
`
export const ColDefault = styled(Col)`
  background-color: #ccc;
  width: 600px;
  margin: 10px Auto;
  border:1px solid #000;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  text-align: center;
  
`

export const FormItemDefault = styled(Form.Item)`
  width: 90%;
  margin: 10px auto;
  align-items: center;
  text-align: center;
  justify-content: center;
`

export const TitleDefault = styled(Title)`
  text-decoration: underline;
`

export const GreenButton = styled(Button)`

  &:hover{
    background-color: blue;
  }
`

