import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoalDetail } from '../../domain/models/goal-detail.model';
import { GoalDetailRepository } from '../../domain/repositories/goal-detail.repository';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GoalDetailApiRepository extends GoalDetailRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/learn/goals';

  override getById(goalId: number): Observable<GoalDetail> {
    return this.http.get<GoalDetail>(`${this.apiUrl}/${goalId}`);
  }
}
