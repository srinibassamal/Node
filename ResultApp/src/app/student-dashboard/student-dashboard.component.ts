import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { StudentModel } from './student.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  studentValue!:FormGroup;

  studentObj:StudentModel=new StudentModel;

  studentList:any=[];

  btnSaveShow:boolean=true;
  btnUpdateShow:boolean=false;

  formValue: any;

  constructor(private formBuilder:FormBuilder, private api:ApiService) { }

  ngOnInit(): void {
    this.studentValue=this.formBuilder.group({
      rollnumber:[''],
      name:[''],
      dateofbirth:[''],
      score:['']
    })
    this.getStudent();
  }
  AddStudent(){
    this.studentObj.rollnumber=this.studentValue.value.rollnumber;
    this.studentObj.name=this.studentValue.value.name;
    this.studentObj.dateofbirth=this.studentValue.value.dateofbirth;
    this.studentObj.score=this.studentValue.value.score;

    this.api.postStudent(this.studentObj).subscribe({
      next: (v: any) => {console.log(v)},
    error: (e: any) => {
      alert("Error")
      console.log(e)
    },
    complete: () => {
      console.log('complete')
      alert("Student record added")
      let ref = document.getElementById('cancel')
    ref?.click();
      this.studentValue.reset();
      this.getStudent();
    } })
  }
  getStudent() {
    this.api.getStudent().subscribe((res: any) =>{
      this.studentList=res;
    })  
  }
  deleteStudent(data:any){
    this.api.deleteStudent(data.id).subscribe({next: (v: any) => {
      console.log(v)
    },
    error: (e: any) => {
      alert("Error")
      console.log(e)
    },
    complete: () => {
      console.log('student record deleted')
      alert("Student record deleted")
      this.getStudent();
    } })

  }
  editStudent(data:any){
    this.studentValue.controls["rollnumber"].setValue(data.rollnumber);
    this.studentValue.controls["name"].setValue(data.name);
    this.studentValue.controls["dateofbirth"].setValue(data.dateofbirth);
    this.studentValue.controls["score"].setValue(data.score);
    this.studentObj.id=data.id;
    this.showUpdate();
  }

  updateStudent(){
    this.studentObj.rollnumber=this.studentValue.value.rollnumber;
    this.studentObj.name=this.studentValue.value.name;
    this.studentObj.dateofbirth=this.studentValue.value.dateofbirth;
    this.studentObj.score=this.studentValue.value.score;

    this.api.putStudent(this.studentObj,this.studentObj.id).subscribe({
      next: (v: any) => {console.log(v)},
    error: (e: any) => {
      alert("Error")
      console.log(e)
    },
    complete: () => {
      console.log('complete')
      alert("Student record updated")
      let ref = document.getElementById('cancel')
    ref?.click();
      this.studentValue.reset();
      this.getStudent();
      this.showSave()
      this.studentObj.id=0;
    } })
  }
  showSave(){
    this.btnSaveShow=true;
    this.btnUpdateShow=false;
  }

  showUpdate(){
    this.btnSaveShow=false;
    this.btnUpdateShow=true;
  }
}