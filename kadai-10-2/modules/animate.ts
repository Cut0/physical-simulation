import { reactive, computed } from '@vue/composition-api';

type Box = {
  y: number; //位置
  yPrev: number;
  vy: number; //速度
  vyPrev: number;
};

type PositionList = number[];

const MAX_LENGTH = 50000;
const STEP = 0.1;
const C = 0.3;
const K = 0.5;
const M = 2;
const SIDE = 25;

export default (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  ctx.translate(0, canvas.height / 2);
  ctx.scale(1, -1);

  const state = reactive<{
    box: Box;
    positions: PositionList;
    time: number;
    isMoving: boolean;
    animateOnce: boolean;
  }>({
    box: {
      y: 0,
      yPrev: 0,
      vy: 20,
      vyPrev: 20,
    },
    positions: [0],
    time: 0,
    isMoving: true,
    animateOnce: false,
  });

  const time = computed(() => state.time);
  const isMoving = computed(() => state.isMoving);
  const box = computed(() => state.box);

  const init = (): void => {
    state.box = {
      y: 0,
      yPrev: 0,
      vy: 20,
      vyPrev: 20,
    };
    state.positions = [0];
    state.time = 0;
    state.isMoving = true;
    state.animateOnce = false;
  };

  const animate = () => {
    ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);

    // 枠線の描画
    ctx.strokeRect(0, -canvas.height / 2, canvas.width, canvas.height);

    // 軸の描画
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(SIDE, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(SIDE, -canvas.height / 2);
    ctx.lineTo(SIDE, canvas.height);
    ctx.stroke();

    // 物体の描画
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, state.box.y - SIDE / 2, SIDE, SIDE);

    if (state.positions.length < MAX_LENGTH) state.positions.push(state.box.y);

    //軌跡の描画
    ctx.beginPath();
    ctx.moveTo(SIDE, 0);
    state.positions.forEach((pos, i) => {
      ctx.lineTo(SIDE + i, pos);
    });
    ctx.stroke();

    state.time += 1;

    if (state.isMoving || state.animateOnce) {
      if (state.animateOnce) state.animateOnce = false;
      state.box.y = state.box.yPrev + STEP * state.box.vyPrev;

      state.box.vy =
        state.box.vyPrev +
        (-(K / M) * state.box.yPrev - (C / M) * state.box.vyPrev) * STEP;

      state.box.yPrev = state.box.y;
      state.box.vyPrev = state.box.vy;
      requestAnimationFrame(animate);
    }
  };

  const stepOnce = () => {
    if (state.isMoving) return;
    state.animateOnce = true;
    animate();
  };

  const switchMoving = () => {
    state.isMoving = !state.isMoving;
    if (state.isMoving) animate();
  };

  const reset = () => {
    init();
  };

  return {
    time,
    isMoving,
    box,
    init,
    reset,
    switchMoving,
    stepOnce,
    animate,
    stop,
  };
};
