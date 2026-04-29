import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { GoalDetail } from '../../domain/models/goal-detail.model';
import { GoalDetailRepository } from '../../domain/repositories/goal-detail.repository';
import { GOAL_DETAIL_MOCK_DATA } from './mock-data/goal-detail.mock-data';

@Injectable()
export class GoalDetailMockRepository extends GoalDetailRepository {
  override getById(goalId: number): Observable<GoalDetail> {
    const goal = GOAL_DETAIL_MOCK_DATA.find((g) => g.id === goalId);
    if (!goal) {
      return throwError(() => ({ status: 404, error: { message: 'Meta no encontrada' } }));
    }
    return of(goal).pipe(delay(500));
  }
}
