import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {CheckBoxService} from './check-box.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {Field} from '../select/types';
import {ALL_FIELDS, AllFieldsQueryResponse} from '../select/graphql';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})

export class CheckBoxComponent implements OnInit {
  loading: boolean;
  checkBoxForm: FormGroup;
  records: Array<object>;
  recordItem: String[];
  selectedValues: string[] = [];
  
  private querySubscription: Subscription;


  constructor(private checkBoxService: CheckBoxService, private router: Router, private apollo: Apollo) { 
  }

  ngOnInit() {
    this.getAllData();
    this.selectedValues = [this.checkBoxService.value];
  }

  getAllData() {
    this.querySubscription = this.apollo.watchQuery<AllFieldsQueryResponse>({
      query: ALL_FIELDS
    })
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.records = data.fields;
        this.recordItem = [];
        this.records.map((field: Field) => {
          this.recordItem.push(field.name);
        });
      });
  }

  get newValue() {
    return this.checkBoxForm.get('newValue');
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
          value: $value
        ) {
            id
            value
        }
      }
      `,
      variables: {
        id: this.checkBoxService.id,
        value: this.selectedValues[0],
      }
    }).subscribe((result) => {
      const data: any = result.data;
      if (data.updateExample.id) {
        this.router.navigate(['/data-table']);
      } else {
        console.log('Error ElectricitySectorTransfer(deleteRecord)');
      }
    }, (error) => {
      console.log(error);
    });
  }

}
