import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {ALL_FILES} from './graphql';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  files: any[];
  cols: any[];
  uri: string = 'http://ec2-13-58-72-65.us-east-2.compute.amazonaws.com/backend/public/api/'; // <- debe ser la URL o el LINk para acceder a la API.

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private messageService: MessageService) {
    this.cols = [
      {field: 'id', header: 'ID'},
      {field: 'name', header: 'Nombre'},
    ];
  }

  ngOnInit() {
    this.getAllData();
  }

  // tslint:disable-next-line:use-lifecycle-interface
  //ngOnDestroy() {
    //this.querySubscription.unsubscribe();
  //}

  getAllData() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: ALL_FILES
    })
      .valueChanges
      .subscribe(({data}) => {
        this.files = data.files;
      });
  }

  onUplodad(event) {
    const {body} = event.originalEvent;
    this.files.push(body.file);
    this.messageService.add({
      severity: 'success',
      summary: 'Sistema de archivos',
      detail: 'Archivo subido correctamente.'
    });
  }

  downloadFile(id) {
    return window.open(`${this.uri}download_file/${id}`);
  }

}
