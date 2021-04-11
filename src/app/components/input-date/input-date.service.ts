import {Injectable} from '@angular/core';

@Injectable()
export class InputDateService {
  id: string;
  value: Date;
  
  setInput(id: string, value: Date): 
  InputDateService {
    this.id = id;
    this.value = new Date(value);
    return this;
  }

  getInformation(): InputDateService {
    return this;
  }
}