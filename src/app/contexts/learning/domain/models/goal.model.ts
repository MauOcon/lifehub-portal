export interface Goal {
  id: number;
  name: string;
  progress: number;
  activityDate: Date;
  createdAtDate?: Date;
  updatedAt?: Date;
}
