import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PaymentType} from "../model/students.model";
import {StudentsService} from "../services/students.service";

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrl: './new-payment.component.css',

})
export class NewPaymentComponent implements OnInit{

  paymentFormGroup! : FormGroup;
  studentCode! : string;
  paymentTypes: string[] = []; // Initialize the array
  pdfFileUrl!: string;
  showProgress : boolean = false;
  constructor(private fb: FormBuilder, private activatedRoute : ActivatedRoute, private studentsService : StudentsService) {
  }
  ngOnInit(): void {

    // Assuming PaymentType is an enum
    for (let type in PaymentType) {

        let value = PaymentType[type];
        if (typeof value === 'string'){
          this.paymentTypes.push(value);
        }
    }

    this.studentCode = this.activatedRoute.snapshot.params['code'];

    this.paymentFormGroup = this.fb.group(
      {
        date : this.fb.control(''),
        amount : this.fb.control(''),
        type : this.fb.control(''),
        studentCode : this.fb.control(this.studentCode),
        fileSource : this.fb.control(''),
        fileName : this.fb.control('')
      }
    )
  }

  selectFile(event: any) {
    if(event.target.files.length>0){
      let file = event.target.files[0];
      this.paymentFormGroup.patchValue({
        fileSource : file,
        fileName : file.name
      });

      // stock l'url du fichier
      this.pdfFileUrl = window.URL.createObjectURL(file);
    }
  }

  savePayment() {
    this.showProgress = true
    let formData = new FormData();
    let date = new Date(this.paymentFormGroup.value.date);
    let formattedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    console.log(formattedDate)
    formData.set("date" , formattedDate);
    formData.set('amount' , this.paymentFormGroup.value.amount);
    formData.set('type' , this.paymentFormGroup.value.type);
    formData.set('studentCode' , this.paymentFormGroup.value.studentCode);
    formData.set('file' , this.paymentFormGroup.value.fileSource);

    this.studentsService.savePayment(formData).subscribe(
      {
        next : () => {
          this.showProgress = false;
          alert('Payment Saved successfully');
        },
        error : err => {
          console.log(err);
        }
      }
    )



    /*let date = new Date(this.paymentFormGroup.value.date);
    let formatedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    const formData = new FormData();
    console.log(formatedDate);
    formData.append('file' , this.paymentFormGroup.get('fileSource')!.value);
    formData.append("amount" , this.paymentFormGroup.value.amount);
    formData.append("type" , this.paymentFormGroup.value.type);
    formData.append("date" , formatedDate);
    formData.append("studentCode" , this.paymentFormGroup.value.sudentCode);*/

  }

  afterLoadComplete(event: any) {
    console.log(event);
  }
}
