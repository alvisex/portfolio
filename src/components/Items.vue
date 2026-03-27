<script setup>
const props = defineProps(['items'])
const items = props.items
</script>

<template>
  <ul class="list-disc list-inside">
    <li v-for="item in items" v-html="item"></li>
  </ul>
</template>
<style>
strong {
  color: var(--accent);
}
b {
  color: var(--primary);
}
li {
  padding: 0.4rem 0;
}
</style>
