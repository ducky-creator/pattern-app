import { getLastTenEntries } from "@/lib/entries";
import { FRAMEWORK_LIBRARY } from "@/lib/frameworks";
import { generateNeuroscienceInsight } from "@/lib/openai";
import type { DetectedPattern, PatternEntry } from "@/lib/types";

export async function getDashboardData() {
  const recentEntries = await getLastTenEntries();
  const aiInsight = await generateNeuroscienceInsight(recentEntries);

  return {
    recentEntries,
    patterns: detectPatterns(recentEntries),
    aiInsight,
    frameworkLibrary: FRAMEWORK_LIBRARY
  };
}

function detectPatterns(entries: PatternEntry[]): DetectedPattern[] {
  if (entries.length < 2) {
    return [];
  }

  const byEmotion = entries.reduce<Map<string, PatternEntry[]>>((accumulator, entry) => {
    const current = accumulator.get(entry.emotion) ?? [];
    current.push(entry);
    accumulator.set(entry.emotion, current);
    return accumulator;
  }, new Map());

  const patterns: DetectedPattern[] = [];

  for (const [emotion, emotionEntries] of byEmotion.entries()) {
    if (emotionEntries.length < 2) {
      continue;
    }

    const averageIntensity = Math.round(
      emotionEntries.reduce((total, entry) => total + entry.intensity, 0) /
        emotionEntries.length
    );

    patterns.push({
      id: emotion,
      title: `${emotion} repeats`,
      frameworksApplied: [
        "repetition-driven consolidation",
        "state-dependent learning",
        "automaticity"
      ],
      detectedPattern: `${emotionEntries.length} recent entries cluster around ${emotion.toLowerCase()}.`,
      neuroscienceExplanation: `Reward system: repeated anticipation keeps the loop salient. Emotional learning: the same affective state is being reinforced across episodes. Threat response: elevated intensity suggests the brain is tagging these situations as relevant. Cognitive control: repeated recurrence implies reflection is not consistently interrupting the state shift. Habit formation: the emotion-response sequence is becoming easier to re-enter with repetition.`,
      whyThisIsHappening: `The system is reusing a familiar response profile. Average intensity is ${averageIntensity}/10, which means the state is not isolated noise; it is being rehearsed.`,
      risk: `Repeated exposure can compress the time between trigger and reaction, making the pattern faster and more automatic.`,
      recommendedAction: `Flag the earliest common cue across these entries and interrupt the sequence before the emotion peaks.`
    });
  }

  const highIntensity = entries.filter((entry) => entry.intensity >= 8);

  if (highIntensity.length >= 2) {
    patterns.push({
      id: "high-intensity",
      title: "High intensity cluster",
      frameworksApplied: [
        "amygdala threat tagging",
        "attentional narrowing",
        "behavioral sensitization"
      ],
      detectedPattern: `${highIntensity.length} of the latest entries are high intensity spikes.`,
      neuroscienceExplanation: `Reward system: uncertainty can heighten attentional capture and craving for resolution. Emotional learning: intense events are encoded more strongly and recur more easily. Threat response: the amygdala is likely biasing the system toward rapid defensive interpretation. Cognitive control: high arousal reduces the chance that slower evaluation wins. Habit formation: repeated high-intensity reactions strengthen a rapid trigger-to-action pathway.`,
      whyThisIsHappening: `High arousal narrows the system toward immediate resolution and away from delayed evaluation, so similar triggers keep producing outsized responses.`,
      risk: `Once intensity becomes the norm, behavior can become reactive, compressed, and difficult to reverse in the moment.`,
      recommendedAction: `Treat intensity above 7/10 as a hard stop for action. Delay decisions until the arousal curve has dropped.`
    });
  }

  const lossOfControlLoop = detectLossOfControlLoop(entries);

  if (lossOfControlLoop) {
    patterns.unshift(lossOfControlLoop);
  }

  return patterns.slice(0, 4);
}

function detectLossOfControlLoop(entries: PatternEntry[]): DetectedPattern | null {
  if (entries.length < 3) {
    return null;
  }

  const latestThree = entries.slice(0, 3);
  const allAnxious = latestThree.every(
    (entry) => entry.emotion.trim().toLowerCase() === "anxious"
  );
  const allWithdrawalTriggers = latestThree.every((entry) =>
    matchesWithdrawalTrigger(entry.trigger)
  );

  if (!allAnxious || !allWithdrawalTriggers) {
    return null;
  }

  return {
    id: "loss-of-control-loop",
    title: "Loss of control loop",
    frameworksApplied: [
      "intermittent reinforcement in attachment",
      "attachment activation",
      "amygdala threat tagging",
      "emotional override of executive control",
      "cue-routine-reward loops"
    ],
    detectedPattern: "Loss of control loop",
    neuroscienceExplanation:
      "Reward system: withdrawal cues increase dopamine-driven seeking because uncertainty amplifies craving for resolution. Emotional learning: repeated pairing of distance with anxious activation conditions attachment to the chase itself. Threat response: pullback is being encoded as a threat signal, which drives vigilance, monitoring, and defensive pursuit. Cognitive control: once anxious arousal rises, top-down evaluation is overridden by the urge to close the gap quickly. Habit formation: repeated trigger-anxiety-action cycles are strengthening a loop that becomes easier to enter and harder to interrupt.",
    whyThisIsHappening:
      "The brain is treating distance as both a threat and a variable reward signal. That combination is potent: uncertainty sustains pursuit, anxiety narrows focus, and repetition makes the loop more automatic.",
    risk:
      "Escalation under uncertainty. Re-engagement from a reactive state will reinforce the exact loop that is producing the loss of control pattern.",
    recommendedAction:
      "Freeze outbound action until arousal drops and the timeline has widened. Use delay as a control mechanism, not as a coping gesture.",
    recommendations: [
      "Wait 72 hours before taking action",
      "Do not re-engage from an emotional state"
    ]
  };
}

function matchesWithdrawalTrigger(trigger: string) {
  const normalizedTrigger = trigger.trim().toLowerCase();
  const keywords = [
    "withdrawal",
    "withdraw",
    "pull away",
    "pulled away",
    "pulling away",
    "distance",
    "distancing",
    "detached",
    "avoidant",
    "avoiding",
    "ignored",
    "ignore"
  ];

  return keywords.some((keyword) => normalizedTrigger.includes(keyword));
}
