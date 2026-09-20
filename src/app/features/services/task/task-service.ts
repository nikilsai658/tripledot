import { Injectable } from '@angular/core';
import { Api } from '../../../core/api/api';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private api:Api){}
  getTask(){
   return this.api.GET('Task');
  }
  postTask(data:any){
    return this.api.POST('Task',data);
  }
  getbyIdTask(id:any){
    return this.api.GET(`Task/${id}`);
  }
  UpdateTask(id:any,data:any){
    return this.api.PUT(`Task/${id}`,data);
  }
  deleteTask(id:any){
    return this.api.DELETE(`Task/${id}`);
  }
}
