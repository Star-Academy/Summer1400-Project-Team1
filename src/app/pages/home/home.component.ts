import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit,AfterViewInit {
  @ViewChild("users",{static:false}) users!: ElementRef;
  @ViewChild("total_operation",{static:false}) total_operation!: ElementRef;
  @ViewChild("daily_watch",{static:false}) daily_watch!: ElementRef;
  constructor(private router:Router) {}

  ngAfterViewInit(): void {
    let count=0;
    let id_user=setInterval(()=>{
      this.users.nativeElement.textContent  =count.toString();
      count+=Math.floor( 693130/4000 );
      if(count>=693130){
        clearInterval(id_user);
      }
    },1);
    let count2=0;
    let id_total=setInterval(()=>{
      this.total_operation.nativeElement.textContent  =count2.toString();
      count2+=Math.floor( 9003130/500 );
      if(count2>=9003130){
        clearInterval(id_total);
      }
    },1);
    let count3=0;
    let id_watch=setInterval(()=>{
      this.daily_watch.nativeElement.textContent  =count3.toString();
      count3+=Math.floor( 3130/1000 );
      if(count3>=3130){
        clearInterval(id_watch);
      }
    },1);

  }


  ngOnInit(): void {
  }
  

  

  onClickDashboard(){
    this.router.navigateByUrl("/dashboard");
  }


}
