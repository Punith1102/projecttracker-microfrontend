import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../shared-lib/src/models/auth.models';
import { environment } from '../../../../shared-lib/src/environments/environment';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
    users: User[] = [];
    loading: boolean = true;
    private apiUrl = `${environment.apiUrl}/admin/users`;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.http.get<User[]>(this.apiUrl).subscribe({
            next: (data) => {
                this.users = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }
}
