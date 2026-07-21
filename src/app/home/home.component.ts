import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonHttpService } from '../services/Json-Http/json-http.service';
import { DashboardAnalyticsResponse, Out_of_stock_Data, WeeklyOrdersData } from '../Model/analytics';
import { ProductModel } from 'src/app/Data/cart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  greeting: string = '';
  analytics = {} as DashboardAnalyticsResponse;
  weeklyOrdersData = {} as WeeklyOrdersData;
  out_of_stock_Data = {} as Out_of_stock_Data;

  chartData: any;
  chartOptions: any;
  barChartData: any;
  barChartOptions: any;
  products: ProductModel[] = [];
  
  tHeaderList: string[] = [];

  constructor(private jsonHttpService: JsonHttpService) { }

  ngOnInit(): void {
    this.getDashboardAnalytics();

    // this.getDataForChart();
    this.getDataFor_out_of_stock_Chart();
    this.getGreetings();
    this.getHeaderValues();
    // this.getTop10StockLesser();
  }

  getGreetings() {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  getDashboardAnalytics() {
    this.jsonHttpService.FetchDashBoardAnalytics().subscribe({
      next: (response: any) => {
        this.analytics = response.data[0];
      }, error: (error) => {
        console.error('Error fetching dashboard analytics:', error);
      }
    });
  }

  getTop10StockLesser() {
    this.jsonHttpService.FetchTop10ThresoldProducts({ availableNoOfProducts: 10 }).subscribe({
      next: (response: any) => {
        this.products = response.data;        
      }, error: (error) => {
        console.error('Error fetching dashboard analytics:', error);
      }
    });
  }


  getDataForChart() {
    this.jsonHttpService.FetchDashBoardChartAnalytics().subscribe({
      next: (response: any) => {

        this.weeklyOrdersData = response;
        this.getChartData();
        // Process and set chart data here
      }, error: (error) => {
        console.error('Error fetching chart data:', error);
      }
    });

  }

  getDataFor_out_of_stock_Chart() {
    this.jsonHttpService.FetchDashBoardChartAnalyticsOut_Of_Stock().subscribe({
      next: (response: any) => {
        this.out_of_stock_Data = response;
        this.getPieChart();
      }, error: (error) => {
        console.error('Error fetching chart data:', error);
      }
    });

  }

  getChartData() {

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    this.chartData = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: 'Previous Week',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: this.weeklyOrdersData.previousWeek
        },
        {
          label: 'Current Week',
          backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
          borderColor: documentStyle.getPropertyValue('--p-gray-500'),
          data: this.weeklyOrdersData.currentWeek
        }
      ]
    }

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    }
  }

  getPieChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.barChartData = {
      labels: this.out_of_stock_Data.category,
      datasets: [
        {
          data: this.out_of_stock_Data.count,
          backgroundColor: this.out_of_stock_Data.colors,
          hoverBackgroundColor: this.out_of_stock_Data.hoverColors
        }
      ]
    };

    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      cutout: '50%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  getHeaderValues() {
    this.tHeaderList = ['S.No',
      'Name', 'Category',
      'Sub category', 'Stock Avaliable', 'Product status']
  }

}
