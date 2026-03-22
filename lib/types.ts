export type PatternEntryInput = {
  trigger: string;
  emotion: string;
  intensity: number;
  action: string;
};

export type PatternEntry = PatternEntryInput & {
  id: string;
  createdAt: string;
};

export type AiInsight = {
  frameworksApplied: string[];
  detectedPattern: string;
  neuroscienceExplanation: string;
  whyThisIsHappening: string;
  risk: string;
  recommendedAction: string;
};

export type DetectedPattern = {
  id: string;
  title: string;
  frameworksApplied: string[];
  detectedPattern: string;
  neuroscienceExplanation: string;
  whyThisIsHappening: string;
  risk: string;
  recommendedAction: string;
  recommendations?: string[];
};
