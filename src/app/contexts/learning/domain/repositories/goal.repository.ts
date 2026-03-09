import { Observable } from 'rxjs';
import { Goal } from '../models/goal.model';

export abstract class GoalRepository {
  abstract getAll(): Observable<Goal[]>;
}
