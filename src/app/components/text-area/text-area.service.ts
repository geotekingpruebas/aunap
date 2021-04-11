import {Injectable} from '@angular/core';

@Injectable()
export class TextAreaService {
  id: string;
  value: string;
  
  setInput(id: string, value: string): 
  TextAreaService {
    this.id = id;
    this.value = value;
    return this;
  }

  getInformation(): TextAreaService {
    return this;
  }
}