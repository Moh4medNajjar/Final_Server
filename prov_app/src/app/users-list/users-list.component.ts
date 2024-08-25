import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';
import { UserService } from '../services/user.service';
import { AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  showBackToTopButton: boolean = false;

  ngAfterViewInit() {
    const tableElement = this.tableContainer.nativeElement as HTMLElement;

    // Set up scroll event listener
    tableElement.addEventListener('scroll', () => {
      this.showBackToTopButton = tableElement.scrollTop > 100; // Adjust threshold as needed
    });
  }

  scrollToTop() {
    const tableElement = this.tableContainer.nativeElement as HTMLElement;
    tableElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  userData: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login'])
  }
  fullName = '';
  matricule = '';
  position = '';
  email = '';
  role = '';
  adminName = '';
  adminMatricule = '';
  adminPosition = '';
  adminEmail = '';
  adminRole = '';
  users: any[] = []; // Array to hold the list of users

  ngOnInit(): void {
    // Get token and decode user data
    const token = this.authService.getToken();
    if (token) {
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      this.userData = userData
      this.adminName = userData.fullName;
      this.adminMatricule = userData.matricule;
      this.adminPosition = userData.position;
      this.adminEmail = userData.email;
      this.adminRole = userData.role;

      // Fetch users from the backend if the role is 'SuperAdmin'
      if (this.adminRole === 'SuperAdmin') {
        this.userService.getAllUsers().subscribe(
          (data) => {
            this.users = data;
            console.log('Users retrieved:', this.users);
          },
          (error) => {
            console.error('Error retrieving users:', error);
          }
        );
      }
    }
  }

  sortColumn: string = 'name';
  sortDirection: boolean = true;

  sortTable(column: string) {
    this.sortDirection = (this.sortColumn === column) ? !this.sortDirection : true;
    this.sortColumn = column;

    this.users.sort((a, b) => {
      let comparison = 0;

      switch (this.sortColumn) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'position':
          comparison = a.position.localeCompare(b.position);
          break;
        case 'matricule':
          comparison = a.matricule.localeCompare(b.matricule);
          break;
      }

      // Return the comparison based on the sort direction
      return this.sortDirection ? comparison : -comparison;
    });
  }

  searchQuery: string = '';

  onSearch() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data.filter((item: { fullName: string; }) =>
        item.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }
}
