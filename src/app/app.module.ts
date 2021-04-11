import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppProfileComponent } from './layout/app.profile.component';
import { AppMenuComponent, AppSubMenuComponent } from './layout/app.menu.component';
import { AppBreadcrumbComponent } from './layout/app.breadcrumb.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { GraphQLModule } from './shared/graphql.module';
import { HttpClientModule } from '@angular/common/http';  

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ComponentModule } from './components/components.module';

import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {ListboxModule} from 'primeng/listbox';
import {DropdownModule} from 'primeng/dropdown';


import { BreadcrumbService } from './layout/breadcrumb.service';


@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    AppSubMenuComponent,
    AppProfileComponent,
    AppBreadcrumbComponent,
    AppTopBarComponent,
    AppFooterComponent,

  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    TabViewModule,
    ListboxModule,
    DropdownModule,
    GraphQLModule,
    HttpClientModule,
    AdminModule,
    AuthModule,
    ComponentModule,
    ScrollPanelModule
  ],
  providers: [BreadcrumbService],
  bootstrap: [AppComponent]
})

export class AppModule {}
