import { Component, OnInit } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction, TransactionType } from '../../interfaces/transaction';
import { combineLatest, debounceTime, startWith } from 'rxjs';
import { TransactionsService } from '../../services/transactions/transactions';
import { PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../config/date-formats';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-transactions',
  imports: [
    MATERIAL_IMPORTS,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ]
})

export class Transactions implements OnInit {

  TransactionType = TransactionType; // Expose enum to template

  usernameSearch = '';

  filterForm!: FormGroup;

  displayedColumns = ['username', 'amount', 'currency', 'transactionType', 'date'];
  dataSource = new MatTableDataSource<Transaction>();

  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;

  constructor(private fb: FormBuilder, private transactionService: TransactionsService) {}

  ngOnInit(): void {

    this.filterForm = this.fb.group({
      username: [''],
      type: [2],
      startDate: [null],
      endDate: [null]
    });

    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        debounceTime(400)
      )
      .subscribe(filters => {
        this.pageNumber = 1;
        this.loadTransactions(filters);
      });

  }

  loadTransactions(filters: any) {

    const startDate = filters.startDate ? filters.startDate.toISOString() : '';

    const endDate = filters.endDate ? filters.endDate.toISOString() : '';

    this.transactionService
      .getTransactions(
        filters.username || '',
        startDate,
        endDate,
        filters.type ?? 2,
        this.pageNumber,
        this.pageSize
      )
      .subscribe(res => {
        this.totalCount = res.totalCount;
        this.dataSource.data = res.items;
      })
  }

  clearFilters() {
    this.filterForm.reset();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex + 1;
    this.loadTransactions(this.filterForm.value);
  }

  setToday(picker: any) {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    setTimeout(() => {
      this.filterForm.patchValue({
        startDate: start,
        endDate: now
      });

      picker.close();
    });
    
  }

  setThisWeek(picker: any) {
    const now = new Date();
    const start = new Date(now);

    const day = now.getDay(); // 0 = Sunday
    const diff = (day === 0 ? -6 : 1 - day); // Monday start

    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    setTimeout(() => {
      this.filterForm.patchValue({
        startDate: start,
        endDate: now
      });

      picker.close();
    });
    
    
  }

  setThisMonth(picker: any) {
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    setTimeout(() => {
      this.filterForm.patchValue({
        startDate: start,
        endDate: now
      });

      picker.close();
    });

  }

  onDatePickerClosed() {
    this.filterForm.updateValueAndValidity();
  }

}
