export const launchConfetti = () => {
  if (typeof window !== "undefined") {
    import("canvas-confetti").then((module) => {
      const confetti = module.default;

      const duration = 2 * 1000; // 2 seconds
      const animationEnd = Date.now() + duration;
      const defaults = {
        origin: { y: 0.5 },
        spread: 120,
        startVelocity: 30,
        scalar: 1.2,
        ticks: 200,
        zIndex: 999,
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          ...defaults,
          particleCount: 50,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 100),
          origin: { x: Math.random(), y: Math.random() * 0.6 },
        });
      }, 200);
    });
  }
};
