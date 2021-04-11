import {Component, Injectable, OnInit} from '@angular/core';
import {Example} from './types';
import {Subscription} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {ALL_EXAMPLE, AllExamplesQueryResponse, DELETE_EXAMPLE} from './graphql';
import {Router} from '@angular/router';
import {InputTextService} from '../input-text/input-text.service';
import {TextAreaService} from '../text-area/text-area.service';
import {CheckBoxService} from '../check-box/check-box.service';
import {SelectService} from '../select/select.service';
import {InputDateService} from '../input-date/input-date.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  loading: boolean;
  records: Example[];

  private querySubscription: Subscription;

  modalActive: boolean = false;
  idRecord: string;

  constructor(private apollo: Apollo, private router: Router,
              private inputTextService: InputTextService,
              private checkBoxService: CheckBoxService, private textAreaService: TextAreaService,
              private selectService: SelectService, private inputDateService: InputDateService
  ) {
  }

  
  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    
    // this.querySubscription = this.apollo.watchQuery<any>({
    //   query: ALL_EXAMPLE
    // })
    //   .valueChanges
    //   .subscribe(({data, loading}) => {
    //     this.loading = loading;
    //     this.records = data.examples.data;
    //   });
  }
  
  editInput(id: string, value: string, type: string = 'input') {
    if (type == 'input-text') {
      this.inputTextService.setInput(id, value);
    } else if (type == 'text-area') {
      this.textAreaService.setInput(id, value);
    } else if (type == 'check-box') {
      this.checkBoxService.setInput(id, value);
    } else if (type == 'select') {
      this.selectService.setInput(id, value);
    }
    this.router.navigate(['/' + type]);
  }

  editDate(id: string, value: string) {
    this.inputDateService.setInput(id, new Date(value));
    this.router.navigate(['/input-date']);
  }

  changeStateModal(state: boolean, record: string = '0') {
    this.modalActive = state;
    this.idRecord = record;
  }

  deleteRecord() {
    this.apollo.mutate({
      mutation: DELETE_EXAMPLE,
      variables: {
        id: this.idRecord
      }
    })
      .subscribe(async (result) => {
          const data: any = result.data;
          if (data.deleteExample.id) {
            this.records = this.records.filter(
              record => record.id !== this.idRecord
            );
            this.modalActive = false;
          } else {
            console.log('Error Example(deleteRecord)');
          }
        },
        err => console.log(err)
      );
  }
}
