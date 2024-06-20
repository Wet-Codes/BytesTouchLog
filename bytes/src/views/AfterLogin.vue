<template>
  <page-header />
  <div>
    <h1>This is the view</h1>
  </div>
</template>

<script>
import PageHeader from '@/components/HeaderNav.vue';
export default {
  components: {
  PageHeader
  }

}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#bp {
  margin: 0;
  padding: 0;
  padding-top: 5%;
  padding-bottom: 100%;
  height: 100vh;
}
</style>
