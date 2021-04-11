import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from './auth/login-signup/login-signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DataTableComponent } from './components/data-table/data-table.component';
import { InputTextComponent } from './components/input-text/input-text.component'
import { TextAreaComponent } from './components/text-area/text-area.component'
import { CheckBoxComponent } from './components/check-box/check-box.component'
import { ChartsComponent } from './components/charts/charts.component';
import { SelectComponent } from './components/select/select.component'
import { InputDateComponent } from './components/input-date/input-date.component'
import { SelectDependentComponent } from "./components/select-dependent/select-dependent.component";
import { FileComponent } from "./components/file/file.component";
import { ButtonsComponent } from './components/buttons/buttons.component';
import { ReportComponent } from './components/report/report.component';
import { EsriMapComponent } from './components/esri-map/esri-map.component';


const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: LoginSignupComponent },
    { path: 'data-table', canActivate: [AuthGuard], component: DataTableComponent },
    { path: 'input-text', canActivate: [AuthGuard], component: InputTextComponent },
    { path: 'text-area', canActivate: [AuthGuard], component: TextAreaComponent },
    { path: 'check-box', canActivate: [AuthGuard], component: CheckBoxComponent },
    { path: 'select', canActivate: [AuthGuard], component: SelectComponent },
    { path: 'input-date', canActivate: [AuthGuard], component: InputDateComponent },
    { path: 'charts', canActivate: [AuthGuard], component: ChartsComponent },
    { path: 'files', canActivate: [AuthGuard], component: FileComponent },
    { path: 'select-dependent', canActivate: [AuthGuard], component: SelectDependentComponent },
    { path: 'buttons', canActivate: [AuthGuard], component: ButtonsComponent },
    { path: 'report', component: ReportComponent },
    { path: 'VisorSIG', component: EsriMapComponent },
    {
      path: '**',
      redirectTo: 'login',
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
