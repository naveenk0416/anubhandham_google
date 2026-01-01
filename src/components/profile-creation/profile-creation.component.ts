import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-creation',
  templateUrl: './profile-creation.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCreationComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentStep = signal(1);
  totalSteps = 5;

  profilePicturePreview = signal<string | null>(null);

  progress = computed(() => (this.currentStep() / this.totalSteps) * 100);
  roundedProgress = computed(() => Math.round(this.progress()));

  profileForm = this.fb.group({
    basicInfo: this.fb.group({
      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
    }),
    religionInfo: this.fb.group({
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      motherTongue: ['', Validators.required],
    }),
    locationInfo: this.fb.group({
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['India', Validators.required],
    }),
    educationInfo: this.fb.group({
      education: ['', Validators.required],
      occupation: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(200)]],
    }),
  });

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicturePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  finish() {
    if (this.profileForm.valid) {
      console.log('Profile Created:', this.profileForm.value);
      console.log('Profile picture selected:', !!this.profilePicturePreview());
      alert('Profile created successfully!');
      this.router.navigate(['/home']);
    } else {
      alert('Please fill all the required fields.');
    }
  }
}
