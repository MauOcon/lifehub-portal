import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Goal } from '../../domain/models/goal.model';
import { GoalRepository } from '../../domain/repositories/goal.repository';

@Injectable({
  providedIn: 'root',
})
export class GoalApiRepository extends GoalRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/learn/goals';

  override getAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }
}
