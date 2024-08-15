import { Component } from '@angular/core';

@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrl: './admins-list.component.scss'
})
export class AdminsListComponent {
  items = [
    { name: 'Mohamed Ben Ali', position: 'Developer', matricule: 'DEV001', role: 'Network Admin' },
    { name: 'Fatma Bouazizi', position: 'Manager', matricule: 'MAN002', role: 'Security Admin' },
    { name: 'Ahmed Khelifi', position: 'Analyst', matricule: 'ANA003', role: 'Monitoring Admin' },
    { name: 'Houssem Karray', position: 'Designer', matricule: 'DES004', role: 'General Specs Admin' },
    { name: 'Salma Gharbi', position: 'Tester', matricule: 'TES005', role: 'Network Admin' },
    { name: 'Nizar Trabelsi', position: 'Developer', matricule: 'DEV006', role: 'Security Admin' },
    { name: 'Amira Chebbi', position: 'Manager', matricule: 'MAN007', role: 'Monitoring Admin' },
    { name: 'Fares Mbarek', position: 'Analyst', matricule: 'ANA008', role: 'General Specs Admin' },
    { name: 'Rania Dhouib', position: 'Designer', matricule: 'DES009', role: 'Network Admin' },
    { name: 'Oussama Jlassi', position: 'Tester', matricule: 'TES010', role: 'Security Admin' },
    { name: 'Amani Fekih', position: 'Developer', matricule: 'DEV011', role: 'Monitoring Admin' },
    { name: 'Nadia Boussida', position: 'Manager', matricule: 'MAN012', role: 'General Specs Admin' },
    { name: 'Yassine Hamdi', position: 'Analyst', matricule: 'ANA013', role: 'Network Admin' },
    { name: 'Nesrine Zarrouk', position: 'Designer', matricule: 'DES014', role: 'Security Admin' },
    { name: 'Khalil Amri', position: 'Tester', matricule: 'TES015', role: 'Monitoring Admin' },
    { name: 'Hiba Rejeb', position: 'Developer', matricule: 'DEV016', role: 'General Specs Admin' },
    { name: 'Hatem Gueddiche', position: 'Manager', matricule: 'MAN017', role: 'Network Admin' },
    { name: 'Ines Fathallah', position: 'Analyst', matricule: 'ANA018', role: 'Security Admin' },
    { name: 'Mouna Charfi', position: 'Designer', matricule: 'DES019', role: 'Monitoring Admin' },
    { name: 'Anis Belaid', position: 'Tester', matricule: 'TES020', role: 'General Specs Admin' }
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
            case 'position':
                comparison = a.position.localeCompare(b.position);
                break;
            case 'matricule':
                comparison = a.matricule.localeCompare(b.matricule);
                break;
            case 'role':
                comparison = a.role.localeCompare(b.role);
                break;
        }

        // Return the comparison based on the sort direction
        return this.sortDirection ? comparison : -comparison;
    });
  }

  filteredItems = [...this.items];
  searchQuery: string = '';

  onSearch() {
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
