import gql from 'graphql-tag';

export const ALL_FILES = gql`
  query AllFile {
    files{            
      id
      name
      file
      created_at
      updated_at      
    }    
  }
`;
