import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {SelectService} from './select.service';
import {ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms'
import {SelectItem} from 'primeng/api';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {Field} from './types';
import {ALL_FIELDS, AllFieldsQueryResponse} from './graphql';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  loading: boolean;
  selectForm: FormGroup;
  records: Array<object>;
  recordSelect: SelectItem[];
  selectedRecord: String;
  
  private querySubscription: Subscription;

  constructor(private selectService: SelectService, private router: Router, private apollo: Apollo) { 
   
  }

  ngOnInit() {
    this.getAllData();
    this.selectedRecord = this.selectService.value;
  }

  getAllData() {
    this.querySubscription = this.apollo.watchQuery<AllFieldsQueryResponse>({
      query: ALL_FIELDS
    })
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.records = data.fields;
        this.recordSelect = [];
        this.records.map((field: Field) => {
          this.recordSelect.push({
            label: field.name,
            value: field.id
          });
        });
      });
  }

  get newValue() {
    return this.selectForm.get('newValue');
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
          field_id: $value
        ) {
            id
            field{
              id
              name
            } 
        }
      }
      `,
      variables: {
        id: this.selectService.id,
        value: this.selectedRecord,
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
