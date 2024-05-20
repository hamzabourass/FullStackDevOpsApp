import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudentsService} from "../services/students.service";
import {MatTableDataSource} from "@angular/material/table";
import {Payment, Student} from "../model/students.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit{

  public payments!: Array<Payment>;
  studentCode! : string;
  dataSource! : MatTableDataSource<Payment>;
  public displayedColumns = ['id','date','amount','type','status','firstName'];
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(private activatedRoute: ActivatedRoute, private studentsService : StudentsService,private router : Router) {
  }
  ngOnInit(): void {
    this.studentCode = this.activatedRoute.snapshot.params['code'];
    this.studentsService.getStudentPayments(this.studentCode)
      .subscribe({
        next : data => {
          this.payments = data
          this.dataSource = new MatTableDataSource<Payment>(this.payments);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error : err => {
          console.log(err);
        }
      })
  }

  newPayment() {
    this.studentCode = this.activatedRoute.snapshot.params['code'];
    this.router.navigateByUrl(`/admin/new-payment/${this.studentCode}`)
  }
}
