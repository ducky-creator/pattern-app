"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const emotions = [
  "Calm",
  "Anxious",
  "Frustrated",
  "Overwhelmed",
  "Sad",
  "Motivated"
];

const initialState = {
  trigger: "",
  emotion: emotions[0],
  intensity: 5,
  action: ""
};

export function LogEntryForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formState)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data?.error ?? "Something went wrong while saving.");
      return;
    }

    setFormState(initialState);
    setMessage("Entry saved.");
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Daily Log</p>
          <h2>Record today&apos;s signal</h2>
        </div>
        <span className="panel-badge">Firestore ready</span>
      </div>

      <form className="log-form" onSubmit={handleSubmit}>
        <label>
          <span>Trigger</span>
          <textarea
            required
            rows={3}
            placeholder="What happened right before the emotion showed up?"
            value={formState.trigger}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                trigger: event.target.value
              }))
            }
          />
        </label>

        <div className="field-row">
          <label>
            <span>Emotion</span>
            <select
              value={formState.emotion}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  emotion: event.target.value
                }))
              }
            >
              {emotions.map((emotion) => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Intensity</span>
            <input
              min={1}
              max={10}
              type="range"
              value={formState.intensity}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  intensity: Number(event.target.value)
                }))
              }
            />
            <strong className="intensity-value">{formState.intensity}/10</strong>
          </label>
        </div>

        <label>
          <span>Action Taken</span>
          <textarea
            required
            rows={4}
            placeholder="What did you do next?"
            value={formState.action}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                action: event.target.value
              }))
            }
          />
        </label>

        <button className="primary-button" disabled={isPending} type="submit">
          {isPending ? "Refreshing..." : "Save entry"}
        </button>

        {message ? <p className="status-success">{message}</p> : null}
        {error ? <p className="status-error">{error}</p> : null}
      </form>
    </section>
  );
}
