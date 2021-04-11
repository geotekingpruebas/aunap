import {DataChart} from './types';
import gql from 'graphql-tag';

export const ALL_DATA = gql`
  query AllDataQuery {
    data{
        id
        value
    }
  }
`;

export interface AllDataQueryResponse {
  data: DataChart[];
  loading: boolean;
}