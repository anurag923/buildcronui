import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from '../services/superadmin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted = false;
  roles: any;
  constructor(private fb:FormBuilder,private modalService: NgbModal,private toaster:ToastrService,private superadminservice:SuperadminService, private spinner:NgxSpinnerService,private router:Router) { }
  Login = this.fb.group({
    email:['', Validators.required],
    password:['', Validators.required]
    // password:['',[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]]
  });
  ngOnInit(): void {
  }
  get f(){
    return this.Login.controls
  }
  Submit(){
    this.submitted = true;
    if(this.Login.invalid){
      return
    }
    else{
      const formData = {
        email:this.Login.value.email,
        password:this.Login.value.password
      }
      console.log(formData);
      this.superadminservice.Login(formData).subscribe((res)=>{
        console.log(res);
        sessionStorage.setItem('auth_token', res.access);
        this.toaster.success('Successfully Login Done!')
        this.router.navigate(['/SuperAdmin']);
        this.roles = res.role;
        sessionStorage.setItem('company_id',res.company_id);
        // this.toaster.success('Successfully Login Done!')
        if(this.roles === 'SA'){
          this.router.navigate(['/SuperAdmin']);
        }
        else{
          this.router.navigate(['/CilentAdmin']);
        }
      },(error)=>{
        console.error(error);
        this.toaster.error('Somthing went to wrong');
      });
    }
  }
}
