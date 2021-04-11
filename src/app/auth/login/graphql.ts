import {User} from './types';
import gql from 'graphql-tag';

export const SIGNIN_USER_MUTATION = gql`
query SigninUserMutation23(
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
