import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material';
import { UsersService } from '../../services/users/users';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../interfaces/user';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialog } from './add-user-dialog/add-user-dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UserTimePipe } from "../../pipes/user-time/user-time-pipe";
import { AddTimeDialog } from './add-time-dialog/add-time-dialog';



@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
    UserTimePipe
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

  now = Date.now();

  constructor(private userService: UsersService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = Date.now();
      this.cdr.markForCheck();
    }, 6000);

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

  actionButtonStatus2(user: User) {
    if (user.status === 1 && user.availableSeconds <= 1) {
      return;
    } 

    if (user.status === 0) {
      this.userService.deactivateUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.log(err)
      });
    } else {
      this.userService.activateUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.log(err)
      });
    }
  }

  openAddUserDialog() {
  const dialogRef = this.dialog.open(AddUserDialog, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(created => {
    if (created) {
      this.loadUsers();
    }
  });
  }

  openAddTimeDialog(user: User) {
    const dialogRef = this.dialog.open(AddTimeDialog, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(amount => {
      if (amount) 
        this.loadUsers();
    });

  }

}
