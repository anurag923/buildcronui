import { Component, OnInit } from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $:any;
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent  {
  closeResult = '';
  submitted = false;
  updatesubmitted = false;
  faq_id:any;
  faqs: any;
  status: any;
  question: any;
  answer: any;
  faqs_id: any;
  totalRecords: any;
  page:any =1;
  count:number = 3;
  showless: any;
  faqid: any;
  ReadMore:any;
  // updatestatus:any[] = [ ]
  constructor(private fb:FormBuilder,private modalService: NgbModal,private toaster:ToastrService,private superadminservice:SuperadminService, private spinner:NgxSpinnerService) { }
   AddFaqs = this.fb.group({
     question:['', Validators.required],
     answer:['', Validators.required],
    //  id:['', Validators.required],
    //  status:['', Validators.required]
   });
   UpdateFaqs = this.fb.group({
    question:['', Validators.required],
    answer:['', Validators.required],
    // id:['', Validators.required],
    // status:['', Validators.required]
  });
  ngOnInit() {
    this.allfaqs();
    this.superadminservice.allfaqs().subscribe((res)=>{
      if(res){
        // console.log(res);
        this.faqs = res;
        for (let index = 0; index < this.faqs.length; index++) {
          // console.log(this.faqs[index].id);
         this.ReadMore
        }
      }
      else{
        console.warn(res);
        this.spinner.hide();
      }
    },(error)=>{
      console.log(error);
      this.spinner.hide();
    })
  }
 get f(){
   return this.AddFaqs.controls
 }
 get u(){
  return this.UpdateFaqs.controls
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

  // all faqs

  allfaqs(){
    this.spinner.show();
    this.superadminservice.allfaqs().subscribe((res)=>{
      if(res){
        console.log(res);
        this.faqs = res;
        this.totalRecords = res.length;
        this.spinner.hide();
      }
      else{
        console.warn(res);
        this.spinner.hide();
      }
    },(error)=>{
      console.log(error);
      this.spinner.hide();
    })
  }

  // Add Faqs

  Add(){
    const minst = this
    this.submitted = true;
    if(this.AddFaqs.invalid){
      return
    }
    else{
      // console.log(this.AddFaqs.value);
      const data = {
        "question": this.AddFaqs.value.question,
        "answer": this.AddFaqs.value.answer,
        "status": true
      }
      // const formData = new FormData
      // formData.append('question',this.AddFaqs.value.question);
      // formData.append('answer',this.AddFaqs.value.answer);
      // formData.append('id',this.AddFaqs.value.id);
      // formData.append('stauts',this.AddFaqs.value.status);
      this.superadminservice.Addfaqs(data).subscribe((res)=>{
        console.log(res);
        minst.toaster.success('Successfully faq Uploaded!');
        this.allfaqs();
        $('#AddFaqs').hide();
        this.AddFaqs.reset();
        this.submitted = false;
      },(error)=>{
        console.error(error);
        minst.toaster.error('Somthing went to wrong');
        $('#AddFaqs').hide();
        this.AddFaqs.reset();
        this.submitted = false;
      })
    }
  }
  
  view(id:any,faq_id:any,question:any,answer:any,status:any){
    this.faq_id = id
    this.faqs_id = faq_id;
    this.question = question;
    this.answer = answer;
    this.status = status;
  }

  // Update

  edit(id:any,faq_id:any,question:any,answer:any,status:any){
    this.faq_id = id;
    this.faqs_id = faq_id;
    this.question = question;
    this.answer = answer;
    this.status = status
  }

  Update(){
    const mint = this
    this.updatesubmitted = true;
    if(this.UpdateFaqs.invalid){
      return
    }
    else{
      console.log(this.UpdateFaqs.value);
      const data = {
        "question": this.UpdateFaqs.value.question,
        "answer": this.UpdateFaqs.value.answer,
        "status": 'true'
      }
      // const formData = new FormData
      // formData.append('question',this.UpdateFaqs.value.question);
      // formData.append('answer',this.UpdateFaqs.value.answer);
      // formData.append('id',this.UpdateFaqs.value.id);
      // formData.append('status',this.UpdateFaqs.value.status);
      this.superadminservice.updatefaq(this.faq_id,data).subscribe((res)=>{
        console.log(res);
        mint.toaster.success('Successfully faq updated!');
        this.allfaqs();
        this.UpdateFaqs.reset();
        this.updatesubmitted = false;
        $('#UpdateFaqs').hide();
      },(error)=>{
        console.error(error);
        mint.toaster.error('Somthing went to wrong');
        this.UpdateFaqs.reset();
        this.updatesubmitted = false;
        $('#UpdateFaqs').hide();
      })
    }
  }

  // delete
  delete(faq_id:any){
    this.faq_id = faq_id
  }
  Delete(){
    const mint = this
    this.superadminservice.deletefaq(this.faq_id).subscribe((res)=>{
      console.log(res);
      mint.toaster.success('Successfully faq Deleted!');
      this.allfaqs();
      $('#DeleteFaqs').hide();
    },(error)=>{
      console.error(error);
      mint.toaster.error('Somthing went to wrong');
      $('#DeleteFaqs').hide();
    })
  }

// show text

// isReadMore:any = {};
 
// ReadLess = false;

  Read_More(id:any) {
    // $("#GFG_UP").removeClass("d-none");
    // $("#GFG_UP").addClass("color fontWeight");
    $("#Readless" + id).hide();
    // this.faqid = id;
    //  console.log(id);
    //  this.ReadMore = ! this.ReadMore;

    //  if(id){
    //     console.log(id)
    //     this.ReadLess = true;
    //     this.ReadMore = false;
    //   }
    //   else {
    //     console.log(id)
    //     this.ReadMore = true;
    //   }


    // for(let i=0;i<this.faqs.length;i++){
    //   if(i == id){
    //     console.log(i)
    //     this.ReadMore = ! this.ReadMore;
    //   }
    //   else {
    //     console.log(i)
    //     this.ReadMore = true;
    //   }
    // }

  //   this.faqs.filter((e:any)=> {
  //     this.faq_id = e.id;
  //   });
  //  if(i == this.faq_id){
  //   console.log(i);
  //   this.ReadMore = ! this.ReadMore;
  //  }
  //  else{
  //    this.ReadMore = true;
  //  }
    // console.log(this.faqs);
    // this.faqs.some((e:any)=> {
    //   console.log(this.ReadMore)
    //   if(e.id == id){
    //     console.log(e.id);
    //     this.showless = e.answer;
    //     this.ReadMore = false;
    //     this.ReadLess = true;
    //     this.ReadMore = !this.ReadMore; 
    //   }
    //   else{
    //     console.log(e.id)
    //     this.ReadMore = false;
    //   }
    // })
    // console.log(test[0].answer);
    // this.showless = test[0].answer;
    // this.ReadMore = false;
    //  this.isReadMore[id] = !this.isReadMore[id];
  }
  Read_Less(id:any){
    $("#Readmore" + id).hide();
    // console.log(id);
    //  this.ReadMore = ! this.ReadMore;
    //  if(id){
    //     console.log(id)
    //     this.ReadLess = false;
    //     this.ReadMore = true;
    //   }
    //   else {
    //     console.log(id)
    //     this.ReadMore = true;
    //   }
  }

  showText(id:any){
    console.log(id);
    this.ReadMore = !this.ReadMore
  }
}
