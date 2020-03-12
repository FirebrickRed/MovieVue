<template>
  <div>
    <h1>{{ review.userName }}</h1>
    <h3>{{ review.rating }}</h3>
    <h3>{{ review.review }}</h3>
    <!-- <h3>{{ review.createdOn }}</h3> -->
  </div>
</template>

<script>
// add liked feature
export default {
  name: "review",
  props: {
    review: Object
  }
};
</script>

<style lang="scss" scoped></style>
