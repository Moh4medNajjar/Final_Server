import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService} from '../services/auth.service'
import { RequestService } from '../services/request.service';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  password = 'password here';
  hidePassword = true;
  copySuccess = false;
  users: any;
  recentRequests: any[] = [];
  recentServers: any[] = [];
  deletableServers: any;

  onLogout() {
    this.authService.logout();
  }

  user: any = {}; // Object to hold user details
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private requestService: RequestService,
    private serverService: ServerService
  ) {}

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
  selectedRole: string = ''; // Holds the currently selected role

  allRequests: any
  approvedRequests: any
  finishedRequests: any
  pendingRequests: any
  rejectedRequests: any
userData: any
  ngOnInit(): void {
    this.approvedRequests = null;
  this.finishedRequests = null;
  this.pendingRequests = null;
  this.rejectedRequests = null;
    this.getNumberAndPercentageOfAllRequests()
    this.getNumberAndPercentageOfApprovedRequests()
    this.getNumberAndPercentageOfRejectedRequests()
    this.getNumberAndPercentageOfPendingRequests()
    this.getNumberAndPercentageOfFinishedRequests()

    this.getNumberAndPercentageOfSuperAdmins()
    this.getNumberAndPercentageOfNetworkAdmins()
    this.getNumberAndPercentageOfGeneralAdmins()
    this.getNumberAndPercentageOfOrdinaryUsers()

    const token = this.authService.getToken();
    if (token) {
      const decodedPayload = atob(token.split('.')[1]);
      const userData = JSON.parse(decodedPayload);
      this.userData = userData;
      this.adminName = userData.fullName;
      this.adminMatricule = userData.matricule;
      this.adminPosition = userData.position;
      this.adminEmail = userData.email;
      this.adminRole = userData.role;
    }
    this.userId = this.route.snapshot.paramMap.get('id');

    if( this.userData.role === 'SuperAdmin') {
      this.fetchAllServers()
    }

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (data: any) => {
          this.user = data;
        },
        (error: any) => {
          console.error('Error retrieving user details:', error);
        }
      );
    }
    if (this.adminRole === 'SuperAdmin') {
      this.userService.getAllUsers().subscribe(
        (data) => {
          this.users = data;
        },
        (error) => {
          console.error('Error retrieving users:', error);
        }
      );
    }
    if (this.adminRole === "SuperAdmin") {
      this.fetchAllRequests()

    }

  }
  items: any[] = [];
  filteredItems = [...this.items];
  servers: any[] = []
  NumberOfServersToDelete: any

  fetchAllServers() {
    this.serverService.getAllServers().subscribe(
      (response: any[]) => { // Expecting an array directly
        this.servers = response.map((server: any) => ({
          adminName: server.adminName,
          requesterName: server.requesterName,
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
        this.filteredItems = [...this.servers];
        this.NumberOfServersToDelete= this.servers?.filter(server => server.wantToDelete === true).length,
        this.recentServers = this.filteredItems
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      (error) => {
        console.error('Error fetching servers:', error);
      }
    );
  }

  getServerCount(environmentType: string): number {
    return this.servers?.filter(server => server.environment_type === environmentType).length;
  }

  getdeleteCount() {
    console.log()
  }


  fetchAllRequests() {
    this.requestService.getRequests().subscribe(
      (data) => {
        this.items = data;
        this.filteredItems = [...this.items];
        this.recentRequests = this.filteredItems
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

  getApprovedCount(): number {
    return this.filteredItems.filter(item => item.status === 'approved').length;
  }
  getTotalCount(): number {
    return this.filteredItems.length;
  }
  getApprovedPercentage(): number {
    const total = this.getTotalCount();
    const approved = this.getApprovedCount();
    return total ? Math.round((approved / total) * 100) : 0;
  }
  getStatusCount(status: string): number {
    return this.filteredItems?.filter(item => item.status === status).length;
  }
  getStatusPercentage(status: string): number {
    const total = this.getTotalCount();
    const count = this.getStatusCount(status);
    return total ? Math.round((count / total) * 100) : 0;
  }

  getRoleCount(role: string): number {
    return this.users?.filter((user: { role: string; }) => user.role === role).length;
  }

  calculateTotalUsers(): number {
    return this.users?.length;
  }

  getRolePercentage(role: string): number {
    const count = this.getRoleCount(role);
    return Math.round((count / this.users?.length) * 100);
  }


  getNumberAndPercentageOfApprovedRequests() {
    this.requestService.getNumberOfApprovedRequests().subscribe (
      (response: any) => {
        this.approvedRequests = response
      },
      (error: any) => {
        console.error(error)
      }
    )
  }

  getNumberAndPercentageOfPendingRequests() {
    this.requestService.getNumberOfPendingRequests().subscribe (
      (response: any) => {
        this.pendingRequests = response
      },
      (error: any) => {
        console.error(error)
      }
    )
  }

  getNumberAndPercentageOfAllRequests() {
    this.requestService.getNumberOfAllRequests().subscribe (
      (response: any) => {
        this.allRequests = response
        console.log(this.allRequests)
      },
      (error: any) => {
        console.error(error)
      }
    )
  }

  getNumberAndPercentageOfRejectedRequests() {
    this.requestService.getNumberOfRejectedRequests().subscribe (
      (response: any) => {
        this.rejectedRequests = response
      },
      (error: any) => {
        console.error(error)
      }
    )
  }

  getNumberAndPercentageOfFinishedRequests() {
    this.requestService.getNumberOfFinishedRequests().subscribe (
      (response: any) => {
        this.finishedRequests = response
      },
      (error: any) => {
        console.error(error)
      }
    )
  }
/*********************************************************************/
superAdmins: any
ordinaryUsers: any
networkAdmins: any
generalAdmins: any

getNumberAndPercentageOfSuperAdmins() {
  this.userService.getNumberOfSuperAdmins().subscribe (
    (response: any) => {
      this.superAdmins = response
    },
    (error: any) => {
      console.error(error)
    }
  )
}

getNumberAndPercentageOfNetworkAdmins() {
  this.userService.getNumberOfNetworkAdmins().subscribe (
    (response: any) => {
      this.networkAdmins = response
    },
    (error: any) => {
      console.error(error)
    }
  )
}

getNumberAndPercentageOfGeneralAdmins() {
  this.userService.getNumberOfGeneralAdmins().subscribe (
    (response: any) => {
      this.generalAdmins = response
    },
    (error: any) => {
      console.error(error)
    }
  )
}

getNumberAndPercentageOfOrdinaryUsers() {
  this.userService.getNumberOfOrdinaryUsers().subscribe (
    (response: any) => {
      this.ordinaryUsers = response
    },
    (error: any) => {
      console.error(error)
    }
  )
}




}
