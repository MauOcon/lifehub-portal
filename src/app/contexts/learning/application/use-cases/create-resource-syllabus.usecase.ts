import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSyllabusRequest } from '../../domain/models/syllabus-topic.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateResourceSyllabusUseCase {
  private readonly resourceRepository = inject(ResourceRepository);

  execute(request: CreateSyllabusRequest): Observable<void> {
    return this.resourceRepository.createSyllabus(request);
  }
}
