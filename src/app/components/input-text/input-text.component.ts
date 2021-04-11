import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {InputTextService} from './input-text.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {InputText} from './input-text';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})

export class InputTextComponent implements OnInit {
  inputTextForm: FormGroup;
  inputTextData: InputText = new InputText();

  constructor(public inputTextService: InputTextService, private router: Router, private apollo: Apollo) { }

  ngOnInit() {
    this.inputTextForm = new FormGroup({
      'newValue': new FormControl(this.inputTextData.newValue, [
        Validators.required,
        Validators.minLength(2)
      ]),
    });
  }

  get newValue() {
    return this.inputTextForm.get('newValue');
  }

  goSchema() {
    this.router.navigate(['/data-table']);
  }

  saveChanges() {
    this.apollo.mutate({
      mutation: gql`
       mutation updateExample (
          $id: ID!
          $value: String!
       ){
        updateExample(
          id: $id
          code: $value
        ) {
            id
            code
        }
      }
      `,
      variables: {
        id: this.inputTextService.id,
        value: this.newValue.value
      }
    }).subscribe((result) => {
      const data: any = result.data;
      if (data.updateExample.id) {
        this.router.navigate(['/data-table']);
      } else {
        console.log('Error updateExample(deleteRecord)');
      }
    }, (error) => {
      console.log(error);
    });
  }

}
