import {Field} from './types';
import gql from 'graphql-tag';

export const ALL_FIELDS = gql`
  query allFieldsQuery {
    fields{
        id
        name
    }
  }
`;

export interface AllFieldsQueryResponse {
  loading: boolean;
  fields: Field[];
}