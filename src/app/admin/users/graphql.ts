import {User} from './types';
import gql from 'graphql-tag';

export const ALL_USERS_QUERY = gql`
  query AllUsersQuery{
    users{
      data{
        id
        name
        email
        active
        created_at
        updated_at
      }
    }
  }
`;

export interface AllUsersQueryResponse {
  User: User[];
  loading: boolean;
}