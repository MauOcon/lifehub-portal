import { Observable } from 'rxjs';
import { TopicResourceRelation } from '../../domain/models/topic-resource-relation.model';
import { TopicRelationRepository } from '../../domain/repositories/topic-relation.repository';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface SaveTopicRelationRequest {
  relationId: number;
  learningPathTopicId: number;
  resourceTopicId: number;
  coveragePercentage: number;
}

@Injectable({
  providedIn: 'root',
})
export class TopicRelationApiRepository extends TopicRelationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/learn/goal/learning-path-topics';

  override getByTopicId(learningPathTopicId: number): Observable<TopicResourceRelation[]> {
    return this.http.get<TopicResourceRelation[]>(`${this.apiUrl}/${learningPathTopicId}/relations`);
  }

  override save(learningPathTopicId: number, relations: TopicResourceRelation[]): Observable<TopicResourceRelation[]> {
    const body: SaveTopicRelationRequest[] = relations.map(r => ({
      relationId: r.relationId,
      learningPathTopicId: r.learningPathTopicId,
      resourceTopicId: r.resourceTopicId,
      coveragePercentage: r.coveragePercentage,
    }));
    return this.http.post<TopicResourceRelation[]>(`${this.apiUrl}/${learningPathTopicId}/relations`, body);
  }
}
