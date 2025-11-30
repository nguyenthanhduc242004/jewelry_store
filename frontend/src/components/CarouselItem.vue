<script setup>
const props = defineProps([
  "leftImageUrl",
  "heading",
  "subheading",
  "rightImageUrl",
  "message",
  "btnText",
]);
</script>

<template>
  <div style="display: flex; height: 100%">
    <div style="width: 50%; position: relative">
      <img
        style="width: 100%; height: 100%; object-fit: cover"
        :src="props.leftImageUrl"
      />
      <div
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <h2 class="carousel-heading">{{ props.heading }}</h2>
        <h4 class="carousel-subheading">{{ props.subheading }}</h4>
      </div>
    </div>
    <div
      style="width: 50%; background-image: linear-gradient(0, #d1913c, #ffd194)"
    >
      <div class="carousel-right">
        <div
          style="
            position: relative;
            width: 100%;
            height: 60%;
            margin-bottom: 15px;
          "
        >
          <div class="carousel-image-border" />
          <img class="carousel-image" :src="props.rightImageUrl" />
        </div>
        <p class="carousel-paragraph">{{ props.message }}</p>
        <button class="carousel-btn">{{ props.btnText }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-right {
  width: 40%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.carousel-heading {
  font-family: "Josefin Sans";
  font-size: 80px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0px;
  line-height: 70px;
  text-align: center;
  white-space: normal;
  padding: 0px 35px;
  display: block;
}

.carousel-subheading {
  font-family: "Josefin Sans";
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 3.48958px;
  line-height: 35px;
  text-align: center;
  white-space: normal;
  display: block;
}

.carousel-image-border {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% - 8px), calc(-50% - 8px));

  border-style: solid;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.65);
  border-radius: 300px 300px 0px 0px;
  width: 100%;
  height: 100%;
  display: block;
}

.carousel-image {
  border-radius: 300px 300px 0px 0px;
  transform-origin: 50% 50%;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.carousel-paragraph {
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  color: rgb(255, 255, 255);
  text-transform: none;
  text-decoration: none;
  letter-spacing: 0.744444px;
  line-height: 19px;
  text-align: center;
  white-space: normal;
  display: block;

  margin-bottom: 40px;
}

.carousel-btn {
  font-family: "Josefin Sans";
  font-size: 12px;
  font-weight: 500;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
  text-decoration: none;
  letter-spacing: 0.744444px;
  line-height: 45px;
  text-align: center;
  white-space: normal;
  padding: 12px 28px;
  border-style: solid;
  border-width: 1px 1px 0px;
  border-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: block;
  transform: translate3d(0px, 0px, 0px);
  background: rgba(255, 255, 255, 0);
  transition: border-color 0.3s;

  &:hover {
    cursor: pointer;
    border-color: rgba(255, 255, 255, 1);
  }
}
</style>
