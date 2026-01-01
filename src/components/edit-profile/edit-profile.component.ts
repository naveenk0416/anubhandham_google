import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  interestsList: string[] = ['Reading', 'Hiking', 'Cooking', 'Travel', 'Movies', 'Music', 'Sports', 'Art'];

  profilePicturePreview = signal<string | null>('https://picsum.photos/300/300?random=10');

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
      country: ['', Validators.required],
    }),
    educationInfo: this.fb.group({
      education: ['', Validators.required],
      occupation: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(200)]],
    }),
    lifestyleInfo: this.fb.group({
      interests: this.fb.array([], [Validators.required, Validators.minLength(1)])
    }),
    communicationInfo: this.fb.group({
      contactPreference: ['', Validators.required]
    })
  });

  private formValues = toSignal(
    this.profileForm.valueChanges.pipe(startWith(this.profileForm.value))
  );

  get interestsFormArray() {
    return this.profileForm.get('lifestyleInfo.interests') as FormArray;
  }

  profileCompleteness = computed(() => {
    const values = this.formValues();
    if (!values) return 0;

    const totalFields = 15; // 13 form fields + picture + interests array
    let filledFields = 0;

    // Basic Info
    if (values.basicInfo?.fullName) filledFields++;
    if (values.basicInfo?.gender) filledFields++;
    if (values.basicInfo?.dob) filledFields++;
    
    // Religion Info
    if (values.religionInfo?.religion) filledFields++;
    if (values.religionInfo?.caste) filledFields++;
    if (values.religionInfo?.motherTongue) filledFields++;

    // Location Info
    if (values.locationInfo?.city) filledFields++;
    if (values.locationInfo?.state) filledFields++;
    if (values.locationInfo?.country) filledFields++;

    // Education Info
    if (values.educationInfo?.education) filledFields++;
    if (values.educationInfo?.occupation) filledFields++;
    if (values.educationInfo?.bio) filledFields++;

    // Lifestyle Info
    if (values.lifestyleInfo?.interests && values.lifestyleInfo.interests.length > 0) {
      filledFields++;
    }

    // Communication Info
    if(values.communicationInfo?.contactPreference) filledFields++;

    // Profile Picture
    if (this.profilePicturePreview()) {
      filledFields++;
    }

    return (filledFields / totalFields) * 100;
  });

  roundedCompleteness = computed(() => Math.round(this.profileCompleteness()));

  ngOnInit(): void {
    // In a real app, you would fetch this data from an API
    this.loadMockProfileData();
  }

  loadMockProfileData() {
    this.profileForm.patchValue({
      basicInfo: {
        fullName: 'Priya Sharma',
        gender: 'female',
        dob: '1996-05-15',
      },
      religionInfo: {
        religion: 'Hindu',
        caste: 'Brahmin',
        motherTongue: 'Hindi',
      },
      locationInfo: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
      },
      educationInfo: {
        education: 'Masters in Computer Science',
        occupation: 'Software Engineer',
        bio: 'I am a simple, kind-hearted person who values family and traditions. Looking for a partner with a modern outlook and traditional values.',
      },
      communicationInfo: {
        contactPreference: 'inApp'
      }
    });

    this.interestsFormArray.clear();
    const mockInterests = ['Cooking', 'Travel', 'Movies'];
    mockInterests.forEach(interest => this.interestsFormArray.push(new FormControl(interest)));
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

  onInterestChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.interestsFormArray.push(new FormControl(target.value));
    } else {
      const index = this.interestsFormArray.controls.findIndex(x => x.value === target.value);
      if (index !== -1) {
        this.interestsFormArray.removeAt(index);
      }
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.interestsFormArray.value.includes(interest);
  }

  saveChanges() {
    if (this.profileForm.valid) {
      console.log('Profile Updated:', this.profileForm.value);
      console.log('New profile picture selected:', !!this.profilePicturePreview());
      alert('Profile updated successfully!');
      this.router.navigate(['/home']);
    } else {
      this.profileForm.markAllAsTouched();
      alert('Please fill all the required fields, including your interests and contact preference.');
    }
  }
}
