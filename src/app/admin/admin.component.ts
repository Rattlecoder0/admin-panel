import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { ProductService } from '../services/product.service';
import { NgForm } from '@angular/forms';

interface product {
  id: null; sku: string; name: string; price: number; images: string[]
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  productsData: any[] = []
  product: product = {
    id: null, sku: '', name: '', price: 0, images: []
  }
  selectedProductImages: string[] = [];
  currentSlide: number = 0;


  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.getProducts()
  }

  getProducts() {
    this.service.getProducts().subscribe({
      next: (data) => {
        this.productsData = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  editProduct(product: any) {
    this.product = { ...product };
  }

  deleteProduct(id: number) {
    this.service.deleteProduct(id).subscribe({
      next: () => {
        this.getProducts();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  deleteImage(index: number) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.product.images.splice(index, 1);
    }
  }


  addProduct() {
    this.product = {
      id: null,
      sku: '',
      name: '',
      price: 0,
      images: []
    };
  }

  onSubmit(form: NgForm) {
    if (this.product.name && this.product.price) {
      if (this.product.id) {
        this.service.updateProduct(this.product.id, this.product).subscribe({
          next: () => {
            this.getProducts();
            form.resetForm();
            this.product = {
              id: null,
              sku: '',
              name: '',
              price: 0,
              images: []
            };
            const closeBtn = document.getElementById('mcb')
            if(closeBtn){
              closeBtn.click()
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      } else {
        this.service.addProduct(this.product).subscribe({
          next: () => {
            this.getProducts();
            form.resetForm();
            this.product = {
              id: null,
              sku: '',
              name: '',
              price: 0,
              images: []
            };
            const closeBtn = document.getElementById('mcb')
            if(closeBtn){
              closeBtn.click()
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    }
    else{
      alert('Enter Product Name and Price')
    }
  }

  onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      files.forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // Limit to 10MB
          alert('File size exceeds the 10MB limit');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            this.product.images.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }
  

  showImages(product: any) {
    this.selectedProductImages = product.images;
  }

  nextSlide() {
    if (this.selectedProductImages.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.selectedProductImages.length;
    }
  }

  prevSlide() {
    if (this.selectedProductImages.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.selectedProductImages.length) % this.selectedProductImages.length;
    }
  }



}
