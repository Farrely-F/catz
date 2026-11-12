export type LessonIcon = "click" | "target" | "chat" | "paw" | "star" | "heart";

export type Lesson = {
  id: string;
  unit: "foundations" | "tricks";
  title: string;
  icon: LessonIcon;
  blurb: string;
  /** Three things to have ready. */
  setup: [string, string, string];
  /** Coaching lines shown one per click. `{name}`, `{she}`, `{her}` are filled in. */
  tips: string[];
  /** What the win card says. */
  win: string;
  /** Skipped for senior cats. */
  highImpact?: boolean;
  /** Only shown to cats that are picky about food. */
  onlyPicky?: boolean;
};

const SETUP: Lesson["setup"] = ["10 tiny treats in a bowl", "Clicker in your hand", "Quiet room, door closed"];

export const UNITS = [
  { id: "foundations", title: "Foundations" },
  { id: "tricks", title: "First tricks" },
] as const;

export const LESSONS: Lesson[] = [
  {
    id: "find-treat",
    unit: "foundations",
    title: "Find the treat",
    icon: "heart",
    blurb: "Test a few treats and find the one {name} would work for.",
    setup: ["3 different treats", "A small plate", "A calm room"],
    tips: [
      "Offer one treat. Watch {her} face and whiskers.",
      "Try the next treat. Which one gets the faster sniff?",
      "Offer the last one. Note how {she} reacts.",
      "Offer the favorite again. This is today's reward.",
      "Great. Save the favorite for training only.",
    ],
    win: "Found the favorite treat",
    onlyPicky: true,
  },
  {
    id: "charge-clicker",
    unit: "foundations",
    title: "Charge the clicker",
    icon: "click",
    blurb: "Teach {name} that the click always means a treat is coming.",
    setup: SETUP,
    tips: [
      "Click, then treat right away. Nothing else needed.",
      "Click, treat. Stay relaxed and keep your hands still.",
      "Watch for {her} ears turning toward the click.",
      "Click, treat. {she} is starting to get it.",
      "Last one. The click now means good things.",
    ],
    win: "Charged the clicker",
  },
  {
    id: "target-touch",
    unit: "foundations",
    title: "Target touch",
    icon: "target",
    blurb: "Teach {name} that touching the target earns a click and a treat.",
    setup: ["10 tiny treats in a bowl", "Clicker and a target stick", "Quiet room, door closed"],
    tips: [
      "Hold the target 6 inches from the nose. Click the instant it touches.",
      "Click, then treat within two seconds.",
      "Keep it easy. End on a win.",
      "Almost there. Same move, same click.",
      "Last one. Great timing.",
    ],
    win: "First target touch",
  },
  {
    id: "name-response",
    unit: "foundations",
    title: "Name response",
    icon: "chat",
    blurb: "Say {name}'s name once. Click and treat when {she} looks at you.",
    setup: SETUP,
    tips: [
      "Say the name once in a happy voice. Click when {she} looks.",
      "Wait for the look. Don't repeat the name.",
      "Click, treat. Vary where you stand.",
      "Nice. {she} is turning faster now.",
      "Last one. That's a great response.",
    ],
    win: "Knows {her} name",
  },
  {
    id: "come-when-called",
    unit: "foundations",
    title: "Come when called",
    icon: "paw",
    blurb: "Call {name} from a few steps away and reward every arrival.",
    setup: SETUP,
    tips: [
      "Stand two steps away. Call once, click when {she} steps toward you.",
      "Click when {she} arrives, then treat by your feet.",
      "Add one more step of distance.",
      "Great. Keep calling in a cheerful voice.",
      "Last one. Reward with a big treat.",
    ],
    win: "Came when called",
  },
  {
    id: "sit",
    unit: "tricks",
    title: "Sit",
    icon: "star",
    blurb: "Lure a sit with a treat over {her} head, then click the sit.",
    setup: SETUP,
    tips: [
      "Hold a treat just above the nose and move it slowly back.",
      "Click the moment {her} bottom touches the floor.",
      "Fade the lure. Use an empty hand.",
      "Add the word 'sit' just before the move.",
      "Last one. {she} is sitting on cue.",
    ],
    win: "First sit",
  },
  {
    id: "high-five",
    unit: "tricks",
    title: "High five",
    icon: "star",
    blurb: "Click any lift of the paw toward your hand.",
    setup: SETUP,
    tips: [
      "Hold your flat hand at nose height. Click any paw lift.",
      "Click only when the paw touches your hand.",
      "Move your hand slightly higher.",
      "Add the words 'high five'.",
      "Last one. High five!",
    ],
    win: "High five",
  },
  {
    id: "spin",
    unit: "tricks",
    title: "Spin",
    icon: "star",
    blurb: "Lead {name} in a slow circle with a treat, then click the full turn.",
    setup: SETUP,
    tips: [
      "Lure a quarter turn. Click and treat.",
      "Lure half a turn. Click and treat.",
      "Lure a full turn. Click at the finish.",
      "Fade the lure to a pointing finger.",
      "Last one. Add the word 'spin'.",
    ],
    win: "First spin",
  },
  {
    id: "go-to-mat",
    unit: "tricks",
    title: "Go to mat",
    icon: "paw",
    blurb: "Teach {name} that the mat is the best place in the room.",
    setup: ["A small mat or towel", "Clicker", "10 tiny treats"],
    tips: [
      "Click any paw on the mat. Treat on the mat.",
      "Click all four paws on the mat.",
      "Treat on the mat so {she} stays there.",
      "Add the word 'mat'.",
      "Last one. The mat is a good place.",
    ],
    win: "Loves the mat",
  },
  {
    id: "hop-up",
    unit: "tricks",
    title: "Hop up",
    icon: "star",
    blurb: "Teach {name} to hop onto a low, stable stool.",
    setup: ["A low, stable stool", "Clicker", "10 tiny treats"],
    tips: [
      "Click any look at the stool.",
      "Click paws on the stool.",
      "Click all four paws up.",
      "Treat while {she} is on top.",
      "Last one. Keep the height low.",
    ],
    win: "Hopped up",
    highImpact: true,
  },
];

export const lessonById = (id: string): Lesson | undefined => LESSONS.find((l) => l.id === id);
