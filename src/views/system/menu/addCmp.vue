<template>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      :disabled="disabled"
      label-width="120px"
    >
      <el-form-item label="父级节点" prop="parentName">
        <el-input v-model="form.parentName" disabled />
      </el-form-item>
      <el-form-item label="菜单类型" prop="pageType">
        <el-radio-group v-model="form.pageType">
          <el-radio
            :label="item.value"
            v-for="item in menuTypeOptions"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标题(title)" prop="title">
        <el-input
          v-model="form.title"
          :maxlength="10"
          clearable
          placeholder="请输入名称"
        />
      </el-form-item>
       <el-form-item label="path" prop="path">
        <el-input
          v-model="form.path"
          :maxlength="50"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="component" prop="component">
        <el-input
          v-model="form.component"
          :maxlength="50"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="name" prop="name">
        <el-input
          v-model="form.name"
          :maxlength="20"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="menuSort" prop="menuSort">
        <el-input-number
          v-model="form.menuSort"
          :maxlength="50"
          clearable
          :min="1"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="hidden" prop="hidden">
        <el-radio-group v-model="form.hidden">
          <el-radio
            :label="item.value"
            v-for="item in options"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="cache" prop="cache">
        <el-radio-group v-model="form.cache">
          <el-radio
            :label="item.value"
            v-for="item in options"
            :key="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="icon" prop="icon">
        <el-input
          v-model="form.icon"
          :maxlength="50"
          clearable
          placeholder="请输入"
        />
      </el-form-item>
     
      
    </el-form>
  </template>
  <script>
  export default {
    props: {
      handlerRow: {
        type: Object,
        default: () => {},
      },
      handlerSign: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        disabled: false,
        options: [
          {
            label: '是',
            value: '1',
          },
          {
            label: '否',
            value: '0',
          },
        ],
        form: {
          pageType: 'page',
          hidden: '0',
          cache: '0',
        },
        menuTypeOptions: [
          {
            label: '菜单页面',
            value: 'page',
          },
          {
            label: '功能按钮',
            value: 'fun',
          },
        ],
        rules: {
          title: [
            {
              required: true,
              message: '标题不能为空',
              trigger: 'blur',
            },
          ],
          component: [
            {
              required: true,
              message: 'component不能为空',
              trigger: 'blur',
            },
          ],
          path: [
            {
              required: true,
              message: '路径不能为空',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    watch: {
      handlerRow: {
        handler(val) {
          if (val) {
            if (this.handlerSign === 'add') {
              this.form = {
                ...this.form,
                pid: val.parentId,
                parentName: val.parentName,
              }
            }else{
              this.form = {
                ...this.form,
                ...val
              }
            }
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      validateForm() {
        console.log(this.form, '数据')
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              const data = { ...this.form }
              let isAdd = this.handlerSign == 'add'
              let url = isAdd ? 'user/addMenu' : 'user/updateMenu'
              this.$api(url, data)
                .then((res) => {
                  resolve()
                })
                .catch(() => {
                  reject()
                })
            } else {
              resolve()
            }
          })
        })
      },
    },
  }
  </script>
  <style></style>
  