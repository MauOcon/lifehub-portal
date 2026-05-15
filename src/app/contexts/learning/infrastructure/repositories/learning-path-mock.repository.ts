import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { LearningPathItem } from '../../domain/models/learning-path-item.model';
import { LearningPathRepository } from '../../domain/repositories/learning-path.repository';
import { LEARNING_PATH_MOCK_DATA } from './mock-data/learning-path.mock-data';

@Injectable()
export class LearningPathMockRepository extends LearningPathRepository {
  override getByGoalId(goalId: number): Observable<LearningPathItem[]> {
    return of(LEARNING_PATH_MOCK_DATA[goalId] ?? []).pipe(delay(300));
  }

  override save(goalId: number, items: LearningPathItem[]): Observable<LearningPathItem[]> {
    LEARNING_PATH_MOCK_DATA[goalId] = items;
    return of(items).pipe(delay(300));
  }
}
