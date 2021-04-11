import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { User } from './types';

import {
    ALL_USERS_QUERY,
    AllUsersQueryResponse
} from './graphql';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
    loading: boolean;
    user: User[];
    private querySubscription: Subscription;

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.querySubscription = this.apollo.watchQuery<any>({
          query: ALL_USERS_QUERY
        })
        .valueChanges
        .subscribe(({ data, loading }) => {
          this.loading = loading;
          this.user = data.user.data;
        });
    }

    showDialogToAdd() {}

    save() {}

    delete() {}

    onRowSelect(event) {}
}
