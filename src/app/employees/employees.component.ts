import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../services/admin.service';
declare var $: any;
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  closeResult = '';
  submitted = false;
  updatesubmitted = false;
  employe_id:any;
  employelist:any;
  projectlist: any;
  dropdownList:any[]=[];
  dropdownSettings:IDropdownSettings = {};
  selectedItems:any[] = [];
  ProjectList: any[] = [];
  name: any;
  email: any;
  mobile: any;
  emid: any;
  constructor(private adminservice:AdminService,private modalService: NgbModal,private fb:FormBuilder,private spinner:NgxSpinnerService,private toaster:ToastrService) { }
  AddEmployee = this.fb.group({
    // date:['', Validators.required],
    name:['', Validators.required],
    // id:['', Validators.required],
    // designation:['', Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    // project_assigned:['', Validators.required]
  });
  UpdateEmployee = this.fb.group({
    // date:['', Validators.required],
    name:['', Validators.required],
    // id:['', Validators.required],
    // designation:['', Validators.required],
    email:['',[Validators.required,Validators.email]],
    mobile:['',[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    // project_assigned:['', Validators.required]
  });
  ngOnInit(){
    this.allemploys();
    this.allprojects();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
  }
  get f(){
    return this.AddEmployee.controls
  }
  get u(){
    return this.UpdateEmployee.controls
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // project list

  allprojects(){
    this.spinner.show();
    let tmp:any[] = [];
    this.adminservice.Projectslist().subscribe((res)=>{
      if(res){
        console.log(res);
        this.projectlist = res;

        for(let i=0; i < this.projectlist.length; i++) {
          tmp.push({ item_id: this.projectlist[i].id, item_text: this.projectlist[i].name });
        }
        this.dropdownList = tmp;

        this.spinner.hide();
      }
      else{
        console.warn(res);
      }
    },(error)=>{
      console.error(error);
      this.spinner.hide();
    })
  }

  // employe list

  allemploys(){
    this.spinner.show();
    this.adminservice.Employeslist().subscribe((res)=>{
      if(res){
        console.log(res);
        this.employelist = res;
        this.spinner.hide();
      }
      else{
        console.warn(res);
      }
    },(error)=>{
      console.error(error.error.message);
      this.spinner.hide();
    })
  }

  view(employe_id:any,name:any,email:any,mobile:any){
    this.emid =employe_id,
    this.name = name,
    this.email = email,
    this.mobile = mobile
  }
  // Add

  Add(){
    const mint = this
    this.submitted = true;
    if(this.AddEmployee.invalid){
      return
    }
    else{
      let arr1:any[] = []
      // console.log(this.selectedItems);
      for(let i=0; i < this.selectedItems.length; i++) {
        arr1.push(this.selectedItems[i].item_id);
      }
      this.ProjectList = arr1;
      // console.log(this.ProjectList)
      const data = {
          "user": {
          "email": this.AddEmployee.value.email,
          "first_name": this.AddEmployee.value.name,
          "phone_number": this.AddEmployee.value.mobile
          },
          "company": {
            "id":sessionStorage.getItem('company_id')
          },
          "designation": "Site engineer",
          "projects": this.ProjectList
      }
      // const formData = new FormData;
      // formData.append('date',this.AddEmployee.value.date);
      // formData.append('name',this.AddEmployee.value.name);
      // formData.append('id',this.AddEmployee.value.id);
      // formData.append('designation',this.AddEmployee.value.designation);
      // formData.append('email',this.AddEmployee.value.email);
      // formData.append('mobile',this.AddEmployee.value.mobile);
      // formData.append('project_assigned',this.AddEmployee.value.project_assigned);
      this.adminservice.AddEmploye(data).subscribe((res)=>{
        console.log(res)
        mint.toaster.success('Successfully Employe Created!');
        $('#AddEmployee').hide();
        this.allemploys();
        this.AddEmployee.reset();
        this.submitted = false;
      },(error)=>{
        console.error(error);
        mint.toaster.error('Somthing went wrong');
        this.AddEmployee.reset();
        this.submitted = false;
        $('#AddEmployee').hide();
      });
    }
  }

  // update
  edit(employe_id:any,name:any,email:any,mobile:any){
    this.employe_id =employe_id,
    this.name = name,
    this.email = email,
    this.mobile = mobile
  }
  Update(){
    const mint = this
    this.updatesubmitted = true;
    if(this.UpdateEmployee.invalid){
      return
    }
    else{

      const data ={
        "first_name": this.UpdateEmployee.value.name,
        "email": this.UpdateEmployee.value.email,
        "phone_number": this.UpdateEmployee.value.mobile,
        "is_active": true
    }

      const formData = new FormData;
      // formData.append('date',this.UpdateEmployee.value.date);SS
      formData.append('name',this.UpdateEmployee.value.name);
      // formData.append('id',this.UpdateEmployee.value.id);
      // formData.append('designation',this.UpdateEmployee.value.designation);
      formData.append('email',this.UpdateEmployee.value.email);
      formData.append('mobile',this.UpdateEmployee.value.mobile);
      formData.append('project_assigned',this.UpdateEmployee.value.project_assigned);
      this.adminservice.UpdateEmploye(this.employe_id,data).subscribe((res)=>{
        console.log(res)
        mint.toaster.success('Successfully Employe Updated!');
        $('#UpdateEmployee').hide();
        this.allemploys();
      },(error)=>{
        console.error(error);
        mint.toaster.error('Somthing went wrong');
        $('#UpdateEmployee').hide();
      });
    }
  }

// delete

delete(employee_id:any){
  this.employe_id = employee_id
}

Delete(){
  const mint = this
  this.adminservice.DeleteEmploye(this.employe_id).subscribe((res)=>{
    console.log(res);
    mint.toaster.success('Successfully Employe Deleted!');
    $('#DeleteEmployee').hide();
    this.allemploys();
  },(error)=>{
    console.error(error);
    mint.toaster.error('Somthing went wrong');
    $('#DeleteEmployee').hide();
  })
}

}