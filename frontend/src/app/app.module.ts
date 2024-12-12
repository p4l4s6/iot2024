import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { RealTimeViewComponent } from './dashboard/components/real-time-view/real-time-view.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HistoricalViewComponent } from './dashboard/components/historical-view/historical-view.component';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { SensorDetailComponent } from './sensor-detail/sensor-detail.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { MainHeaderComponent } from './main-layout/components/main-header/main-header.component';
import { SensorCardComponent } from './sensor-list/components/sensor-card/sensor-card.component';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TooltipModule } from 'primeng/tooltip';
import { ChartViewComponent } from './sensor-detail/components/chart-view/chart-view.component';
import { HistoricalTableViewComponent } from './sensor-detail/components/historical-table-view/historical-table-view.component';
import { DeviceCardsComponent } from './device-cards/device-cards.component';
import {CardModule} from 'primeng/card';
import { LabelValueComponent } from './shared/label-value/label-value.component';
import { DisplayPopupComponent } from './sensor-list/components/display-popup/display-popup.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
// import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RealTimeViewComponent,
    LoginComponent,
    MainLayoutComponent,
    HistoricalViewComponent,
    SensorListComponent,
    SensorDetailComponent,
    MainHeaderComponent,
    SensorCardComponent,
    ChartViewComponent,
    HistoricalTableViewComponent,
    DeviceCardsComponent,
    LabelValueComponent,
    DisplayPopupComponent
  ],
  imports: [
    HttpClientModule,
    // ButtonModule,
    BrowserModule,
    ReactiveFormsModule,
    TooltipModule,
    FormsModule,
    AppRoutingModule,
    CanvasJSAngularChartsModule,
    BrowserAnimationsModule,
    DialogModule,
    TabViewModule,
    TableModule,
    CardModule,
    ToastModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }