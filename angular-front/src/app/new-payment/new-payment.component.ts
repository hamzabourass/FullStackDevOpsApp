import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {PaymentType} from "../model/students.model";
import {PaymentsComponent} from "../payments/payments.component";

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
  constructor(private fb: FormBuilder, private activatedRoute : ActivatedRoute) {
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
      this.pdfFileUrl = window.URL.createObjectURL(file);
    }
  }

  savePayment() {

  }
}
