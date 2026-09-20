import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class CourseTaskService {
  constructor(private api:Api){}
  getCourseTask(){
   return this.api.GET('CourseTaskMap');
  }
  postCourseTask(data:any){
    return this.api.POST('CourseTaskMap',data);
  }
  getbyIdCourseTask(id:any){
    return this.api.GET(`CourseTaskMap/${id}`);
  }
  UpdateCourseTask(id:any,data:any){
    return this.api.PUT(`CourseTaskMap/${id}`,data);
  }
  deleteCourseTask(id:any){
    return this.api.DELETE(`CourseTaskMap/${id}`);
  }
}
