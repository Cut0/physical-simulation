<template>
  <v-app>
    <v-app-bar dark fixed color="#EF4455">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>教育システムデザイン第11回</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="state.reset">
        <v-icon>$restart</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p>箱シミュレータ</p>
            <div ref="canvasWrapper">
              <canvas ref="myCanvas" width="auto" height="300"></canvas>
            </div>
          </v-container>
        </v-card>
      </v-container>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p class="headline">箱情報</p>
            <v-container>
              <v-row>
                <v-col align="center">
                  <v-progress-circular
                    :rotate="-90"
                    :size="70"
                    :width="8"
                    :value="(state.time % 60) * (100 / 60)"
                    color="#EF4455"
                    >{{ state.time.toFixed(1) }}
                  </v-progress-circular>
                </v-col>
              </v-row>
            </v-container>
            <v-container>
              <v-data-table
                dense
                :headers="headers"
                :items="table"
                item-key="title"
                class="elevation-1"
              ></v-data-table>
            </v-container>
          </v-container>
        </v-card>
      </v-container>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p class="headline">箱設定</p>
            <v-container>
              <v-slider
                label="C"
                hint="C"
                max="5"
                min="0.1"
                step="0.1"
                thumb-label="always"
                :disabled="state.isMoving"
                v-model="boxInfo.c"
              ></v-slider>
            </v-container>
            <v-container>
              <v-slider
                label="K"
                hint="K"
                max="10"
                min="0.1"
                step="0.1"
                thumb-label="always"
                :disabled="state.isMoving"
                v-model="boxInfo.k"
              ></v-slider>
            </v-container>
            <v-container>
              <v-slider
                label="M"
                hint="M"
                max="10"
                min="1"
                step="0.1"
                thumb-label="always"
                :disabled="state.isMoving"
                v-model="boxInfo.m"
              ></v-slider>
            </v-container>
            <v-container>
              <v-slider
                label="SIDE"
                hint="SIDE"
                max="50"
                min="1"
                thumb-label="always"
                :disabled="state.isMoving"
                v-model="boxInfo.side"
              ></v-slider>
            </v-container>
          </v-container>
          <v-container>
            <v-btn
              dark
              rounded
              block
              color="#EF4455"
              @click="state.switchMoving"
              >{{ state.isMoving ? '停止' : '再開' }}</v-btn
            >
            <v-btn
              outlined
              rounded
              block
              color="#EF4455"
              class="mt-2"
              :disabled="state.isMoving"
              @click="state.stepOnce"
            >
              1フレーム進む
            </v-btn>
          </v-container>
        </v-card>
      </v-container>
      <about-card
        title="実装内容・工夫点"
        content="アニメーションを再生していない際にスライダーを変更させることで箱の情報を変更できる．CSSフレームワークとしてvuetifyを利用していることにより，提供されるコンポーネントを利用することでリッチなUIを簡単に表現することができた．Canvasを親要素のサイズと一致させた"
      ></about-card>
      <about-card
        title="実装内容・工夫点"
        content="バネの減衰運動に関して \( \frac{d^2y}{dt^2} =
              \frac{k}{m}y-\frac{c}{m}\frac{dy}{dt}\)を利用することで，運動を視覚化した"
      ></about-card>
      <about-card
        title="実装内容・工夫点"
        content="今回の課題ではUIを整えるためにvuetifyを利用した．また，JS単体だと補完機能が乏しく安全性も低いためTypeScriptを利用してJSにトランスパイルしwebpackでbundleすることで課題に取り組んだ．また，vue2にcomposition-apiを入れることで開発効率を向上させた．vuetifyが最新のvue3に対応していないためvue2を利用している．webpackは最新の5系を取り入れている.また，CDNを利用してMathJaxを取り込むことで数式をWeb上で表現できるようにした．"
      ></about-card>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import {
  ref,
  defineComponent,
  onMounted,
  reactive,
  watch,
  computed,
} from '@vue/composition-api';
import AnimateComponent from './modules/animate';
import AboutCard from './components/AboutCard.vue';
import { BoxInfo } from './types';

export default defineComponent({
  components: { AboutCard },
  setup() {
    const state = reactive({
      time: 0.0,
      position: { y: '0.0' },
      vector: { y: '0.0' },
      isMoving: false,
      switchMoving: () => {},
      reset: () => {},
      stepOnce: () => {},
    });

    const boxInfo = reactive<BoxInfo>({
      c: 0.1,
      k: 0.5,
      m: 0.5,
      side: 25,
      startY: 0,
      startVY: 10,
    });

    const canvasWrapper = ref<null | HTMLDivElement>(null);
    const myCanvas = ref<null | HTMLCanvasElement>(null);

    onMounted(() => {
      const canvas = myCanvas.value!;
      canvas.width = canvasWrapper.value!.clientWidth;
      const animateComponent = AnimateComponent(canvas);
      animateComponent.animate();

      watch(animateComponent.isMoving, (val) => (state.isMoving = val), {
        immediate: true,
      });
      watch(animateComponent.box.value, (val) => {
        state.position.y = val.y.toFixed(1);
        state.vector.y = val.vy.toFixed(1);
      });

      state.switchMoving = animateComponent.switchMoving;
      state.reset = animateComponent.reset;
      state.stepOnce = animateComponent.stepOnce;

      setInterval(() => {
        if (animateComponent.isMoving.value) state.time += 0.1;
      }, 100);

      watch(
        () => boxInfo,
        (val) => {
          animateComponent.updateBoxInfo(val);
        },
        { deep: true },
      );
    });

    const headers = computed(() => [
      { text: 'パラメータ', value: 'title' },
      { text: 'y', value: 'y' },
      { text: 'vy', value: 'vy' },
    ]);

    const table = computed(() => [
      { title: '位置', y: state.position.y },
      { title: '速度', vy: state.vector.y },
    ]);

    return { state, boxInfo, myCanvas, canvasWrapper, headers, table };
  },
});
</script>
<style>
.v-main {
  padding-top: 64px !important;
}
</style>
<style scoped></style>
