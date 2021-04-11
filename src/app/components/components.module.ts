import { NgModule } from '@angular/core';
import { DataTableComponent } from './data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { InputTextComponent } from './input-text/input-text.component';
import { InputTextService } from './input-text/input-text.service';
import { TextAreaComponent } from './text-area/text-area.component';
import { TextAreaService } from './text-area/text-area.service';
import { InputDateComponent } from './input-date/input-date.component';
import { InputDateService } from './input-date/input-date.service';
import { SelectComponent } from './select/select.component';
import { SelectService } from './select/select.service';
import { CheckBoxComponent } from './check-box/check-box.component';
import { CheckBoxService } from './check-box/check-box.service';
import { ChartsComponent } from './charts/charts.component';
import { SelectDependentComponent } from "./select-dependent/select-dependent.component";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { ChartModule } from 'primeng/chart';

import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {ListboxModule} from 'primeng/listbox';


import { FileComponent } from './file/file.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonsComponent } from './buttons/buttons.component';
import { ReportComponent } from './report/report.component';
import { EsriMapComponent } from './esri-map/esri-map.component';

@NgModule({
  declarations: [
    DataTableComponent,
    InputTextComponent,
    TextAreaComponent,
    InputDateComponent,
    SelectComponent,
    CheckBoxComponent,
    ChartsComponent,
    SelectDependentComponent,
    FileComponent,
    ButtonsComponent,
    ReportComponent,
    EsriMapComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MenubarModule,
    BrowserModule,
    BrowserAnimationsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    ChartModule,
    PanelModule,
    TabViewModule,
    ListboxModule,
    FileUploadModule,
    ToastModule
  ],
  providers: [
    InputTextService,
    TextAreaService,
    CheckBoxService,
    SelectService,
    InputDateService,
    MessageService
  ]
})

export class ComponentModule { }
