import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupListView } from './models/group-list-view.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

  getGroups() {
    return this.http.get<GroupListView[]>(`/api/group`);
  }
}
