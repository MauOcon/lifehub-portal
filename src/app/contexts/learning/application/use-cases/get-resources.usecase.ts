import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Resource } from '../../domain/models/resource.model';
import { ResourceRepository } from '../../domain/repositories/resource.repository';

@Injectable({
  providedIn: 'root',
})
export class GetResourcesUseCase {
  private readonly resourceRepository = inject(ResourceRepository);

  execute(): Observable<Resource[]> {
    var resources = this.resourceRepository.getAll();
    console.log('🚀 Use Case - Get Resources:', resources);
    return resources;
  }
}
