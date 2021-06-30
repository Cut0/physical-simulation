import { reactive, computed } from '@vue/composition-api';

type BoxInfo = {
  c: number;
  k: number;
  m: number;
  side: number;
  startY: number;
  startVY: number;
};

type Box = {
  y: number; //位置
  yPrev: number;
  vy: number; //速度
  vyPrev: number;
};

type PositionList = number[];

const MAX_LENGTH = 50000;
const STEP = 0.1;

export default (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  ctx.translate(0, canvas.height / 2);
  ctx.scale(1, -1);

  const boxInfo = reactive<BoxInfo>({
    c: 0.1,
    k: 0.5,
    m: 0.5,
    side: 25,
    startY: 0,
    startVY: 10,
  });

  const boxState = reactive<Box>({
    y: 0,
    yPrev: 0,
    vy: 20,
    vyPrev: 20,
  });

  const state = reactive<{
    positions: PositionList;
    time: number;
    isMoving: boolean;
    animateOnce: boolean;
  }>({
    positions: [0],
    time: 0,
    isMoving: true,
    animateOnce: false,
  });

  const time = computed(() => state.time);
  const isMoving = computed(() => state.isMoving);
  const box = computed(() => boxState);

  const init = (): void => {
    boxState.y = boxInfo.startY;
    boxState.vy = boxInfo.startVY;
    boxState.yPrev = 0;
    boxState.vyPrev = 20;
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
    ctx.moveTo(boxInfo.side, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(boxInfo.side, -canvas.height / 2);
    ctx.lineTo(boxInfo.side, canvas.height);
    ctx.stroke();

    // 物体の描画
    ctx.strokeStyle = 'black';
    ctx.strokeRect(
      0,
      boxState.y - boxInfo.side / 2,
      boxInfo.side,
      boxInfo.side,
    );

    if (state.positions.length < MAX_LENGTH) state.positions.push(boxState.y);

    //軌跡の描画
    ctx.beginPath();
    ctx.moveTo(boxInfo.side, 0);
    state.positions.forEach((pos, i) => {
      ctx.lineTo(boxInfo.side + i, pos);
    });
    ctx.stroke();

    state.time += 1;

    if (state.isMoving || state.animateOnce) {
      if (state.animateOnce) state.animateOnce = false;
      boxState.y = boxState.yPrev + STEP * boxState.vyPrev;

      boxState.vy =
        boxState.vyPrev +
        (-(boxInfo.k / boxInfo.m) * boxState.yPrev -
          (boxInfo.c / boxInfo.m) * boxState.vyPrev) *
          STEP;

      boxState.yPrev = boxState.y;
      boxState.vyPrev = boxState.vy;
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

  const updateBoxInfo = (info: BoxInfo) => {
    boxInfo.c = info.c;
    boxInfo.m = info.m;
    boxInfo.side = info.side;
    boxInfo.startY = info.startY;
    boxInfo.startVY = info.startVY;
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
    updateBoxInfo,
  };
};
