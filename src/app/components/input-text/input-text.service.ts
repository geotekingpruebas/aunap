import {Injectable} from '@angular/core';

@Injectable()
export class InputTextService {
  id: string;
  value: string;
  
  setInput(id: string, value: string): 
  InputTextService {
    this.id = id;
    this.value = value;
    return this;
  }

  getInformation(): InputTextService {
    return this;
  }
}
