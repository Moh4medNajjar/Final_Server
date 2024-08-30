import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ServerService } from '../services/server.service';
import { AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';


export interface EnvironmentStyle {
  icon: string;
  color: string;
}

export const environmentStyles: { [key: string]: EnvironmentStyle } = {
  'developing': { icon: 'fa-code-branch', color: '#66BB6A' }, // Light Green
  'testing': { icon: 'fa-check-double', color: '#42A5F5' }, // Bright Yellow
  'staging': { icon: 'fa-cogs', color: '#FF9800' }, // Amber
  'production': { icon: 'fa-shield-alt', color: '#FF5252' } // Bright Red
};
@Component({
  selector: 'app-deletable-servers',
  templateUrl: './deletable-servers.component.html',
  styleUrl: './deletable-servers.component.scss'
})
export class DeletableServersComponent {

  @ViewChild('tableContainer') tableContainer!: ElementRef;
  showBackToTopButton: boolean = false;
  deletableServers: any;

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


  getEnvironmentStyle(environmentType: string): EnvironmentStyle {
    return environmentStyles[environmentType] || { icon: 'fa-question-circle', color: '#9E9E9E' }; // Default: gray question mark
  }

  items: any[] = [];

  userData: any;
  fullName = ""
  matricule = ""
  position = ""
  role = ""

constructor(private serverService:ServerService,private authService: AuthService){}
  ngOnInit() {
    // this.getDeletableServers()
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
      if( userData.role === 'SuperAdmin' || userData.role === 'NetworkAdmin' || userData.role === 'GeneralSpecAdmin') {
        this.fetchAllServers()
      }
      else if(userData.role === 'OrdinaryUser'){
        this.fetchServersById(userData.id)
      }

    }

  }

  onLogout() {
    this.authService.logout();
  }

  fetchAllServers() {
    this.serverService.getAllServers().subscribe(
      (response: any[]) => { // Expecting an array directly
        console.log("Hello from SuperAdmin", response);
        // Map response to items and include wantToDelete
        this.items = response.map((server: any) => ({
          vmName: server.vmName,
          createdAt: server.createdAt,
          environment_type: server.environment_type,
          cpu: server.cpu,
          operating_system: server.operating_system,
          ram: server.ram,
          disk_space: server.disk_space,
          privateIP: server.privateIP,
          id: server._id,
          wantToDelete: server.wantToDelete
        }));
        // Filter items to include only those with wantToDelete = true
        this.filteredItems = this.items.filter(item => item.wantToDelete === true);
        this.filteredItems = this.filteredItems.reverse()
      },
      (error) => {
        console.error('Error fetching servers:', error);
      }
    );
  }






  fetchServersById(requesterId: string) {
    this.serverService.getServersByRequesterId(requesterId).subscribe(
      (response: any) => {
        // Map the server attributes to the desired names
        console.log(response)
        this.items = response.servers.map((server: any) => ({
          vmName: server.vmName,
          createdAt: server.createdAt,
          environment_type: server.environment_type,
          cpu: server.cpu,
          operating_system: server.operating_system,
          ram: server.ram,
          disk_space: server.disk_space,
          privateIP: server.privateIP,
          id: server._id
        }));
        this.filteredItems = [...this.items];
        console.log(this.filteredItems);
      },
      (error) => {
        console.error('Error fetching servers:', error);
      }
    );
  }


    sortColumn: string = 'name';
    sortDirection: boolean = true;

    sortTable(column: string) {
      // Toggle sort direction if the same column is clicked; otherwise, default to ascending
      this.sortDirection = (this.sortColumn === column) ? !this.sortDirection : true;
      this.sortColumn = column;

      const compare = (a: any, b: any) => {
        let comparison = 0;

        switch (this.sortColumn) {
          case 'vmName':
          case 'operating_system':
            comparison = a[this.sortColumn].localeCompare(b[this.sortColumn]);
            break;

          case 'createdAt':
            comparison = new Date(a[this.sortColumn]).getTime() - new Date(b[this.sortColumn]).getTime();
            break;

          case 'cpu':
          case 'ram':
          case 'disk_space':
            comparison = (Number(b[this.sortColumn]) || 0) - (Number(a[this.sortColumn]) || 0);
            break;

          case 'environment_type':
            // Simplified sorting for environment_type (alphabetically)
            comparison = a[this.sortColumn].localeCompare(b[this.sortColumn]);
            break;

          default:
            break;
        }

        return this.sortDirection ? comparison : -comparison;
      };

      this.filteredItems.sort(compare);
    }





  getStatusCircleClass(status: string): string {
    if (!status) {
      return ''; // Return an empty string if status is not defined
    }

    switch (status.toLowerCase()) {
      case 'running':
        return 'circle-approved';
      case 'stopped':
        return 'circle-rejected';
      default:
        return '';
    }
  }


    filteredItems = [...this.items];
    searchQuery: string = '';

    onSearch() {
      if (this.searchQuery.trim() === '') {
        // If search query is empty, show all items
        this.filteredItems = [...this.items];
      } else {
        // Filter items based on the search query
        this.filteredItems = this.items.filter(item =>
          item.vmName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.operating_system.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }

    // getDeletableServers() {
    //   this.serverService.getDeletableServers().subscribe (
    //     (response: any) => {
    //       console.log("deletable servers: ",response)
    //       this.deletableServers = response
    //     },
    //     (error: any) => {
    //       console.error("Error finding deletable servers")
    //     }
    //   )
    // }
}
