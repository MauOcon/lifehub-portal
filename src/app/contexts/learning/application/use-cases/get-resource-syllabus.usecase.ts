import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SyllabusItem } from '../../domain/models/syllabus-item.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

@Injectable({
  providedIn: 'root',
})
export class GetResourceSyllabusUseCase {
  private readonly resourceRepository = inject(ResourceRepository);

  execute(resourceName: string): Observable<SyllabusItem[]> {
    return this.resourceRepository.getSyllabus(resourceName);
  }
}
