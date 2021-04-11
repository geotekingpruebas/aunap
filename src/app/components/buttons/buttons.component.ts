import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Mensaje Éxito', detail:'Datos registrado'});
  }

  showInfo() {
    this.messageService.add({severity:'info', summary: 'Mensaje Informativo', detail:'No existen registros'});
  }

  showWarn() {
    this.messageService.add({severity:'warn', summary: 'Mensaje Advertencia', detail:'Hay cambios sin guardar'});
  }

  showError() {
    this.messageService.add({severity:'error', summary: 'Mensaje Error', detail:'Error registrando datos'});
  }

}
