import { SyllabusItem } from './syllabus-item.model';

export interface Resource {
  resourceId: number;
  position: number;
  name: string;
  location: string;
  progress: number;
  activityDate: Date;
  syllabus?: SyllabusItem[];
}
