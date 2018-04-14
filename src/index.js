"use strict";
import Vue from 'vue';
import taxpayerformstore from "./taxpayerformstore.js";
import taxpayerform from "./taxpayerform";
import parentform from "./parentform";

function loadpage() {
  new Vue({
    el: '#taxpayerform',
    components: {taxpayerform},
    store: taxpayerformstore.store,
  });

  new Vue({
    el: '#parentform',
    components: {parentform},
    store: taxpayerformstore.store,
  });
}

window.onload = loadpage;
