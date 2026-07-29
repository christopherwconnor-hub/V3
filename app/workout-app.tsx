"use client";

import { useEffect, useRef, useState } from "react";

type Exercise = { name: string; sets?: number; target?: string };
type Day = {
  id: string;
  short: string;
  day: string;
  title: string;
  note?: string;
  exercises: Exercise[];
  finisher?: string;
};
type SetLog = { weight: string; reps: string; done: boolean };
type Logs = Record<string, SetLog[]>;
type Tab = "home" | "workout" | "progress" | "history";

const DAYS: Day[] = [
  {
    id: "monday", short: "MON", day: "Monday", title: "Arms, Shoulders & Abs",
    exercises: [
      { name: "Machine Shoulder Press", sets: 3, target: "10 reps" },
      { name: "Cable Lateral Raise", sets: 3, target: "15 reps" },
      { name: "Rear Delt Fly", sets: 3, target: "15 reps" },
      { name: "Rope Triceps Pushdown", sets: 3, target: "15 reps" },
      { name: "Single-Arm Overhead Triceps Extension", sets: 3, target: "12 reps" },
      { name: "Hammer Curl", sets: 3, target: "12 reps" },
      { name: "Cable Crunch", sets: 3, target: "15 reps" },
      { name: "Side Plank", sets: 3, target: "30–45 seconds each side" },
    ],
    finisher: "15–20 minutes StairMaster or incline treadmill",
  },
  {
    id: "tuesday", short: "TUE", day: "Tuesday", title: "Quads & Glutes",
    note: "Quad-focused with glute support",
    exercises: [
      { name: "Hack Squat", sets: 4, target: "10 reps" },
      { name: "Leg Press (feet shoulder-width, lower on platform)", sets: 4, target: "12 reps" },
      { name: "Walking Lunges", sets: 3, target: "20 steps" },
      { name: "Leg Extension", sets: 3, target: "15 reps" },
      { name: "Hip Abduction", sets: 3, target: "20 reps" },
      { name: "Standing Calf Raise", sets: 3, target: "20 reps" },
    ],
    finisher: "10-minute incline walk",
  },
  {
    id: "wednesday", short: "WED", day: "Wednesday", title: "Recovery",
    exercises: [
      { name: "30–45 minute walk" },
      { name: "Sauna" },
      { name: "Stretch" },
      { name: "Foam roll" },
    ],
  },
  {
    id: "thursday", short: "THU", day: "Thursday", title: "Glutes & Hamstrings (Heavy)",
    note: "This is your biggest glute-building day.",
    exercises: [
      { name: "Barbell Hip Thrust", sets: 4, target: "10 reps" },
      { name: "Romanian Deadlift", sets: 4, target: "10 reps" },
      { name: "Bulgarian Split Squat", sets: 3, target: "10 each leg" },
      { name: "Seated Hamstring Curl", sets: 3, target: "12 reps" },
      { name: "Cable Kickbacks", sets: 3, target: "15 reps" },
      { name: "Hip Abduction", sets: 3, target: "20 reps" },
    ],
    finisher: "10 minutes StairMaster",
  },
  {
    id: "friday", short: "FRI", day: "Friday", title: "Sculpted Back & Core",
    note: "No heavy lat focus.",
    exercises: [
      { name: "Seated Cable Row", sets: 3, target: "12 reps" },
      { name: "Chest-Supported Row", sets: 3, target: "12 reps" },
      { name: "Reverse Pec Deck", sets: 3, target: "15 reps" },
      { name: "Face Pulls", sets: 3, target: "15 reps" },
      { name: "Straight-Arm Pulldown", sets: 2, target: "15 reps (light and controlled)" },
      { name: "Dead Bugs", sets: 3, target: "15 reps" },
      { name: "Pallof Press", sets: 3, target: "12 each side" },
      { name: "Front Plank", sets: 3, target: "45–60 seconds" },
    ],
  },
  {
    id: "saturday", short: "SAT", day: "Saturday", title: "Full Body Conditioning",
    note: "No heavy glute work—just movement and calorie burn.",
    exercises: [
      { name: "Goblet Squat", sets: 3, target: "15 reps" },
      { name: "Dumbbell Romanian Deadlift", sets: 3, target: "12 reps (light to moderate)" },
      { name: "Step-Ups", sets: 3, target: "12 each leg" },
      { name: "Push-Ups (incline if needed)", sets: 3, target: "10–12 reps" },
      { name: "Farmer Carries", sets: 3, target: "rounds" },
      { name: "Cable Woodchoppers", sets: 3, target: "12 each side" },
    ],
    finisher: "20–30 minutes StairMaster, incline walk, or bike",
  },
];

const ICONS = {
  home: "⌂", workout: "↗", progress: "⌁", history: "◷",
};

function keyFor(dayId: string, exercise: string) {
  return `${dayId}:${exercise}`;
}

function makeInitialLogs(): Logs {
  const logs: Logs = {};
  DAYS.forEach((day) => day.exercises.forEach((exercise) => {
    logs[keyFor(day.id, exercise.name)] = Array.from({ length: exercise.sets ?? 1 }, () => ({
      weight: "", reps: "", done: false,
    }));
  }));
  return logs;
}

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      // Hydrate device-local data after the initial server render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setValue(JSON.parse(saved));
    } catch {}
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (loaded.current) localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export function WorkoutApp() {
  const today = (new Date().getDay() + 6) % 7;
  const defaultDay = today < 6 ? DAYS[today] : DAYS[0];
  const [tab, setTab] = useState<Tab>("home");
  const [selectedId, setSelectedId] = useState(defaultDay.id);
  const [logs, setLogs] = useStoredState<Logs>("strongweek-logs", makeInitialLogs());
  const [history, setHistory] = useStoredState<{ id: string; day: string; title: string; date: string; volume: number }[]>("strongweek-history", []);
  const [weights, setWeights] = useStoredState<{ date: string; value: number }[]>("strongweek-weight", [
    { date: "Jul 1", value: 188.4 }, { date: "Jul 8", value: 187.9 }, { date: "Jul 15", value: 187.2 },
  ]);
  const [photos, setPhotos] = useStoredState<string[]>("strongweek-photos", []);
  const [dark, setDark] = useStoredState("strongweek-dark", true);
  const [rest, setRest] = useState(0);
  const [cardio, setCardio] = useState(0);
  const [weightInput, setWeightInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const selected = DAYS.find((d) => d.id === selectedId) ?? DAYS[0];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    if (rest <= 0) return;
    const timer = window.setInterval(() => setRest((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [rest]);
  useEffect(() => {
    if (cardio <= 0) return;
    const timer = window.setInterval(() => setCardio((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cardio]);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  const allSets = selected.exercises.flatMap((e) => logs[keyFor(selected.id, e.name)] ?? []);
  const done = allSets.filter((s) => s.done).length;
  const completion = allSets.length ? Math.round((done / allSets.length) * 100) : 0;
  const weekly = Math.min(100, Math.round((new Set(history.map((h) => h.day))).size / 6 * 100));

  function updateSet(exercise: Exercise, index: number, patch: Partial<SetLog>) {
    const key = keyFor(selected.id, exercise.name);
    setLogs((current) => {
      const base = current[key] ?? Array.from({ length: exercise.sets ?? 1 }, () => ({ weight: "", reps: "", done: false }));
      const next = base.map((item, i) => i === index ? { ...item, ...patch } : item);
      return { ...current, [key]: next };
    });
  }

  function completeWorkout() {
    const volume = selected.exercises.reduce((sum, e) =>
      sum + (logs[keyFor(selected.id, e.name)] ?? []).reduce((s, item) =>
        s + (Number(item.weight) || 0) * (Number(item.reps) || 0), 0), 0);
    setHistory((items) => [{
      id: crypto.randomUUID(), day: selected.id, title: selected.title,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), volume,
    }, ...items].slice(0, 30));
    setTab("home");
  }

  function openWorkout(day: Day) {
    setSelectedId(day.id);
    setTab("workout");
  }

  const maxWeight = Math.max(...weights.map((w) => w.value), 1);
  const minWeight = Math.min(...weights.map((w) => w.value), maxWeight);
  const range = Math.max(maxWeight - minWeight, 1);

  return (
    <div className="app-shell">
      <aside className="rail">
        <div className="brand"><span className="brand-mark">S</span><span>STRONG<span>WEEK</span></span></div>
        <nav>{(["home", "workout", "progress", "history"] as Tab[]).map((item) =>
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            <span>{ICONS[item]}</span>{item}
          </button>)}</nav>
        <div className="rail-foot"><span className="avatar">CC</span><div><b>Christopher</b><small>Keep showing up.</small></div></div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">S</span><b>STRONG<span>WEEK</span></b></div>
          <div className="eyebrow">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
          <div className="top-actions">
            {rest > 0 && <button className="timer-pill" onClick={() => setRest(0)}>REST {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}</button>}
            <button className="icon-button" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? "☼" : "☾"}</button>
          </div>
        </header>

        {tab === "home" && <div className="page">
          <section className="hero">
            <div>
              <p className="kicker">YOUR NEXT SESSION</p>
              <h1>Build the habit.<br/><span>Earn the result.</span></h1>
              <p>Six intentional days. One stronger week.</p>
            </div>
            <div className="hero-stat"><small>WEEKLY PROGRESS</small><strong>{weekly}%</strong><div className="meter"><i style={{ width: `${weekly}%` }} /></div><span>{new Set(history.map((h) => h.day)).size} of 6 workouts complete</span></div>
          </section>

          <section className="today-card">
            <div className="today-main">
              <div className="date-tile"><b>{defaultDay.short}</b><strong>{new Date().getDate()}</strong></div>
              <div><span className="status-dot">TODAY</span><h2>{defaultDay.title}</h2><p>{defaultDay.exercises.length} movements {defaultDay.finisher ? "· Cardio finisher" : ""}</p></div>
            </div>
            <button className="primary" onClick={() => openWorkout(defaultDay)}>Start workout <span>→</span></button>
          </section>

          <div className="section-heading"><div><p className="kicker">THE PLAN</p><h2>Your week</h2></div><span>Consistency over intensity.</span></div>
          <div className="week-grid">
            {DAYS.map((day, i) => <button className={`day-card ${day.id === defaultDay.id ? "today" : ""}`} key={day.id} onClick={() => openWorkout(day)}>
              <div className="day-top"><span>0{i + 1}</span><i>→</i></div>
              <small>{day.day}</small><h3>{day.title}</h3>
              <div className="muscle-lines"><i/><i/><i/></div>
              <p>{day.exercises.length} {day.id === "wednesday" ? "recovery activities" : "movements"}</p>
            </button>)}
          </div>

          <div className="insight-grid">
            <article className="insight blue"><span className="mini-icon">↗</span><div><small>COACH&apos;S NOTE</small><h3>Small jumps. Big change.</h3><p>When you hit every target rep with clean form twice, add 5 lb next session.</p></div></article>
            <article className="insight"><span className="mini-icon">◷</span><div><small>RECOVERY</small><h3>Wednesday reset</h3><p>Walk, heat, stretch, and foam roll. Training adapts when recovery is intentional.</p></div></article>
            <article className="streak"><small>CURRENT STREAK</small><strong>{Math.max(history.length, 3)}<span>days</span></strong><div>{["M","T","W","T","F","S","S"].map((d,i)=><i key={i} className={i<Math.min(history.length,6)?"filled":""}>{d}</i>)}</div></article>
          </div>
        </div>}

        {tab === "workout" && <div className="page workout-page">
          <div className="workout-head">
            <div><p className="kicker">{selected.day.toUpperCase()} · SESSION</p><h1>{selected.title}</h1>{selected.note && <p>{selected.note}</p>}</div>
            <div className="completion-ring" style={{ "--p": `${completion * 3.6}deg` } as React.CSSProperties}><span>{completion}%</span></div>
          </div>
          <div className="day-tabs">{DAYS.map((d) => <button key={d.id} className={selected.id===d.id?"active":""} onClick={()=>setSelectedId(d.id)}>{d.short}</button>)}</div>
          <div className="exercise-list">
            {selected.exercises.map((exercise, exIndex) => {
              const exerciseLogs = logs[keyFor(selected.id, exercise.name)] ?? [];
              const previous = history.some((h) => h.day === selected.id);
              return <article className="exercise-card" key={exercise.name}>
                <div className="exercise-number">{String(exIndex + 1).padStart(2, "0")}</div>
                <div className="exercise-body">
                  <div className="exercise-title"><div><h3>{exercise.name}</h3><p>{exercise.sets ? `${exercise.sets} sets · ${exercise.target}` : "Recovery checklist"}</p></div>
                  {exercise.sets && <span className="suggestion">{previous ? "↑ Add 5 lb if form was clean" : "First session"}</span>}</div>
                  {exercise.sets ? <div className="set-table">
                    <div className="set-row labels"><span>SET</span><span>PREVIOUS</span><span>LB</span><span>REPS / SEC</span><span>DONE</span></div>
                    {exerciseLogs.map((item, i) => <div className="set-row" key={i}>
                      <b>{i + 1}</b><span className="previous">{previous ? "Last logged" : "—"}</span>
                      <input inputMode="decimal" aria-label={`${exercise.name} set ${i+1} weight`} value={item.weight} onChange={(e)=>updateSet(exercise,i,{weight:e.target.value})} placeholder="0"/>
                      <input inputMode="numeric" aria-label={`${exercise.name} set ${i+1} reps`} value={item.reps} onChange={(e)=>updateSet(exercise,i,{reps:e.target.value})} placeholder={exercise.target?.match(/\d+/)?.[0] ?? "0"}/>
                      <button className={item.done?"check done":"check"} aria-label="Mark set complete" onClick={()=>{updateSet(exercise,i,{done:!item.done}); if(!item.done)setRest(60)}}>{item.done?"✓":""}</button>
                    </div>)}
                  </div> : <button className={exerciseLogs[0]?.done?"recovery-check done":"recovery-check"} onClick={()=>updateSet(exercise,0,{done:!exerciseLogs[0]?.done})}><span>{exerciseLogs[0]?.done?"✓":"○"}</span>{exerciseLogs[0]?.done?"Completed":"Mark complete"}</button>}
                </div>
              </article>;
            })}
          </div>
          {selected.finisher && <section className="finisher">
            <div><p className="kicker">FINISH STRONG</p><h2>{selected.finisher}</h2></div>
            <div className="timer-block"><strong>{Math.floor(cardio/60)}:{String(cardio%60).padStart(2,"0")}</strong><button onClick={()=>setCardio(cardio ? 0 : (selected.id==="saturday"?20:10)*60)}>{cardio?"Stop":"Start timer"}</button></div>
          </section>}
          <button className="complete-button" onClick={completeWorkout}>Complete {selected.day}&apos;s workout <span>→</span></button>
        </div>}

        {tab === "progress" && <div className="page">
          <div className="page-title"><p className="kicker">THE LONG GAME</p><h1>Progress</h1><p>Proof that the work is working.</p></div>
          <div className="progress-grid">
            <article className="panel weight-panel"><div className="panel-head"><div><small>BODY WEIGHT</small><h2>{weights.at(-1)?.value ?? "—"} <em>lb</em></h2></div><span>{weights.length > 1 ? `${(weights.at(-1)!.value - weights[0].value).toFixed(1)} lb` : "Start"}</span></div>
              <div className="chart">{weights.map((w,i)=><div key={i} className="chart-point" style={{left:`${weights.length===1?50:i/(weights.length-1)*92+4}%`,bottom:`${18+(w.value-minWeight)/range*62}%`}}><i/><small>{w.date}</small></div>)}</div>
              <div className="add-row"><input inputMode="decimal" placeholder="Today's weight" value={weightInput} onChange={e=>setWeightInput(e.target.value)}/><button onClick={()=>{const n=Number(weightInput);if(n){setWeights(v=>[...v,{date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),value:n}].slice(-12));setWeightInput("")}}}>Log weight</button></div>
            </article>
            <article className="panel"><div className="panel-head"><div><small>PERSONAL RECORDS</small><h2>{history.length ? Math.max(...history.map(h=>h.volume)).toLocaleString() : "Ready"} <em>{history.length ? "lb volume" : ""}</em></h2></div><span className="pr-mark">PR</span></div><p className="panel-copy">Your strongest logged session is highlighted automatically as your training history grows.</p></article>
            <article className="panel photos"><div className="panel-head"><div><small>PROGRESS PHOTOS</small><h2>Your timeline</h2></div><button onClick={()=>fileRef.current?.click()}>+ Add photo</button></div>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={(e)=>{const file=e.target.files?.[0];if(file){const r=new FileReader();r.onload=()=>setPhotos(v=>[String(r.result),...v].slice(0,6));r.readAsDataURL(file)}}}/>
              {photos.length ? <div className="photo-grid">{photos.map((src,i)=>
                // Device-local data URLs are not compatible with the image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`Progress ${i+1}`}/>)}</div> : <button className="photo-empty" onClick={()=>fileRef.current?.click()}><span>＋</span><b>Add your first check-in</b><small>Front, side, or back</small></button>}
            </article>
          </div>
        </div>}

        {tab === "history" && <div className="page">
          <div className="page-title"><p className="kicker">SHOWING UP COUNTS</p><h1>History</h1><p>Your completed sessions, kept on this device.</p></div>
          <div className="history-list">{history.length ? history.map((h,i)=><article key={h.id}><span>{String(i+1).padStart(2,"0")}</span><div><small>{h.date}</small><h3>{h.title}</h3></div><strong>{h.volume ? `${h.volume.toLocaleString()} lb` : "Complete"}</strong></article>) : <div className="empty-state"><span>◷</span><h2>Your first session starts here.</h2><p>Complete a workout and it will appear in your history.</p><button className="primary" onClick={()=>setTab("workout")}>Open workout</button></div>}</div>
        </div>}
      </main>

      <nav className="bottom-nav">{(["home","workout","progress","history"] as Tab[]).map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}><span>{ICONS[item]}</span>{item}</button>)}</nav>
    </div>
  );
}
