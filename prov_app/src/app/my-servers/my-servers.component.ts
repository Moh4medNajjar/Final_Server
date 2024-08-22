import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-my-servers',
  templateUrl: './my-servers.component.html',
  styleUrl: './my-servers.component.scss'
})
export class MyServersComponent implements OnInit {

  items: any[] = [];

  userData: any;
  fullName = ""
  matricule = ""
  position = ""
  role = ""

constructor(private serverService:ServerService,private authService: AuthService){}
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
    if( userData.role === 'SuperAdmin' || userData.role === 'NetworkAdmin' || userData.role === 'GeneralSpecAdmin') {
      this.fetchAllServers()
    }
    else if(userData.role === ''){
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
      this.items = response.map((server: any) => ({
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

    // Sort the items based on the column and direction
    this.filteredItems.sort((a, b) => {
        let comparison = 0;

        // Handle sorting based on the selected column
        switch (this.sortColumn) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'creationDate':
                comparison = new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
                break;
            case 'status':
                // Define an ordering for statuses
                const statusOrder: { [key: string]: number } = { 'Running': 1, 'Stopped': 2 };
                comparison = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
                break;
            case 'cpu':
                // Ensure CPU is a number for comparison
                comparison = (Number(b.cpu) || 0) - (Number(a.cpu) || 0);
                break;
            case 'memory':
                // Ensure memory is a number for comparison
                comparison = (Number(b.memory) || 0) - (Number(a.memory) || 0);
                break;
            case 'storage':
                // Ensure storage is a number for comparison
                comparison = (Number(b.storage) || 0) - (Number(a.storage) || 0);
                break;
        }

        // Return the comparison based on the sort direction
        return this.sortDirection ? comparison : -comparison;
    });
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
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
