<template>
    <div>
      <t-switch
        v-model="row[statusKey]"
        v-bind="$attrs"
        :beforeChange="beforeChange"
        activeValue="1"
        inactiveValue="0"
      ></t-switch>
    </div>
  </template>
  <script>
  import {getObjData,deepClone} from '@/utils/tools'
  export default {
    name: 'SwitchBtn',
    props: {
      statusKey: {},
      url: {},
      loading: {},
      row: {},
      keys: {
        default: () => {
          return []
        },
      },
      //自定义参数,key为取得值，value为传输的key
      customParam:{
  
      }
    },
    data() {
      return {}
    },
    methods: {
      beforeChange(e) {
        const msg = e == '0' ? '禁用' : '启用'
        return this.$confirm(`是否将该项${msg}?`, `提示`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const arr = this.keys || []
          let handlerRow=deepClone(this.row)
          let config = getObjData(handlerRow, arr)||{}
          this.$emit('update:loading', true)
          handlerRow[this.statusKey]=e
          const data={
            ...config,
            [this.statusKey]:e,
            id: handlerRow.id,
          }
          if(this.customParam){
            Object.keys(this.customParam).forEach(key=>{
              data[this.customParam[key]]=handlerRow[key]
            })
          }
          return this.$api(this.url, data)
            .then((res) => {
              this.$message.success('操作成功')
              this.$emit('getList')
            })
            .finally(() => {
              this.$emit('update:loading', false)
            })
        })
      },
    },
  }
  </script>
  <style scoped lang="scss"></style>
  