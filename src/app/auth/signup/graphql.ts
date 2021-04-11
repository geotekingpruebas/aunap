import {User} from './types';
import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql`
mutation CreateUserMutation (
    $email: String!,
    $name: String!,
    $password: String!,
    $password_confirmation: String!,    
){
  register(input: {
    name: $name, 
    email: $email,
    password: $password, 
    password_confirmation: $password_confirmation}) {
    access_token
    user {
      id
      email
      name
    }
  }
}
`;

export interface CreateUserMutationResponse {
  loading: boolean;
  signinUser: {
    token: string,
    user?: User
  };
}
export const SIGNIN_USER_MUTATION = gql`
query SigninUserMutation22(
  $email: String!,
  $password: String!
){
  login(
    email: $email,
    password: $password
  ) {
  message
  user {
    id
    name
    last_name
    type_document
    id
    group_id
    email
    start_date
    end_date
  }
  token {
    access_token
    type
  }
}
}
`;


export interface SigninUserMutationResponse {
  loading: boolean;
  signinUser: {
    token: string,
    user?: User
  };
}