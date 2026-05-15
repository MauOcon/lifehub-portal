import { Observable } from 'rxjs';
import { LearningPathItem } from '../models/learning-path-item.model';

export abstract class LearningPathRepository {
  abstract getByGoalId(goalId: number): Observable<LearningPathItem[]>;
  abstract save(goalId: number, items: LearningPathItem[]): Observable<LearningPathItem[]>;
}
