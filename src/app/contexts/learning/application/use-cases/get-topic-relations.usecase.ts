import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TopicResourceRelation } from '../../domain/models/topic-resource-relation.model';
import { TopicRelationRepository } from '../../domain/repositories/topic-relation.repository';

@Injectable({ providedIn: 'root' })
export class GetTopicRelationsUseCase {
  private readonly repository = inject(TopicRelationRepository);

  execute(learningPathTopicId: number): Observable<TopicResourceRelation[]> {
    return this.repository.getByTopicId(learningPathTopicId);
  }
}
