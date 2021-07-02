<template>
  <v-container>
    <v-card class="mx-auto" max-width="720">
      <v-container>
        <p class="headline">{{ title }}</p>
        <p>
          {{ content }}
        </p>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
});
</script>
