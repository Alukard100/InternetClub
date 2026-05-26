import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material';
import { DashboardService } from '../../services/dashboard/dashboard';
import { DashboardDto } from '../../interfaces/dashboard';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';



Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [
    MATERIAL_IMPORTS,
    BaseChartDirective
],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  //dashboard data
  dashboardData: DashboardDto | null = null;
  
  //chart stuff
  selectMode: 'earnings' | 'transactions' = 'earnings';
  barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Earnings',
        backgroundColor: '#7c4dff',
      }
    ]
  };

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  //donut chart stuff
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#7c4dff', '#42a5f5'],
      }
    ]
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData() {
    return this.dashboardService.getDashboardData().subscribe(data => {
      this.dashboardData = data;

      this.updateBarChart();
      this.updateDoughnutChart();
  
      this.chart?.update();
      this.cdr.detectChanges();
      
      console.log('Dashboard data:', this.dashboardData); 

    });
  }

  updateBarChart() {
    if (!this.dashboardData) return;

    const labels = this.dashboardData.weeklyStats.map(x => x.day);

    const data = this.selectMode === 'earnings'
      ? this.dashboardData.weeklyStats.map(x => x.earnings)
      : this.dashboardData.weeklyStats.map(x => x.transactionCount);

    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          label: this.selectMode === 'earnings' ? 'Earnings' : 'Transactions',
          backgroundColor: '#8540F5'
        }
      ]
    };
  }

  updateDoughnutChart() {
    if (!this.dashboardData) return;

    this.doughnutChartData = {
      labels: this.dashboardData.paymentStats.map(x => x.method),
      datasets: [
        {
          data: this.dashboardData.paymentStats.map(x => x.count),
          backgroundColor: ['#8540F5', '#42a5f5']
        }
      ]
    };
  }

}
