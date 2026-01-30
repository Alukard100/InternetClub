import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material';
import { UsersService } from '../../services/users/users';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../interfaces/user';
import { PageEvent } from '@angular/material/paginator';
import { MinutesToTimePipe } from "../../pipes/minutesToTime/minutes-to-time-pipe";
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialog } from './add-user-dialog/add-user-dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MATERIAL_IMPORTS,
    MinutesToTimePipe,
    ReactiveFormsModule
],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})

export class Users implements OnInit {

  searchControl = new FormControl('');

  displayedColumns = ['userId', 'total', 'status', 'time', 'actions'];
  dataSource = new MatTableDataSource<User>();

  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  search = '';


  constructor(private userService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search = value || '';
      this.pageNumber = 1;
      this.loadUsers();
    });

    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getUsers(this.search, this.pageNumber, this.pageSize)
      .subscribe(res => {
        this.totalCount = res.totalCount;
        this.dataSource.data = res.items;
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadUsers();
  }

  isActive(status: number): boolean {
    return status === 0;
  }

  getStatusLabel(status: number): string {
    return status === 0 ? 'Active' : 'Inactive';
  }

  openAddUserDialog() {
  const dialogRef = this.dialog.open(AddUserDialog, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(created => {
    if (created) {
      this.loadUsers(); // refresh list
    }
  });
}

}
