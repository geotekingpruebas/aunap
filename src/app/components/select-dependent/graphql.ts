import {PrincipalSelect} from './types';
import gql from 'graphql-tag';

export const ALL_PRINCIPAL_SELECTS = gql`
  query allPrincipalSelectsQuery {
    principalSelects{
        id
        name
        secondarySelect{
            id
            select_id            
            name
        }
    }
  } 
`;

export interface AllPrincipalSelectsQueryQueryResponse {
  loading: boolean;
  principalSelects: PrincipalSelect[];
}