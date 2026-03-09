import { Observable } from 'rxjs';
import { Resource } from '../models/resource.model';

export abstract class ResourceRepository {
  abstract getAll(): Observable<Resource[]>;
}
