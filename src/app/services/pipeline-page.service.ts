import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PipelinePageService {

private readonly BASE_URL = "https://localhost:5001/api/v1/";

constructor(
  private http: HttpClient
) { }

getPipelines() {
  return this.http.get(this.BASE_URL  + "Pipeline") 
}

getPipelineById(id: number) {
  
}

}
