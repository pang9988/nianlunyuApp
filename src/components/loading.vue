<template>
  <div class="loading" v-show="loading">
    <!-- <img src="images/loading.gif" /> -->
    <cube-loading :size="40">huihseof2</cube-loading>
  </div>
</template>
<script>
export default {
  name: "loading",
  data() {
    return {
      loading: false
    };
  },
  created() {
    var that = this;
    this.bus.$on("loading", function(data) {
      // console.log(data);
      that.loading = !!data;
    });
  }
};
</script>
<style scope>
.loading {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}
.loading p {
  padding: 0.15rem 0.15rem 0.2rem;
  color: #fff;
  font-size: 0.16rem;
}
.loading img {
  width: 0.4rem;
  height: 0.4rem;
}
</style>
