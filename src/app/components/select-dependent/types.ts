export interface PrincipalSelect {
    id?: string;
    name?: string;
    secondarySelect?: SecondarySelect[];
}

export interface SecondarySelect {
  id?: string;
  select_id?: string;
  name?: string;
}