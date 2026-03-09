import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Goal } from '../../domain/models/goal.model';
import { GoalRepository } from '../../domain/repositories/goal.repository';

@Injectable({
  providedIn: 'root',
})
export class GetGoalsUseCase {
  private readonly goalRepository = inject(GoalRepository);

  execute(): Observable<Goal[]> {
    return this.goalRepository.getAll();
  }
}
