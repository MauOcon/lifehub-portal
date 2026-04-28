import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateSyllabusTopicRequest } from '../../domain/models/syllabus-topic.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateResourceSyllabusUseCase {
  private readonly resourceRepository = inject(ResourceRepository);

  execute(resourceId: number, topics: UpdateSyllabusTopicRequest[]): Observable<UpdateSyllabusTopicRequest[]> {
    return this.resourceRepository.updateSyllabusTopics(resourceId, topics);
  }
}
