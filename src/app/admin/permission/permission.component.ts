import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { Permission } from './types';
import {
    ALL_PERMISSION_QUERY,
    AllPermissionQueryResponse
} from './graphql';


@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})


export class PermissionComponent implements OnInit {
  
  loading: boolean;
  curPers: Permission[];

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: ALL_PERMISSION_QUERY
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.curPers = data.permission.data;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

}