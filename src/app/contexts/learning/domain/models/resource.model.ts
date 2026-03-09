import { SyllabusItem } from './syllabus-item.model';

export interface Resource {
  position: number;
  name: string;
  location: string;
  progress: number;
  activityDate: Date;
  syllabus?: SyllabusItem[];
}
