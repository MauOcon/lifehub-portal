export interface Goal {
  id: number;
  name: string;
  progress: number;
  activityDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
