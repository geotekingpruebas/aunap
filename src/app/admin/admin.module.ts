import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionComponent } from './permission/permission.component';
import { UsersComponent } from './users/users.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    PermissionComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    TableModule
  ]
})
export class AdminModule {}
