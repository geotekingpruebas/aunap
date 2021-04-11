import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TextAreaService} from './text-area.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TextArea} from './text-area';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {

  textAreaForm: FormGroup;
  textAreaData: TextArea = new TextArea();

  constructor(public textAreaService: TextAreaService, private router: Router, private apollo: Apollo) { }

  ngOnInit() {
    this.textAreaForm = new FormGroup({
      'newValue': new FormControl(this.textAreaData.newValue, [
        Validators.required,
        Validators.minLength(2)
      ]),
    });
  }

  get newValue() {
    return this.textAreaForm.get('newValue');
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
          generator: $value
        ) {
            id
            generator
        }
      }
      `,
      variables: {
        id: this.textAreaService.id,
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
