import { TopicResourceRelation } from '../../../domain/models/topic-resource-relation.model';

export const TOPIC_RELATION_MOCK_DATA: Record<number, TopicResourceRelation[]> = {
  // Tema I.1 Componentes (topicId: 2) - cobertura 100%
  2: [
    { relationId: 1, learningPathTopicId: 2, resourceTopicId: 101, resourceTopicName: '2. Componentes básicos', resourceName: 'Angular Docs', coveragePercentage: 60 },
    { relationId: 2, learningPathTopicId: 2, resourceTopicId: 201, resourceTopicName: '3. Componentes', resourceName: 'Curso Udemy Angular', coveragePercentage: 40 },
  ],
  // Tema I.2 Directivas (topicId: 3) - cobertura 60%
  3: [
    { relationId: 3, learningPathTopicId: 3, resourceTopicId: 102, resourceTopicName: '3.1 Directivas estructurales', resourceName: 'Angular Docs', coveragePercentage: 40 },
    { relationId: 4, learningPathTopicId: 3, resourceTopicId: 202, resourceTopicName: '5. Directivas', resourceName: 'Curso Udemy Angular', coveragePercentage: 20 },
  ],
  // Tema I Fundamentos (topicId: 1) - cobertura 100%
  1: [
    { relationId: 5, learningPathTopicId: 1, resourceTopicId: 100, resourceTopicName: '1. Introducción a Angular', resourceName: 'Angular Docs', coveragePercentage: 100 },
  ],
};
