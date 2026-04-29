export interface GoalDetail {
  id: number;
  name: string;
  progress: number;
  activityDate: Date | null;
  learningPathCoverage?: {
    totalTopics: number;
    coveredTopics: number;
  };
}
