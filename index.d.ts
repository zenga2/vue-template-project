import Vue from 'vue'

interface Service {
  [propName: string]: Function
}

declare module "vue/types/vue" {
  interface Vue {
    $ldService: Service
  }
}

interface Validators {
  [prop: string]: string | Array | Object
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    validators?: Validators
  }
}
