import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {DataChart} from './types';
import {ALL_DATA, AllDataQueryResponse} from './graphql';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  loading: boolean;
  records: DataChart[];
  recordsBarChart: any;
  recordsPieChart: any;
  labels: String[];
  data: String[];
  backgroundColor : String[];

  private querySubscription: Subscription;
    
    constructor(private apollo: Apollo, private router: Router) {
    }

  ngOnInit() {
    this.getAllData(); 
  }

  getAllData() {
    this.querySubscription = this.apollo.watchQuery<AllDataQueryResponse>({
      query: ALL_DATA
    })
      .valueChanges
      .subscribe(({data, loading}) => {
        this.loading = loading;
        this.records = data.data;
        this.labels = [];
        this.data = [];
        this.backgroundColor = [];
        for (let index = 0; index < this.records.length; index++) {
          const element = this.records[index];
          this.labels.push('Label '+element.id);
          this.data.push(element.value);
          this.backgroundColor.push(this.getRandomColor());
        }    
            
        this.recordsBarChart = {
          labels: this.labels,
          datasets: [{label: 'Valor', backgroundColor: '#42A5F5', data: this.data}] 
        }

        this.recordsPieChart = {
          labels: this.labels,
          datasets: [{backgroundColor: this.backgroundColor, data: this.data}] 
        }
      });
  }

  

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }


}
