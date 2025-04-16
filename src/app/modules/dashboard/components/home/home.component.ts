import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductElement } from 'src/app/modules/product/product/product.component';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  chartBar: any;
  chartDoughnut: any;

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutCanvas') doughnutCanvas!: ElementRef<HTMLCanvasElement>;

  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log("Respuesta de productos: ", data);
        this.processProductResponse(data);
      },
      error: (err) => {
        console.error("Error en productos: ", err);
      }
    });
  }

  processProductResponse(resp: any) {
    const nameProduct: string[] = [];
    const account: number[] = [];

    if (resp.metadata[0].code === "00") {
      const listCProduct: ProductElement[] = resp.product.products;

      listCProduct.forEach((element) => {
        nameProduct.push(element.name);
        account.push(element.account);
      });

      Chart.register(
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        DoughnutController,
        ArcElement,
        Tooltip,
        Legend
      );

      // Gráfico de barras
      this.chartBar = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: nameProduct,
          datasets: [
            { label: 'Productos', data: account }
          ]
        }
      });

      // Gráfico de doughnut
      this.chartDoughnut = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: nameProduct,
          datasets: [
            { label: 'Productos', data: account }
          ]
        }
      });
    }
  }
}