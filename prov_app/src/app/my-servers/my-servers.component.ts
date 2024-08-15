import { Component } from '@angular/core';

@Component({
  selector: 'app-my-servers',
  templateUrl: './my-servers.component.html',
  styleUrl: './my-servers.component.scss'
})
export class MyServersComponent {
  // items = [
  //   { name: 'Server A', creationDate: '2024-07-28', status: 'Stopped', cpu: '4 vCPUs', memory: '16 GB', storage: '100 GB' },
  //   { name: 'Server B', creationDate: '2024-07-27', status: 'Running', cpu: '2 vCPUs', memory: '8 GB', storage: '50 GB' },
  //   { name: 'Server C', creationDate: '2024-07-26', status: 'Running', cpu: '8 vCPUs', memory: '32 GB', storage: '200 GB' },
  //   { name: 'Server D', creationDate: '2024-07-25', status: 'Running', cpu: '4 vCPUs', memory: '16 GB', storage: '150 GB' },
  //   { name: 'Server E', creationDate: '2024-07-24', status: 'Stopped', cpu: '2 vCPUs', memory: '8 GB', storage: '50 GB' },
  //   { name: 'Server F', creationDate: '2024-07-23', status: 'Running', cpu: '4 vCPUs', memory: '16 GB', storage: '100 GB' },
  //   { name: 'Server G', creationDate: '2024-07-22', status: 'Running', cpu: '2 vCPUs', memory: '8 GB', storage: '50 GB' },
  //   { name: 'Server H', creationDate: '2024-07-21', status: 'Stopped', cpu: '4 vCPUs', memory: '16 GB', storage: '100 GB' },
  //   { name: 'Server I', creationDate: '2024-07-20', status: 'Stopped', cpu: '8 vCPUs', memory: '32 GB', storage: '200 GB' },
  //   { name: 'Server J', creationDate: '2024-07-19', status: 'Stopped', cpu: '2 vCPUs', memory: '8 GB', storage: '50 GB' },
  //   { name: 'Server K', creationDate: '2024-07-18', status: 'Stopped', cpu: '4 vCPUs', memory: '16 GB', storage: '100 GB' }
  // ];

  items = [
    { name: 'AppServer01', creationDate: '2024-07-28', status: 'Stopped', cpu: 4, memory: 16, storage: 256, publicIP: '34.120.22.151', privateIP: '10.0.0.10' },
    { name: 'DBServer02', creationDate: '2024-07-27', status: 'Running', cpu: 8, memory: 32, storage: 512, publicIP: '54.178.88.20', privateIP: '10.0.0.11' },
    { name: 'WebServer03', creationDate: '2024-07-26', status: 'Running', cpu: 2, memory: 8, storage: 128, publicIP: '13.89.11.190', privateIP: '10.0.0.12' },
    { name: 'FileServer04', creationDate: '2024-07-25', status: 'Running', cpu: 6, memory: 24, storage: 1024, publicIP: '52.14.66.95', privateIP: '10.0.0.13' },
    { name: 'MailServer05', creationDate: '2024-07-24', status: 'Stopped', cpu: 4, memory: 16, storage: 512, publicIP: '44.230.42.159', privateIP: '10.0.0.14' },
    { name: 'BackupServer06', creationDate: '2024-07-23', status: 'Running', cpu: 8, memory: 32, storage: 2048, publicIP: '18.117.68.22', privateIP: '10.0.0.15' },
    { name: 'CacheServer07', creationDate: '2024-07-22', status: 'Running', cpu: 4, memory: 16, storage: 256, publicIP: '3.128.70.11', privateIP: '10.0.0.16' },
    { name: 'DevServer08', creationDate: '2024-07-21', status: 'Stopped', cpu: 2, memory: 8, storage: 128, publicIP: '35.177.90.214', privateIP: '10.0.0.17' },
    { name: 'TestServer09', creationDate: '2024-07-20', status: 'Running', cpu: 6, memory: 24, storage: 512, publicIP: '54.165.39.67', privateIP: '10.0.0.18' },
    { name: 'ProdServer10', creationDate: '2024-07-19', status: 'Stopped', cpu: 8, memory: 32, storage: 1024, publicIP: '34.211.85.240', privateIP: '10.0.0.19' },
    { name: 'AnalyticsServer11', creationDate: '2024-07-18', status: 'Running', cpu: 12, memory: 64, storage: 4096, publicIP: '18.208.124.21', privateIP: '10.0.0.20' },
    { name: 'StorageServer12', creationDate: '2024-07-17', status: 'Running', cpu: 8, memory: 32, storage: 2048, publicIP: '3.22.87.119', privateIP: '10.0.0.21' },
    { name: 'MonitoringServer13', creationDate: '2024-07-16', status: 'Stopped', cpu: 4, memory: 16, storage: 256, publicIP: '52.10.38.250', privateIP: '10.0.0.22' },
    { name: 'APIService14', creationDate: '2024-07-15', status: 'Running', cpu: 6, memory: 24, storage: 512, publicIP: '44.192.182.193', privateIP: '10.0.0.23' },
    { name: 'LoadBalancer15', creationDate: '2024-07-14', status: 'Running', cpu: 4, memory: 16, storage: 128, publicIP: '35.164.97.123', privateIP: '10.0.0.24' },
    { name: 'SecurityServer16', creationDate: '2024-07-13', status: 'Stopped', cpu: 8, memory: 32, storage: 256, publicIP: '34.125.68.78', privateIP: '10.0.0.25' },
    { name: 'ProxyServer17', creationDate: '2024-07-12', status: 'Running', cpu: 4, memory: 16, storage: 128, publicIP: '54.186.51.101', privateIP: '10.0.0.26' },
    { name: 'ManagementServer18', creationDate: '2024-07-11', status: 'Stopped', cpu: 6, memory: 24, storage: 512, publicIP: '18.117.26.203', privateIP: '10.0.0.27' },
    { name: 'LogServer19', creationDate: '2024-07-10', status: 'Running', cpu: 8, memory: 32, storage: 1024, publicIP: '34.120.133.82', privateIP: '10.0.0.28' },
    { name: 'ClusterNode20', creationDate: '2024-07-09', status: 'Running', cpu: 12, memory: 64, storage: 2048, publicIP: '54.72.124.59', privateIP: '10.0.0.29' }
];






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
