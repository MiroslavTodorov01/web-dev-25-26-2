import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const acceptableDomains = ["@edu.com", "@university.edu", "@a.a", "@m.m"];

export function allowedDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailCopy : string = control.value;

    for(let i = 0; i < acceptableDomains.length; i++)
    {
      if(emailCopy.includes(acceptableDomains[i]))
      {
        return null;
      }
    }

    return  { NotAcceptableDomain: true };
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    TableModule,
    Select,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  registrationForm: FormGroup;
  users: Array<{ firstName: string; lastName: string; email: string; university: string }> = [];
  universities = [
    { label: 'Harvard University', value: 'Harvard University' },
    { label: 'Stanford University', value: 'Stanford University' },
    { label: 'MIT', value: 'MIT' },
    { label: 'Oxford University', value: 'Oxford University' },
    { label: 'Cambridge University', value: 'Cambridge University' },
    { label: 'Yale University', value: 'Yale University' },
    { label: 'Princeton University', value: 'Princeton University' }
  ];

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, allowedDomainValidator()]],
      university: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      
     const contains =this.users.some(filed => filed.email === this.registrationForm.get("email")?.value);

     if (contains)
     {
        this.registrationForm.get('email')?.setErrors({ duplicate: true });
        return;
     }
     
      this.users.push(this.registrationForm.value);
      console.log('User added:', this.registrationForm.value);
      console.log('All users:', this.users);
      this.registrationForm.reset();
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    console.log(field?.errors)
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['minlength']) {
        return 'Minimum length is 2 characters';
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors?.['NotAcceptableDomain'])
      {
        return 'Domain must be ' + acceptableDomains.join(", ");
      }
      if (field.errors?.['duplicate'])
      {
        let index : number = 1;
        const currentEmail : string = this.registrationForm.get("email")?.value;

        for(let i = 0; i < this.users.length; i++)
        {
          if (this.users[i].email === currentEmail)
          {
            index = i;
            break;
          }
        }

        if (index != -1) 
        {
          return 'email is already added (row: ' + (index + 1).toString() + ')';
        }

        return 'email is already added';
      }
    }
    return '';
  }

  removeUser(index: number)
  {

    if(confirm("Are you sure you want to delete this user with email: " + this.users.at(index)?.email))
    {
      this.users.splice(index, 1);
    };
    
  }
}
