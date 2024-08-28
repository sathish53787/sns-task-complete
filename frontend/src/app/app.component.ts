import { Component } from '@angular/core';
import { ProjectserviceService } from './projectservice.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Task';
  public showeyeIcon: any;
  public type: any;
  public showPage: any;
  public user: any;

  public role_type: any[] = [];
  public first_name: any;
  public last_name: any;
  public email_id: any;
  public mobile_number: any;
  public user_role: any;
  public user_password: any;
  public password: string = '';
  public showUserList: boolean = false;
  userList:any;
  emailPattern = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"; 


  constructor( private projectservice : ProjectserviceService,private router: Router)
  {
    this.type='password';
    this.showPage='login';
    this.role_type=['User','Admin','Guest'];

     // Retrieve user from sessionStorage if available
     const storedUser = sessionStorage.getItem('user');
     if (storedUser) {
       this.user = JSON.parse(storedUser);
       this.showPage = 'dashboard'; // Redirect to dashboard if user is found
     }
     this.checkUserRole();
  }
  checkUserRole() {
    if (this.user && this.user.role == "Admin") {
      this.showUserList = true;
      this.fetchUserList(); // Fetch user list if role is Admin
    } else {
      this.showUserList = false;
    }
  }
  fetchUserList() {
    const storedUser:any = sessionStorage.getItem('user');
    let role = JSON.parse(storedUser)
    
    this.projectservice.getUserList(role.role).subscribe(
      (data: any) => {
        this.userList = data.users;
      },
      (error) => {
        console.error('Error fetching user list:', error);
      }
    );
  }

  hideShow() 
  {
    if (this.type === 'text') 
    {
      this.type = 'password';
      this.showeyeIcon = false;
    } 
    else 
    {
      this.type = 'text';
      this.showeyeIcon = true;
    }
  }

  signIn()
  {
    this.showPage='signin'
  }

  saveDetails(registerForm: NgForm) {
    const userDetail = {
        role: this.user_role,
        firstName: this.first_name, 
        lastName: this.last_name, 
        email: this.email_id, 
        phone: this.mobile_number, 
        password: this.user_password 
    };

    this.projectservice.saveUsersDetail(userDetail).subscribe(
        (data: any) => {
            if (data.status === 'saved') {
                this.showPage = 'login';
                this.resetProperties();
            }
        },
        (error) => {
          if (error.status === 400 && error.error.title === 'Email already registered') {
              alert('The provided email is already associated with an existing account.');
          } else {
              console.error('Error saving user:', error); // Log other errors
          }
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.valid) {
      const loginDetails = {
        email: this.email_id,
        password: this.password
      };

      this.projectservice.loginUser(loginDetails).subscribe(
        (response: any) => {
          console.log('Login successful:', response);

          // Extract user data from response
          const user = response.user;

          // Update user property
          this.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email
          };

          // Store user in sessionStorage
          sessionStorage.setItem('user', JSON.stringify(this.user));

          // Navigate to dashboard
          this.showPage = 'dashboard';
        },
        (error) => {
          console.error('Login failed:', error);
          alert('Login failed: ' + (error.error.message || 'An error occurred. Please try again.'));
        }
      );
    }
  }

  logout() {
    sessionStorage.clear();
    this.showPage = 'login';
    this.user = null;
    this.showUserList = false;

  }

  resetProperties(): void {
    this.first_name = '';
    this.last_name = '';
    this.email_id = '';
    this.mobile_number = '';
    this.user_password = '';
  
  }

}

