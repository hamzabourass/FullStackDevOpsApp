export interface Student {
  id : string,
  code : string,
  firstName : string,
  lastName : string,
  programId : string,
  email : string,
  photo : string
}

export interface Payment {
  id : number,
  date : string,
  amount : number,
  type : string,
  status : string,
  file : string,
  student : Student
}

export interface User{
  id: number,
  email : string,
  fullName: string,
}

export enum PaymentType {
  CASH, CHECK, TRANSFER, DEPOSIT
}

export enum PaymentStatus {
  CREATED, VALIDATED, REJECTED
}
