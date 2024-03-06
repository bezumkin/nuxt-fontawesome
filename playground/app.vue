<template>
  <div id="app">
    <main class="w-100 min-vh-100 bg-gray8 white sans-serif pa6 flex flex-column justify-center items-center">
      <div class="mw8 center overflow-hidden">
        <h2 class="tc ttu tracked3 b f2 mt0 mb2 teal0 o-30">nuxt3-fontawesome</h2>

        <ul class="list ma0 pa0 flex flex-row flex-wrap teal4">
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome icon="face-smile" size="4x" />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome :icon="['far', 'face-smile']" size="4x" />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome :icon="['far', 'comment']" flip="horizontal" size="4x" />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome icon="child" transform="shrink-4 down-2 right-2" :mask="['fas', 'circle']" size="4x" />
          </li>

          <li class="pv3 ph2 ma0 link grow">
            <font-awesome icon="pen-clip" transform="shrink-10 up-.5" mask="comment" size="4x" symbol />
            <svg style="width: 4em; height: 4em"><use xlink:href="#fas-fa-pen-clip"></use></svg>
          </li>

          <li class="pv3 ph2 ma0 link grow">
            <font-awesome :icon="['fab', 'twitter']" size="4x" />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome :icon="queen" size="4x" title="Test" />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome :icon="queen" size="4x" inverse />
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome-layers fixed-width class="fa-4x">
              <font-awesome :icon="['fas', 'archive']" />
              <font-awesome-layers-text class="red8" transform="down-3 shrink-14" value="SECRET" />
            </font-awesome-layers>
          </li>
          <li class="pv3 ph2 ma0 link grow">
            <font-awesome-layers fixed-width class="fa-4x">
              <font-awesome :icon="['fas', 'envelope']" />
              <font-awesome-layers-text class="red8" value="1" position="top-right" counter />
            </font-awesome-layers>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {faChessQueen} from '@fortawesome/free-solid-svg-icons'

const queen = computed(() => faChessQueen)
</script>
