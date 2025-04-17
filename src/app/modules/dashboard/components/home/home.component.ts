import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
  signal,
  WritableSignal,
} from '@angular/core';
import { Chart } from 'chart.js';
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('dynamicCanvas') dynamicCanvas!: ElementRef<HTMLCanvasElement>;

  private productService = inject(ProductService);
  products: ProductElement[] = [];

  chartInstance: Chart | null = null;

  chartType: WritableSignal<string> = signal('bar');
  chartField: WritableSignal<string> = signal('account');

  availableChartTypes: string[] = ['bar', 'doughnut', 'pie'];
  availableFields: string[] = ['account', 'stock', 'price', 'name'];

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if (data.metadata[0].code === '00') {
          this.products = data.product.products;
          this.createChart();
        }
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      },
    });
  }

  createChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const field = this.chartField();
    const labels = this.products.map((p) => p.name);
    const data = this.products.map((p) => {
      const value = p[field as keyof ProductElement];
      return typeof value === 'number' ? value : 0;
    });

    const backgroundColors = [
      '#36a2eb',
      '#ff6384',
      '#ffcd56',
      '#4bc0c0',
      '#9966ff',
      '#ff9f40',
    ];

    this.chartInstance = new Chart(this.dynamicCanvas.nativeElement, {
      type: this.chartType() as any,
      data: {
        labels,
        datasets: [
          {
            label: `Productos por ${field}`,
            data,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }

  onChartTypeChange(type: string) {
    this.chartType.set(type);
    this.createChart();
  }

  onFieldChange(field: string) {
    this.chartField.set(field);
    this.createChart();
  }
}
