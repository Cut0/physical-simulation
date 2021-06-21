import { reactive, computed } from '@vue/composition-api';

type Box = {
  k: number; //ばね定数
  side: number; //一辺の長さ
  m: number; //重さ
  y: number; //位置
  vy: number; //速度
};

type PositionList = number[];

const MAX_LENGTH = 50000;
const step = 0.1;

export default (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  ctx.translate(0, canvas.height / 2);
  ctx.scale(1, -1);

  const state = reactive<{
    box: Box;
    positions: PositionList;
    time: number;
    isMoving: boolean;
  }>({
    box: {
      k: 0.5,
      side: 25,
      m: 2,
      y: 0,
      vy: 20,
    },
    positions: [0],
    time: 0,
    isMoving: true,
  });

  const time = computed(() => state.time);
  const isMoving = computed(() => state.isMoving);
  const box = computed(() => state.box);

  const drawCanvas = (): void => {
    ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);

    // 枠線の描画
    ctx.strokeRect(0, -canvas.height / 2, canvas.width, canvas.height);

    // 軸の描画
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(state.box.side, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(state.box.side, -canvas.height / 2);
    ctx.lineTo(state.box.side, canvas.height);
    ctx.stroke();

    // 物体の描画
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      0,
      state.box.y - state.box.side / 2,
      state.box.side,
      state.box.side,
    );
  };

  const animate = () => {
    drawCanvas();
    state.box.y += state.box.vy * step;
    state.box.vy += -(state.box.k / state.box.m) * state.box.y * step;
    state.time += step;
    if (state.positions.length < MAX_LENGTH) state.positions.push(state.box.y);

    //軌跡の描画
    ctx.beginPath();
    ctx.moveTo(state.box.side, 0);
    state.positions.forEach((pos, i) => {
      ctx.lineTo(state.box.side + i, pos);
    });
    ctx.stroke();

    if (state.time < 10000 && state.isMoving) requestAnimationFrame(animate);
  };

  const switchMoving = () => {
    state.isMoving = !state.isMoving;
    if (state.isMoving) animate();
  };

  return {
    time,
    isMoving,
    box,
    switchMoving,
    drawCanvas,
    animate,
    stop,
  };
};
