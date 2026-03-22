export type FrameworkDomain = {
  name: string;
  theories: string[];
};

export const FRAMEWORK_LIBRARY: FrameworkDomain[] = [
  {
    name: "Reward and motivation",
    theories: [
      "dopamine and incentive salience",
      "reward prediction error",
      "variable reinforcement",
      "novelty and uncertainty seeking",
      "craving loops"
    ]
  },
  {
    name: "Emotional learning",
    theories: [
      "classical conditioning",
      "operant conditioning",
      "state-dependent learning",
      "repetition-driven consolidation",
      "extinction failure"
    ]
  },
  {
    name: "Threat and defense",
    theories: [
      "amygdala threat tagging",
      "hypervigilance",
      "avoidance learning",
      "fight-flight-freeze-fawn responses",
      "defensive prediction"
    ]
  },
  {
    name: "Cognitive control",
    theories: [
      "prefrontal regulation",
      "emotional override of executive control",
      "cognitive reappraisal failure",
      "attentional narrowing",
      "decision compression under stress"
    ]
  },
  {
    name: "Habit and plasticity",
    theories: [
      "cue-routine-reward loops",
      "automaticity",
      "context-dependent habits",
      "neuroplastic reinforcement",
      "behavioral sensitization"
    ]
  },
  {
    name: "Attachment and interpersonal dynamics",
    theories: [
      "attachment activation",
      "protest behavior",
      "intermittent reinforcement in attachment",
      "proximity-seeking",
      "rejection sensitivity"
    ]
  },
  {
    name: "Learning and decision biases",
    theories: [
      "loss aversion",
      "salience bias",
      "confirmation bias",
      "catastrophic interpretation",
      "short-term relief bias"
    ]
  }
];

export function getFrameworkPromptBlock() {
  return FRAMEWORK_LIBRARY.map(
    (domain) => `${domain.name}: ${domain.theories.join(", ")}`
  ).join("\n");
}
