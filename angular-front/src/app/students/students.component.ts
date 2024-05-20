import {AfterViewInit, Component, OnInit, ViewChild, viewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {StudentsService} from "../services/students.service";
import {Student} from "../model/students.model";

// @ts-ignore
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent implements OnInit{

  public students!: Array<Student>;
  public dataSource!: MatTableDataSource<Student>;
  public displayedColumns: string[] = ['id','firstName','lastName','email','code','programId','payments'];
  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort! : MatSort;
  constructor(private router: Router, private studentService : StudentsService) {
  }
  ngOnInit(): void {

    this.studentService.getStudents().subscribe(
      {
        next : data => {
          this.students = data;
          this.dataSource = new MatTableDataSource<Student>(this.students);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error : err => {
          console.log(err);
        }
      }
    )
  }


/*  filterStudents(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value;

    getPayments(student : any) {
    this.router.navigateByUrl("/admin/payments")

  }
  }*/

  studentPayments(student: Student) {
    this.router.navigateByUrl(`/admin/student-details/${student.code}`)
  }
}
