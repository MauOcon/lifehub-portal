import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoalDetail } from '../../domain/models/goal-detail.model';
import { GoalDetailRepository } from '../../domain/repositories/goal-detail.repository';

@Injectable({ providedIn: 'root' })
export class GetGoalDetailUseCase {
  private readonly repository = inject(GoalDetailRepository);

  execute(goalId: number): Observable<GoalDetail> {
    return this.repository.getById(goalId);
  }
}
