<script setup lang="ts">
import type { ModuleSandbox } from '../types';
import { onMounted, ref } from '#imports';

type Props = {
  sandbox: ModuleSandbox;
};

const props = defineProps<Props>();
const sandbox = props.sandbox;
const sandboxId = sandbox.getId();
const component = sandbox.getComponent();

const resizeObserver = new ResizeObserver(([container]) => {
  sandbox.setBoxSize({
    width: container.target.clientWidth,
    height: container.target.clientHeight
  });
});

const sandboxRef = ref<HTMLDivElement>();

onMounted(() => {
  if (sandboxRef.value) resizeObserver.observe(sandboxRef.value);
});
</script>

<template>
  <div
    :id="sandboxId"
    ref="sandboxRef"
    class="CP-sandbox"
  >
    <transition name="fade">
      <component
        :is="component.component"
        v-if="component"
        :id="`${sandboxId}:${component.id}`"
        class="CP-sandbox__component"
        v-bind="component.props ?? {}"
        v-on="component.emits ?? {}"
      />
    </transition>
  </div>
</template>

<style scoped>
.CP-sandbox {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
}

.CP-sandbox__component {
  z-index: 10;
  pointer-events: all;
}

.fade-enter-active, .fade-leave-active {
  transition: .3s;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.fade-leave-to, .fade-enter-from {
  opacity: 0;
}
</style>
