const productivityTips = [
  {
    id: 1,
    category: "hydration",
    tip: "Remember to drink water! Staying hydrated helps you focus better.",
    emoji: "💧",
  },
  {
    id: 2,
    category: "posture",
    tip: "Check your posture! Sit up straight to avoid back pain during long study sessions.",
    emoji: "🪑",
  },
  {
    id: 3,
    category: "break",
    tip: "Great job on that work session! Take a few deep breaths during your break.",
    emoji: "🧘",
  },
  {
    id: 4,
    category: "workspace",
    tip: "Keep your study space organized. A clean desk helps keep your mind focused!",
    emoji: "🗂️",
  },
  {
    id: 5,
    category: "motivation",
    tip: "You're doing great! Every pomodoro session brings you closer to your goals.",
    emoji: "🎯",
  },
  {
    id: 6,
    category: "eyes",
    tip: "Give your eyes a break! Look at something 20 feet away for 20 seconds.",
    emoji: "👀",
  },
  {
    id: 7,
    category: "stretch",
    tip: "Time to stretch! Roll your shoulders and stretch your arms to prevent stiffness.",
    emoji: "🤸",
  },
  {
    id: 8,
    category: "focus",
    tip: "Put your phone in another room to avoid distractions during work sessions.",
    emoji: "📱",
  },
];

class AICoach {
  constructor() {
    this.sessionCount = 0;
    this.lastTipTime = 0;
  }

  getTip(sessionType) {
    if (sessionType === "undefined") {
      sessionType = "work";
    }

    let availableTips = productivityTips;

    if (sessionType === "break") {
      availableTips = [];
      for (let i = 0; i < productivityTips.length; i++) {
        let tip = productivityTips[i];
        if (
          tip.category === "break" ||
          tip.category === "hydration" ||
          tip.category === "stretch" ||
          tip.category === "eyes" ||
          tip.category === "posture"
        ) {
          availableTips.push(tip);
        }
      }
    } else {
      availableTips = [];
      for (let i = 0; i < productivityTips.length; i++) {
        let tip = productivityTips[i];
        if (
          tip.category === "focus" ||
          tip.category === "workspace" ||
          tip.category === "motivation" ||
          tip.category === "posture"
        ) {
          availableTips.push(tip);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * availableTips.length);
    return availableTips[randomIndex];
  }

  getSessionCompleteTip(sessionType, sessionNumber) {
    this.sessionCount = sessionNumber;

    if (sessionType === "work") {
      if (sessionNumber % 4 === 0) {
        return {
          tip: "Awesome! You've completed 4 work sessions. Take a longer 15-minute break!",
          emoji: "🏆",
          category: "achievement",
        };
      } else {
        return this.getTip("break");
      }
    } else {
      return this.getTip("work");
    }
  }

  getStartMessage(sessionType) {
    const workMessages = [
      "Let's focus! You've got this! 💪",
      "Time to get productive! Remove distractions and dive in! 🎯",
      "25 minutes of focused work coming up! You can do anything for 25 minutes! ⏱️",
    ];

    const breakMessages = [
      "Break time! Step away from your work and relax! ☕",
      "Time to recharge! Your brain deserves this break! 🔋",
      "Short break = better focus later! Enjoy these 5 minutes! 😌",
    ];

    let messages;
    if (sessionType === "work") {
      messages = workMessages;
    } else {
      messages = breakMessages;
    }

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  getSessionStats(completedSessions) {
    const totalMinutes = completedSessions * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      completedSessions: completedSessions,
      totalTime: hours + "h " + minutes + "m",
      message:
        "You've completed " +
        completedSessions +
        " focus sessions! That's " +
        totalMinutes +
        " minutes of productive work! 🎉",
    };
  }
}
export default AICoach;
