import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { AuthService } from '../auth.service';
import { SharedService } from '../shared/shared-service.service';
import { ViewType } from '../shared/shared.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) {

  }
 

  ngOnInit() {
  }
}
