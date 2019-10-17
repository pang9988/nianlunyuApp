<template>
  <div class="pdt15 pdb15">
    <cube-button @click="showAddressPicker">Address Picker</cube-button>
  </div>
</template>
<script>
import { provinceList, cityList, areaList } from "../data/area";
const addressData = provinceList;
addressData.forEach(province => {
  province.children = cityList[province.value];
  province.children.forEach(city => {
    city.children = areaList[city.value];
  });
});

export default {
  mounted() {
    this.addressPicker = this.$createCascadePicker({
      title: "City Picker",
      data: addressData,
      onSelect: this.selectHandle,
      onCancel: this.cancelHandle
    });
  },
  methods: {
    showAddressPicker() {
      this.addressPicker.show();
    },
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.$createDialog({
        type: "warn",
        content: `Selected Item: <br/> - value: ${selectedVal.join(
          ", "
        )} <br/> - index: ${selectedIndex.join(
          ", "
        )} <br/> - text: ${selectedText.join(" ")}`,
        icon: "cubeic-alert"
      }).show();
    },
    cancelHandle() {
      this.$createToast({
        type: "correct",
        txt: "Picker canceled",
        time: 1000
      }).show();
    }
  }
};
</script>