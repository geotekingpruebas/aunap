import {Injectable} from '@angular/core';

@Injectable()
export class SelectService {
  id: string;
  value: string;
  
  setInput(id: string, value: string): 
  SelectService {
    this.id = id;
    this.value = value;
    return this;
  }

  getInformation(): SelectService {
    return this;
  }
}