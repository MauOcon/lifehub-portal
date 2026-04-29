import { Observable } from 'rxjs';
import { TopicResourceRelation } from '../models/topic-resource-relation.model';

export abstract class TopicRelationRepository {
  abstract getByTopicId(learningPathTopicId: number): Observable<TopicResourceRelation[]>;
  abstract save(learningPathTopicId: number, relations: TopicResourceRelation[]): Observable<void>;
}
