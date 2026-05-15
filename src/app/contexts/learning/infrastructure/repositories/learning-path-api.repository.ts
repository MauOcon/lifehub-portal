import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearningPathItem } from '../../domain/models/learning-path-item.model';
import { LearningPathRepository } from '../../domain/repositories/learning-path.repository';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LearningPathApiRepository extends LearningPathRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/learn/goals';

  override getByGoalId(goalId: number): Observable<LearningPathItem[]> {
    throw new Error('Method not implemented.');
  }
  override save(goalId: number, items: LearningPathItem[]): Observable<LearningPathItem[]> {
    const newItems = items.filter(item => !item.topicId);
    const existingItems = items.filter(item => !!item.topicId);

    const requests: Observable<LearningPathItem[]>[] = [];

    if (newItems.length) {
      requests.push(this.http.post<LearningPathItem[]>(`${this.apiUrl}/${goalId}`, newItems));
    }
    if (existingItems.length) {
      requests.push(this.http.patch<LearningPathItem[]>(`${this.apiUrl}/${goalId}`, existingItems));
    }

    return forkJoin(requests).pipe(
      map(results => results.flat().filter((item): item is LearningPathItem => !!item))
    );
  }
}
