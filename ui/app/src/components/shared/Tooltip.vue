<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    message: {
      type: String,
    },
  },

  data: function () {
    return {
      opened: false,
      containerLocation: { left: 0, bottom: 0 },
    };
  },
  methods: {
    close() {
      console.log("close tool tips");
      this.opened = false;
      document.body.removeEventListener("mousedown", this.close);
    },
    open() {
      const element = this.$refs.trigger;
      const bounds = element.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      const topPos = bounds.top + scrollY;
      const leftPos = bounds.left + bounds.width + scrollX;

      this.containerLocation.top = `${topPos}px`;
      this.containerLocation.left = `${leftPos}px`;

      this.opened = true;
      // add click handler to whole page to close tooltip
      document.body.addEventListener("mousedown", this.close);
    },
  },
});
</script>

<template>
  <span v-on:click="open()">
    <teleport to="#tooltip-target">
      <div class="tooltip-background" v-if="opened">
        <div class="tooltip-positioner" :style="containerLocation">
          <div class="tooltip-container">
            <div class="tooltip-inner">
              {{ message }}
              <slot name="message"></slot>
            </div>
          </div>
        </div>
      </div>
    </teleport>
    <span ref="trigger">
      <slot></slot>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.tooltip-background {
  position: absolute;
  z-index: 1000000000;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
.tooltip-positioner {
  position: absolute;
}
.tooltip-container {
  transform: translateY(-100%);
  background: #fff;
  border: 1px solid #ccc;
  padding: 1px;
  border-radius: 10px;
  line-height: 13px;
  font-size: 11px;
  z-index: 10000;
  box-shadow: 0px 3px 10px #00000033;
  width: 210px;
  border-bottom-left-radius: 0;
  .tooltip-inner {
    border-radius: 8px;
    border-bottom-left-radius: 0;
    border: 1px solid #dedede;
    border-bottom-left-radius: 0;
    padding: 1rem;
  }
}
</style>
