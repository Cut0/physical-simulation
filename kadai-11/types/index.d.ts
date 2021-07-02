export type BoxInfo = {
  c: number;
  k: number;
  m: number;
  side: number;
  startY: number;
  startVY: number;
};

export type Box = {
  y: number; //位置
  yPrev: number;
  vy: number; //速度
  vyPrev: number;
};
