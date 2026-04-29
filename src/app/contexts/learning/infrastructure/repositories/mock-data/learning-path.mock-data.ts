import { LearningPathItem } from '../../../domain/models/learning-path-item.model';

export const LEARNING_PATH_MOCK_DATA: Record<number, LearningPathItem[]> = {
  1: [
    { topicId: 1, hierarchicalSymbol: 'I', name: 'Fundamentos de Angular', fatherId: 0, order: 1, coveragePercentage: 100 },
    { topicId: 2, hierarchicalSymbol: 'I.1', name: 'Componentes', fatherId: 1, order: 1, coveragePercentage: 100 },
    { topicId: 3, hierarchicalSymbol: 'I.2', name: 'Directivas', fatherId: 1, order: 2, coveragePercentage: 60 },
    { topicId: 4, hierarchicalSymbol: 'II', name: 'Gestión de Estado', fatherId: 0, order: 2, coveragePercentage: 0 },
    { topicId: 5, hierarchicalSymbol: 'II.1', name: 'Servicios', fatherId: 4, order: 1, coveragePercentage: 0 },
    { topicId: 6, hierarchicalSymbol: 'II.2', name: 'NgRx', fatherId: 4, order: 2, coveragePercentage: 0 },
  ],
  2: [
    { topicId: 10, hierarchicalSymbol: 'I', name: 'Spring Core', fatherId: 0, order: 1, coveragePercentage: 100 },
    { topicId: 11, hierarchicalSymbol: 'I.1', name: 'Inyección de dependencias', fatherId: 10, order: 1, coveragePercentage: 100 },
    { topicId: 12, hierarchicalSymbol: 'II', name: 'Spring MVC', fatherId: 0, order: 2, coveragePercentage: 50 },
  ],
};
