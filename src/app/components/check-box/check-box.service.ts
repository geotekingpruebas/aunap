import {Injectable} from '@angular/core';

@Injectable()
export class CheckBoxService {
  id: string;
  value: string;
  
  setInput(id: string, value: string): 
  CheckBoxService {
    this.id = id;
    this.value = value;
    return this;
  }

  getInformation(): CheckBoxService {
    return this;
  }
}