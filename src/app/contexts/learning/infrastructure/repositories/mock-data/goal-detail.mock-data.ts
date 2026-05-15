import { GoalDetail } from '../../../domain/models/goal-detail.model';

export const GOAL_DETAIL_MOCK_DATA: GoalDetail[] = [
  {
    id: 1,
    name: 'Dominar Angular',
    progress: 45,
    activityDate: new Date('2025-01-15'),
    learningPathCoverage: { totalTopics: 12, coveredTopics: 5 },
    learningPath: [
      { topicId: 1, hierarchicalSymbol: 'I', name: 'Fundamentos de Angular', fatherId: 0, order: 1, coveragePercentage: 100 },
      { topicId: 2, hierarchicalSymbol: 'I.1', name: 'Componentes', fatherId: 1, order: 1, coveragePercentage: 100 },
      { topicId: 3, hierarchicalSymbol: 'I.2', name: 'Directivas', fatherId: 1, order: 2, coveragePercentage: 60 },
      { topicId: 4, hierarchicalSymbol: 'II', name: 'Gestión de Estado', fatherId: 0, order: 2, coveragePercentage: 0 },
      { topicId: 5, hierarchicalSymbol: 'II.1', name: 'Servicios', fatherId: 4, order: 1, coveragePercentage: 0 },
      { topicId: 6, hierarchicalSymbol: 'II.2', name: 'NgRx', fatherId: 4, order: 2, coveragePercentage: 0 },
    ],
  },
  {
    id: 2,
    name: 'Aprender Spring Boot',
    progress: 70,
    activityDate: new Date('2025-01-20'),
    learningPathCoverage: { totalTopics: 8, coveredTopics: 6 },
    learningPath: [
      { topicId: 10, hierarchicalSymbol: 'I', name: 'Spring Core', fatherId: 0, order: 1, coveragePercentage: 100 },
      { topicId: 11, hierarchicalSymbol: 'I.1', name: 'Inyección de dependencias', fatherId: 10, order: 1, coveragePercentage: 100 },
      { topicId: 12, hierarchicalSymbol: 'II', name: 'Spring MVC', fatherId: 0, order: 2, coveragePercentage: 50 },
    ],
  },
  {
    id: 3,
    name: 'Fundamentos de AWS',
    progress: 10,
    activityDate: null,
    learningPath: [],
  },
];
