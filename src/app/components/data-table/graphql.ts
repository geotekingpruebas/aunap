import {Example} from './types';
import gql from 'graphql-tag';

export const ALL_EXAMPLE = gql`
  query AllExample {
    examples(page: 1 first: 20) {
      data {      
        id
        code
        year
        field{
          id
          name
        }
        value
        generator
        date
      }
    }
  }
`;

export interface AllExamplesQueryResponse {
  loading: boolean;
  examples: Example[];
}

export const DELETE_EXAMPLE = gql`
mutation deleteExample($id: ID!) {
  deleteExample(id: $id) {
    id
  }
}
`;

export interface DeleteExamplesMutationResponse {
  loading: boolean;
  id?: Example;
}
