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
  topicName: string | null;
  hierarchicalNumber: string | null;
  fatherShareValue: number | null;
  progressValue: number | null;
  isAutoCalculated: boolean;
}
