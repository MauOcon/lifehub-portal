import { Observable } from 'rxjs';
import { GoalDetail } from '../models/goal-detail.model';

export abstract class GoalDetailRepository {
  abstract getById(goalId: number): Observable<GoalDetail>;
}
