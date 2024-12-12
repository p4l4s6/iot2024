import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthGuard } from 'src/auth.guard';
import { SensorListComponent } from './sensor-list/sensor-list.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: '', 
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    // children: [
    //   { 
    //     path: 'dashboard', component: DashboardComponent 
    //   },
    //   {
    //     path: 'sensorList', component: SensorListComponent 
    //   }
    // ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
