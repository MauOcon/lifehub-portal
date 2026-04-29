import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LearningPathItem } from '../../domain/models/learning-path-item.model';
import { LearningPathRepository } from '../../domain/repositories/learning-path.repository';

@Injectable({ providedIn: 'root' })
export class SaveLearningPathUseCase {
  private readonly repository = inject(LearningPathRepository);

  execute(goalId: number, items: LearningPathItem[]): Observable<void> {
    return this.repository.save(goalId, items);
  }
}
