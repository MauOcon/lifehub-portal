import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TopicResourceRelation } from '../../domain/models/topic-resource-relation.model';
import { TopicRelationRepository } from '../../domain/repositories/topic-relation.repository';

@Injectable({ providedIn: 'root' })
export class SaveTopicRelationsUseCase {
  private readonly repository = inject(TopicRelationRepository);

  execute(learningPathTopicId: number, relations: TopicResourceRelation[]): Observable<void> {
    return this.repository.save(learningPathTopicId, relations);
  }
}
