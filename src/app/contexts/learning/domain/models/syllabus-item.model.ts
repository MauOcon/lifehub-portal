export interface SyllabusItem {
  topicId: number;
  number: string;
  name: string;
  progress: number;
  activityDate: Date | null;
  fatherId: number;
}
