import { Provider } from '@angular/core';
import { GoalRepository } from './domain/repositories/goal.repository';
import { GoalApiRepository } from './infrastructure/repositories/goal-api.repository';
import { GoalDetailRepository } from './domain/repositories/goal-detail.repository';
import { GoalDetailMockRepository } from './infrastructure/repositories/goal-detail-mock.repository';
import { GoalDetailApiRepository } from './infrastructure/repositories/goal-detail-api.repository';

export const learningProviders: Provider[] = [
  { provide: GoalRepository, useClass: GoalApiRepository },
  { provide: GoalDetailRepository, useClass: GoalDetailApiRepository },
];
