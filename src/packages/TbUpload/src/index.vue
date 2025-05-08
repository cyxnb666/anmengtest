<template>
    <div class="tb-upload-main">
  
      <!-- 预览图片 -->
      <div
        class="show-image-box el-upload-list el-upload-list--picture-card"
        v-if="showPreview"
      >
        <div
          class="el-upload-list__item no-img"
          v-show="!isUpload&&showFileList.length===0"
        >
          暂无图片
        </div>
        <div
          v-for="(item,i) in showFileList"
          :key="i"
          class=" el-upload-list__item"
        >
          <el-image
            v-if="isImg(item)"
            class="preview-box el-upload-list__item-thumbnail"
            :src="`${previewUrl}${item}`"
          />
          <div
            v-else
            class="el-upload-list__item-thumbnail tac"
          >
            {{ item.name||item }}
          </div>
          <span
            v-if="isPreview||isRemove"
            class="el-upload-list__item-actions"
          >
            <span
              v-if="isImg(item)&&isPreview"
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(item)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <span
              v-if="isRemove"
              class="el-upload-list__item-delete"
              @click="handleRemove(i)"
            >
              <i class="el-icon-delete" />
            </span>
            <slot name="control" />
          </span>
        </div>
      </div>
      <!-- 上传 -->
      <el-upload
        action="#"
        v-if="isUpload"
        :show-file-list="false"
        :http-request="selectFile"
        :before-upload="beforeUpload"
        v-bind="$attrs"
        :disabled="disabled||isUploadDisabled"
      >
        <el-button
          type="primary"
          size="small"
          :disabled="disabled||isUploadDisabled"
          :loading="loading"
        >{{ btnText }}</el-button>
        <div
          class="up-tip-text"
          v-show="tipText"
        >{{tipText}}</div>
      </el-upload>
      <div
        v-if="isNeedFileName"
        class="show-file-list"
      >
        <div
          class="file-list-item flex-v"
          v-for="(item,i) in fileNameList"
          :key="i"
        >
          <i
            class="el-icon-circle-close del-file-list"
            v-if="!disabled"
            @click="handleRemove(i)"
          ></i>
          <div class="file-list-item-content">
            {{item.fileName}}
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialogVisible"
        append-to-body
      >
        <img
          width="100%"
          :src="dialogImageUrl"
          alt=""
        >
      </el-dialog>
    </div>
  </template>
  <script>
  export default {
    name: "TbUpload",
    props: {
      isNeedFileName: {
        type: Boolean,
        default: false,
      },
      //默认的fileList数组对象中的值
      defaultProps: {
        type: Object,
        default: () => {
          return {
            url: "url",
            fileName: "fileName",
          };
        },
      },
      //是否需要预览
      showPreview: {
        type: Boolean,
        default: true,
      },
      //自定义上传
      selectCustomFile: {
        type: Function,
        default: null,
      },
      //是否需要上传
      isUpload: {
        type: Boolean,
        default: true,
      },
      //提示文字
      tipText: {
        type: String,
        default: "",
      },
      // 按钮文字
      btnText: {
        type: String,
        default: "上传图片",
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false,
      },
      // 文件大小(单位MB)
      maxSize: {
        type: Number,
        default: null,
      },
      // 文件后缀限制
      extLimit: {
        type: Array,
        default: null,
      },
      // 上传数量
      limitNum: {
        type: Number,
        default: null,
      },
      // 是否可以预览
      isPreview: {
        type: Boolean,
        default: true,
      },
      // 是否可以删除
      isRemove: {
        type: Boolean,
        default: true,
      },
      // 文件数组,使用sync修饰符
      fileList: {
        required: true,
        default: null,
      },
      // 是否只需要一个文件，值为字符串
      onlyOneFile: {
        type: Boolean,
        default: false,
      },
      // 图片预览前缀
      previewUrl: {
        type: String,
        default: "http://localhost:9528/",
      },
      //仅上传图片
      isOnlyImage: {
        type: Boolean,
        default: false,
      },
      beforeUploadFilter: {
        type: Function,
        default: null,
      },
    },
    data() {
      return {
        isUploadDisabled: false, // 是否继续上传
        loading: false,
        dialogImageUrl: "",
        dialogVisible: false,
        imgExt: ["png", "jpg", "jpeg", "bmp", "gif"], // 判断图片后缀
        showFileList: [],
        fileNameList: [],
      };
    },
    watch: {
      fileList: {
        handler(val) {
          // 判断是否能够继续上传
          if (this.onlyOneFile) {
            let fileListInit=this.fileList||''
            this.isUploadDisabled = fileListInit ? true : false;
            this.showFileList = fileListInit ? [fileListInit] : [];
          } else {
            if (this.limitNum)
              this.isUploadDisabled = val.length >= this.limitNum;
            this.setFileList();
          }
        },
        immediate: true,
        deep: true,
      },
    },
    methods: {
      //设置回显的值
      setFileList() {
        let { url, fileName } = this.defaultProps;
        if (this.isNeedFileName) {
          this.fileNameList = [...this.fileList];
          this.showFileList = this.fileList.map((it) => {
            it.url = it[url];
            it.fileName = it[fileName];
            return it;
          });
        } else {
          this.showFileList = [...this.fileList];
        }
      },
      emitFileList({ fileViewUrl, fileName }) {
        let config = [...this.fileList, fileViewUrl];
        console.log(fileViewUrl, fileName, "fileName");
        let { url, fileName: fileNameKey } = this.defaultProps;
        if (this.isNeedFileName) {
          config = [
            ...this.fileList,
            { [url]: fileViewUrl, [fileNameKey]: fileName },
          ];
        }
        this.$emit("update:fileList", config);
      },
      // 删除前限制
      async beforeUpload(file) {
        const ext = this.getExt(file.name);
        let hasExt = true;
        if (
          this.extLimit &&
          this.extLimit.length &&
          this.extLimit.indexOf(ext.toLowerCase()) === -1
        ) {
          hasExt = false;
          this.$message.error("上传文件格式不正确!");
        }
        const fileSize = file.size / 1024 / 1024;
        const isLtSize = this.maxSize ? fileSize <= this.maxSize : true;
        if (!isLtSize) {
          this.$message.error(`上传文件大小不能超过${this.maxSize}MB!`);
        }
        let sign = hasExt && isLtSize;
  
        if (!sign) {
          return Promise.reject();
        }
        if (this.beforeUploadFilter) {
          return await this.beforeUploadFilter(file);
        }
        return Promise.resolve();
      },
  
      // 上传图片
      selectFile(file) {
        this.loading = true;
        if (this.selectCustomFile) {
          this.selectCustomFile(file).finally(() => {
            this.loading = false;
          });
          return;
        }
        const formDataInstance = new FormData();
        formDataInstance.append("file", file.file);
        formDataInstance.append("imgType", "cpxq");
        this.$api('common/uploadImg',formDataInstance)
          .then((res) => {
            console.log(res, "上传图片");
            this.$message.success("上传成功");
            if (res.code === 200) {
              let { fileViewUrl, fileName } = res.data;
              if (this.onlyOneFile) {
                return this.$emit("update:fileList", fileViewUrl);
              }
              this.emitFileList({ fileViewUrl, fileName });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 删除图片
      handleRemove(i) {
        if (this.onlyOneFile) {
          return this.$emit("update:fileList", "");
        }
        this.fileList.splice(i, 1);
        this.$emit("update:fileList", [...this.fileList]);
      },
      // 预览文件
      handlePictureCardPreview(item) {
        this.dialogImageUrl = this.previewUrl + item;
        this.dialogVisible = true;
      },
      getExt(item) {
        const index = item.lastIndexOf(".");
        const ext = item.substr(index + 1);
        return ext;
      },
      // 是否为图片
      isImg(item) {
        if (this.isOnlyImage) return true;
        const ext = this.getExt(item);
        return this.imgExt.indexOf(ext.toLowerCase()) !== -1;
      },
    },
  };
  </script>
  <style scoped lang='scss'>
  .tac {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preview-box {
    margin-right: 10px;
  }
  .up-tip-text {
    font-size: 12px;
    margin-top: 5px;
    color: rgb(154, 139, 139);
  }
  .tb-upload-main {
    ::v-deep {
      .el-upload {
        text-align: left;
      }
    }
  }
  .no-img {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .show-file-list {
    margin-top: 10px;
    .file-list-item {
      margin: 5px 0;
      .del-file-list {
        font-size: 18px;
        margin-right: 15px;
        cursor: pointer;
      }
      .file-list-item-content {
        flex: 1;
        line-height: 14px;
      }
    }
  }
  </style>
  