export interface SyllabusTopic {
  topicId: number;
  order: number;
  name: string;
  hierarchicalSymbol: string;
  fatherId: number;
  subTopics?: SyllabusTopic[];
}

export interface CreateSyllabusRequest {
  resourceName: string;
  syllabus: SyllabusTopic;
}

export interface UpdateSyllabusTopicRequest {
  topicId: number;
  topicName: string;
  hierarchicalNumber: string;
  fatherShareValue: number;
  progressValue: number;
  isAutoCalculated: boolean;
}
