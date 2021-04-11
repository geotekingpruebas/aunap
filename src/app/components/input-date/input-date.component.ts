import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {InputDateService} from './input-date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.css']
})
export class InputDateComponent implements OnInit {

  constructor(public inputDateService: InputDateService, private router: Router, private apollo: Apollo) { }

  ngOnInit() {
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
          date: $value
        ) {
            id
            date
        }
      }
      `,
      variables: {
        id: this.inputDateService.id,
        value: this.inputDateService.value
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
