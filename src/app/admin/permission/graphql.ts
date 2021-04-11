import { Permission } from './types';
import gql from 'graphql-tag';

export const ALL_PERMISSION_QUERY = gql`
  query AllPermissionQuery{
    permission{
        data{
            id
            name      
        }
    }
  }
`;

export interface AllPermissionQueryResponse {
  Permission: Permission[];
  loading: boolean;
}