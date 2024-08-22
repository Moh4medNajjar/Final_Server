import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RequestService } from '../services/request.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrl: './my-requests.component.scss'
})
export class MyRequestsComponent {
userData: any;
  constructor(private authService: AuthService, private requestService: RequestService, private datePipe: DatePipe ) { }

  sortColumn: string = 'vmName';
  sortDirection: boolean = true;

  sortTable(column: string) {
    this.sortDirection = (this.sortColumn === column) ? !this.sortDirection : true;
    this.sortColumn = column;
    this.filteredItems.sort((a, b) => {
      let comparison = 0;
      if (this.sortColumn === 'vmName') {
        comparison = a.vmName.localeCompare(b.vmName);
      } else if (this.sortColumn === 'desired_start_date') {
        comparison = new Date(b.desired_start_date).getTime() - new Date(a.desired_start_date).getTime();
      } else if (this.sortColumn === 'status') {
        const statusOrder: { [key: string]: number } = { 'approved': 1, 'pending': 2, 'rejected': 3 };
        comparison = (statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]);
      }
      return this.sortDirection ? comparison : -comparison;
    });
  }

  getStatusCircleClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'circle-pending';
      case 'approved':
        return 'circle-approved';
      case 'rejected':
        return 'circle-rejected';
      default:
        return '';
      }
    }

    items: any[] = [];
    filteredItems = [...this.items];



  onSearch() {
    this.filteredItems = this.items.filter(item =>
      item.vmName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  fullName = ""
  matricule = ""
  position = ""
  role = ""
  approvedItems: any[] = [];

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      console.log(userData)
      this.userData = userData
      this.fullName = userData.fullName
      this.matricule = userData.matricule
      this.position = userData.position
      this.role = userData.role
      if (this.role === "GeneralSpecAdmin") {
        this.fetchAllRequests()
      }
      else if (this.role === "NetworkAdmin") {
        this.fetchAllRequests()
      }
      else if (this.role === "SuperAdmin") {
        this.fetchAllRequests()
      }
      else {
        this.fetchRequestsByUserId(userData.id);
      }


    }


  }

  onLogout() {
    this.authService.logout();
  }

  fetchAllRequests() {
    this.requestService.getRequests().subscribe(
      (data) => {
        this.items = data;
        this.filteredItems = [...this.items];
        if(this.role === "GeneralSpecAdmin"){
          this.filteredItems = this.filteredItems.filter(item => item.status === 'pending');
        }
        if(this.role === "NetworkAdmin"){
          this.filteredItems = this.filteredItems.filter(item => item.status === 'approved');
        }
      },
      (error) => {
        console.error('Error fetching requests:', error);
      }
    );
  }



  fetchRequestsByUserId(userId: string) {
    this.requestService.getRequestsByUserId(userId).subscribe(
      (data) => {
        this.items = data;
        this.filteredItems = [...this.items];
      },
      (error) => {
        console.error('Error fetching requests:', error);
      }
    );
  }

  formatDate(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  searchQuery: string = '';


  logout(){
    this.authService.logout();
  }
}
