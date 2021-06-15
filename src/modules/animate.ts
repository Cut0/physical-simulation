import { reactive, computed } from '@vue/composition-api';
const RADIUS = 20;
const G = 9.8;
const STEP = 0.1;
const RESIST = 0.7;

type Vector = { x: number; y: number };

export default (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  const state = reactive({
    time: 0,
    position: { x: 100, y: 200 },
    vector: { x: 40, y: -80 },
    isMoving: true,
    positionList: [],
  } as {
    time: number;
    position: Vector;
    vector: Vector;
    isMoving: boolean;
    positionList: Vector[];
  });

  const time = computed(() => state.time);
  const position = computed(() => state.position);
  const vector = computed(() => state.vector);
  const isMoving = computed(() => state.isMoving);

  const drawCanvas = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(state.position.x, state.position.y, RADIUS, 0, 2 * Math.PI);
    ctx.fill();
  };

  const animate = () => {
    drawCanvas();
    state.vector.y += G * STEP;

    if (state.position.x > canvas.width - RADIUS) {
      state.position.x = canvas.width - RADIUS;
      state.vector.x *= -RESIST;
    }
    if (0 > state.position.x - RADIUS) {
      state.position.x = RADIUS;
      state.vector.x *= -RESIST;
    }
    if (state.position.y > canvas.height - RADIUS) {
      state.position.y = canvas.height - RADIUS;
      state.vector.y *= -RESIST;
    }
    if (0 > state.position.y - RADIUS) {
      state.position.y = RADIUS;
      state.vector.y *= -RESIST;
    }

    if (state.positionList.length > 100) state.positionList.shift();
    state.positionList.push(state.position);

    state.position.x += state.vector.x * STEP;
    state.position.y += state.vector.y * STEP;
    state.time += STEP;

    if (state.time < 10000 && state.isMoving) requestAnimationFrame(animate);
  };

  const switchMoving = () => {
    state.isMoving = !state.isMoving;
    if (state.isMoving) animate();
  };

  return {
    time,
    position,
    vector,
    isMoving,
    switchMoving,
    drawCanvas,
    animate,
    stop,
  };
};
