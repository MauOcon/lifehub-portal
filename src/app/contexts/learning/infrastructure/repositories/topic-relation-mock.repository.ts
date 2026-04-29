import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TopicResourceRelation } from '../../domain/models/topic-resource-relation.model';
import { TopicRelationRepository } from '../../domain/repositories/topic-relation.repository';
import { TOPIC_RELATION_MOCK_DATA } from './mock-data/topic-relation.mock-data';

@Injectable()
export class TopicRelationMockRepository extends TopicRelationRepository {
  override getByTopicId(learningPathTopicId: number): Observable<TopicResourceRelation[]> {
    return of(TOPIC_RELATION_MOCK_DATA[learningPathTopicId] ?? []).pipe(delay(300));
  }

  override save(learningPathTopicId: number, relations: TopicResourceRelation[]): Observable<void> {
    TOPIC_RELATION_MOCK_DATA[learningPathTopicId] = relations;
    return of(undefined).pipe(delay(300));
  }
}
