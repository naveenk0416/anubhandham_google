import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';

// Mock interface for profile data
interface Profile {
  id: number;
  name: string;
  age: number;
  religion: string;
  caste: string;
  location: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private fb = inject(FormBuilder);

  searchForm = this.fb.group({
    ageFrom: [22],
    ageTo: [35],
    religion: [''],
    motherTongue: [''],
    country: ['India'],
  });

  // Mock data for profiles
  profiles = signal<Profile[]>([
    { id: 1, name: 'Priya Sharma', age: 28, religion: 'Hindu', caste: 'Brahmin', location: 'Mumbai, India', imageUrl: 'https://picsum.photos/300/400?random=1' },
    { id: 2, name: 'Rahul Verma', age: 31, religion: 'Hindu', caste: 'Kshatriya', location: 'Delhi, India', imageUrl: 'https://picsum.photos/300/400?random=2' },
    { id: 3, name: 'Anjali Singh', age: 26, religion: 'Hindu', caste: 'Rajput', location: 'Bangalore, India', imageUrl: 'https://picsum.photos/300/400?random=3' },
    { id: 4, name: 'Vikram Patel', age: 33, religion: 'Hindu', caste: 'Patel', location: 'Ahmedabad, India', imageUrl: 'https://picsum.photos/300/400?random=4' },
    { id: 5, name: 'Sneha Reddy', age: 29, religion: 'Hindu', caste: 'Reddy', location: 'Hyderabad, India', imageUrl: 'https://picsum.photos/300/400?random=5' },
    { id: 6, name: 'Arjun Kumar', age: 30, religion: 'Hindu', caste: 'Yadav', location: 'Chennai, India', imageUrl: 'https://picsum.photos/300/400?random=6' },
    { id: 7, name: 'Neha Gupta', age: 27, religion: 'Hindu', caste: 'Bania', location: 'Kolkata, India', imageUrl: 'https://picsum.photos/300/400?random=7' },
    { id: 8, name: 'Rohan Mehra', age: 32, religion: 'Hindu', caste: 'Khatri', location: 'Pune, India', imageUrl: 'https://picsum.photos/300/400?random=8' },
  ]);

  search() {
    console.log('Searching with filters:', this.searchForm.value);
    // In a real app, you would fetch data from a server based on these filters.
  }
}
