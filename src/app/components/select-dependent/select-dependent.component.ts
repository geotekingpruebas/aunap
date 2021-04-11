import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {PrincipalSelect, SecondarySelect} from './types';
import {ALL_PRINCIPAL_SELECTS, AllPrincipalSelectsQueryQueryResponse} from './graphql';
import {SelectItem} from 'primeng/api';


@Component({
  selector: 'app-select-dependent',
  templateUrl: './select-dependent.component.html',
  styleUrls: ['./select-dependent.component.css']
})
export class SelectDependentComponent implements OnInit {
  loading: boolean;
  records: Array<object>;
  recordsAny: any;
  recordSelect1: SelectItem[];
  recordSelect2: SelectItem[];
  selectedRecord: String = "0";

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    this.querySubscription = this.apollo.watchQuery<AllPrincipalSelectsQueryQueryResponse>({
      query: ALL_PRINCIPAL_SELECTS
    })
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.records = data.principalSelects;
        this.recordSelect1 = [];
        this.recordsAny = [];
        this.recordSelect1.push({
          label: "Seleccione",
          value: 0  
        });
        this.records.map((item: PrincipalSelect) => {
          this.recordSelect1.push({
            label: item.name,
            value: item.id  
          });
          for (let index = 0; index < item.secondarySelect.length; index++) {
            const element = item.secondarySelect[index];
            this.recordsAny.push({
              label: element.name,
              value: element.id,
              select: element.select_id
            });
          }
        });
      });

  }

  onSelect(event){
    this.recordSelect2 = [];
    for (let index = 0; index < this.recordsAny.length; index++) {
      const element = this.recordsAny[index];
      if(element.select === event.value){
        this.recordSelect2.push({
          label: element.label,
          value: element.value
        })
      }
    }
  }
 
}
