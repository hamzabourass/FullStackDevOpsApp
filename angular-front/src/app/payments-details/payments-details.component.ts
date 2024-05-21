import {Component, OnInit} from '@angular/core';
import {StudentsService} from "../services/students.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-payments-details',
  templateUrl: './payments-details.component.html',
  styleUrl: './payments-details.component.css'
})
export class PaymentsDetailsComponent implements OnInit {

  paymentId!: number;
  pdfFileUrl : any;
  constructor(private  studentsService : StudentsService, private activatedRoute : ActivatedRoute) {
  }
  ngOnInit(): void {
    this.paymentId = this.activatedRoute.snapshot.params['id']
    this.studentsService.getPaymentDetails(this.paymentId).subscribe(
      {
        next: data => {

          let blob = new Blob([data],{type: 'application/pdf'});
          this.pdfFileUrl = window.URL.createObjectURL(blob);

        },
        error : err => {
          console.log(err);
        }
      }
    )
  }

  afterLoadComplete(event: any) {

  }
}
