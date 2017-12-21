interface Service {
  [propName: string]: Function
}

declare module "vue/types/vue" {
  interface Vue {
    $ldService: Service
  }
}
