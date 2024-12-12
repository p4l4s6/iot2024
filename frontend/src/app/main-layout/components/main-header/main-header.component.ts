import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/shared.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  user: IUser = {};
  isDropdownOpen: boolean = false;

  constructor( private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.userService.getUserInfo() as any;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }

}
