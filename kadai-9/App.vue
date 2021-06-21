<template>
  <v-app>
    <v-app-bar dark fixed color="#EF4455">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>教育システムデザイン第９回</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p>4619023：加藤零</p>
            <canvas ref="myCanvas" width="300" height="300"></canvas>
          </v-container>
        </v-card>
      </v-container>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p class="headline">ボール情報</p>
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
            <v-container>
              <v-btn
                dark
                rounded
                block
                color="#EF4455"
                @click="state.switchMoving"
                >{{ state.isMoving ? '停止' : '再開' }}</v-btn
              >
            </v-container>
          </v-container>
        </v-card>
      </v-container>
      <v-container>
        <v-card class="mx-auto" max-width="720">
          <v-container>
            <p class="headline">実装内容・工夫点</p>
            <p>
              今回の課題ではUIを整えるためにvuetifyを利用した．また，JS単体だと補完機能が乏しく安全性も低いためTypeScriptを利用してJSにトランスパイルしwebpackでbundleすることで課題に取り組んだ．また，vue2にcomposition-apiを入れることで開発効率を向上させた．vuetifyが最新のvue3に対応していないためvue2を利用している．webpackは最新の5系を取り入れている.
            </p>
          </v-container>
        </v-card>
      </v-container>
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
export default defineComponent({
  setup() {
    const state = reactive({
      time: 0.0,
      position: { x: '0.0', y: '0.0' },
      vector: { x: '0.0', y: '0.0' },
      switchMoving: () => {},
      isMoving: false,
    });
    const myCanvas = ref(null);

    onMounted(() => {
      const canvas = myCanvas.value! as HTMLCanvasElement;
      const animateComponent = AnimateComponent(canvas);
      animateComponent.drawCanvas();
      animateComponent.animate();
      watch(animateComponent.isMoving, (val) => (state.isMoving = val), {
        immediate: true,
      });
      watch(animateComponent.position.value, (val) => {
        state.position.x = val.x.toFixed(1);
        state.position.y = val.y.toFixed(1);
      });
      watch(animateComponent.vector.value, (val) => {
        state.vector.x = val.x.toFixed(1);
        state.vector.y = val.y.toFixed(1);
      });
      state.switchMoving = animateComponent.switchMoving;
      setInterval(() => {
        if (animateComponent.isMoving.value) state.time += 0.1;
      }, 100);
    });

    const headers = computed(() => [
      { text: 'パラメータ', value: 'title' },
      { text: 'x', value: 'x' },
      { text: 'y', value: 'y' },
    ]);

    const table = computed(() => [
      { title: '位置', x: state.position.x, y: state.position.y },
      { title: '速度', x: state.vector.x, y: state.vector.y },
    ]);

    return { state, myCanvas, headers, table };
  },
});
</script>
<style>
.v-main {
  padding-top: 64px !important;
}
</style>
<style scoped></style>
