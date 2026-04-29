import { GoalDetail } from '../../../domain/models/goal-detail.model';

export const GOAL_DETAIL_MOCK_DATA: GoalDetail[] = [
  {
    id: 1,
    name: 'Dominar Angular',
    progress: 45,
    activityDate: new Date('2025-01-15'),
    learningPathCoverage: { totalTopics: 12, coveredTopics: 5 },
  },
  {
    id: 2,
    name: 'Aprender Spring Boot',
    progress: 70,
    activityDate: new Date('2025-01-20'),
    learningPathCoverage: { totalTopics: 8, coveredTopics: 6 },
  },
  {
    id: 3,
    name: 'Fundamentos de AWS',
    progress: 10,
    activityDate: null,
  },
];
