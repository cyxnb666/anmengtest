<template>
  <div class="rule-log-detail" v-loading="loading">
    <!-- 返回按钮 -->
    <div class="back-btn">
      <el-button icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
    </div>

    <!-- 基本信息 -->
    <div class="detail-info sticky-header">
      <div class="header-title">
        <h2>承保自核结果</h2>
        <div class="header-info">
          <div class="info-header-item">
            <span>提核人：{{ detail.username }}</span>
          </div>
          <div class="info-header-item">
            <span>核保结果：</span>
            <status-btn :title="getExecuteResultLabel(detail.ruleExecStatus)"
              v-bind="getExecuteResultStyle(detail.ruleExecStatus)" />
          </div>
          <div class="info-header-item">
            <span>提核时间：{{ formatDateTime(detail.createTime) }}</span>
          </div>
          <div class="info-header-item">
            <span>完成时间：{{ formatDateTime(detail.ruleExecEndTime) }}</span>
          </div>
          <div class="info-header-item">
            <span>只看不通过</span>
            <el-switch v-model="onlyShowFailed"></el-switch>
          </div>
        </div>
      </div>

      <div class="basic-info-title">
        <span>核保基本信息</span>
        <div class="divider-line"></div>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="label">投保单号：</span>
          <span class="value">{{ detail.busiNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">保单机构：</span>
          <span class="value">{{ detail.comName }}</span>
        </div>
        <div class="info-item">
          <span class="label">险类：</span>
          <span class="value">{{ detail.classesName }}</span>
        </div>
        <div class="info-item">
          <span class="label">险种：</span>
          <span class="value">{{ detail.riskName }}</span>
        </div>
      </div>
      <div class="info-row">
        <div class="info-item">
          <span class="label">核保结果：</span>
          <span class="value">
            <status-btn :title="getExecuteResultLabel(detail.ruleExecStatus)"
              v-bind="getExecuteResultStyle(detail.ruleExecStatus)" />
          </span>
        </div>
        <div class="info-item">
          <span class="label">提交人：</span>
          <span class="value">{{ detail.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">提交时间：</span>
          <span class="value">{{ formatDateTime(detail.createTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">完成时间：</span>
          <span class="value">{{ formatDateTime(detail.ruleExecEndTime) }}</span>
        </div>
      </div>
    </div>

    <div class="section-title">
      <span>投保信息的完整性、准确性</span>
      <div class="divider-line"></div>
    </div>
    <!-- 规则执行结果列表 -->
    <div class="rule-table">
      <tb-table ref="tbTable" :loading="loading" :table-title="tableTitle" :table-data="tableData" :hasHandler="false"
        :hasPagination="false" border empty-text="报告正在生成中">
        <!-- 规则列 -->
        <el-table-column slot="itemName" label="规则" align="left" min-width="300" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="rule-info">
              <div class="rule-name">{{ row.itemName || '-' }}</div>
              <div v-if="row.itemDescription" class="rule-description">{{ row.itemDescription }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 规则结果列 -->
        <el-table-column slot="ruleExecStatus" label="规则结果" align="center" width="100">
          <template slot-scope="{ row }">
            <status-btn :title="row.ruleExecStatus === 'true' ? '通过' : '不通过'"
              :color="row.ruleExecStatus === 'true' ? '#70B603' : '#F46565'"
              :bgColor="row.ruleExecStatus === 'true' ? '#F5FEE6' : '#F5CACA'" />
          </template>
        </el-table-column>

        <!-- 自核详情列 -->
        <el-table-column slot="remark" label="自核详情" align="left" min-width="300" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div :class="['reason-content', isClickableEvidenceType(row.evidenceType, row) ? 'link-text' : '']"
              @click="isClickableEvidenceType(row.evidenceType, row) && row.evidenceType !== 'SIMILARITY' ? showCheckDetailDialog(row) : null">
              <template v-if="row.evidenceType === 'PLOT'">查看详情</template>
              <template v-else-if="row.evidenceType === 'SIMILARITY' && row.remark && row.remark.includes('<link>')">
                <a href="javascript:void(0)" @click.stop="openSimilarityLink(row.remark)" class="similarity-link">
                  {{ getSimilarityRemarkText(row.remark) }}
                </a>
              </template>
              <template v-else>{{ row.remark || '-' }}</template>
            </div>
          </template>
        </el-table-column>
      </tb-table>
    </div>

    <div class="section-title">
      <span>验证照片完整性、真实性</span>
      <div class="divider-line"></div>
    </div>
    <div class="rule-table">
      <tb-table ref="photoTable" :loading="photoLoading" :table-title="photoTableTitle" :table-data="photoTableData"
        :hasHandler="false" :hasPagination="false" border empty-text="报告正在生成中">
        <el-table-column slot="itemName" label="规则" align="left" min-width="300" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div class="rule-info">
              <div class="rule-name">{{ row.itemName || '-' }}</div>
              <div v-if="row.itemDescription" class="rule-description">{{ row.itemDescription }}</div>
            </div>
          </template>
        </el-table-column>
        <!-- 规则结果列 -->
        <el-table-column slot="ruleExecStatus" label="规则结果" align="center" width="100">
          <template slot-scope="{ row }">
            <status-btn :title="row.ruleExecStatus === 'true' ? '通过' : '不通过'"
              :color="row.ruleExecStatus === 'true' ? '#70B603' : '#F46565'"
              :bgColor="row.ruleExecStatus === 'true' ? '#F5FEE6' : '#F5CACA'" />
          </template>
        </el-table-column>

        <!-- 自核详情列 -->
        <el-table-column slot="remark" label="自核详情" align="left" min-width="300" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div :class="['reason-content', isClickableEvidenceType(row.evidenceType, row) ? 'link-text' : '']"
              @click="isClickableEvidenceType(row.evidenceType, row) ? showCheckDetailDialog(row) : null">
              <!-- {{ row.remark || '-' }} -->
              <template v-if="row.evidenceType === 'PLOT'">查看详情</template>
              <template v-else>{{ row.remark || '-' }}</template>
            </div>
          </template>
        </el-table-column>
      </tb-table>
    </div>

    <!-- 详情弹窗 -->
    <t-dialog :title="getDialogTitle()" :visible.sync="detailDialogVisible" width="1000px" :footerSlot="true"
      append-to-body>
      <div class="detail-dialog-content">
        <!-- 多标签页 - 仅当有多个 evidenceType 时显示 -->
        <el-tabs v-model="activeTab" v-if="evidenceTypes.length > 1 && !isOcrOrMediaOnly">
          <el-tab-pane v-for="(type, index) in evidenceTypes" :key="index" :label="getTypeTabLabel(type)" :name="type">
            <!-- 表格筛选区域 - 仅当不是 JOIN_POLICY/MEDIA/OCR 时显示 -->
            <div class="filter-area" style="text-align: right; margin-bottom: 15px;"
              v-if="type !== 'JOIN_POLICY' && type !== 'MEDIA' && type !== 'OCR'">
              <el-switch v-model="onlyShowFailedDetail" active-text="只看失败" />
            </div>

            <!-- 表格数据 -->
            <tb-table :ref="`detailTable_${type}`" :loading="detailLoading" :table-title="getTableConfig(type).columns"
              :table-data="currentTabData" :pager-config="detailPageConfig" @loadPage="() => loadDetailPage(type)"
              :hasHandler="false" border>
              <!-- 动态列渲染 -->
              <template v-for="column in getTableConfig(type).columns">
                <el-table-column :key="column.prop || column.type" :prop="column.prop" :type="column.type"
                  :label="column.label" :align="column.align || 'center'" :width="column.width"
                  :min-width="column.minWidth">
                </el-table-column>
              </template>
            </tb-table>
          </el-tab-pane>
        </el-tabs>

        <!-- 单一类型的表格 - 非 MEDIA 或 OCR 且不是多标签页时显示 -->
        <div v-if="!isOcrOrMediaOnly && evidenceTypes.length <= 1">
          <!-- 表格筛选区域 - 仅当不是 JOIN_POLICY/MEDIA/OCR 时显示 -->
          <div class="filter-area" style="text-align: right; margin-bottom: 15px;"
            v-if="activeTab !== 'JOIN_POLICY' && activeTab !== 'MEDIA' && activeTab !== 'OCR'">
            <el-switch v-model="onlyShowFailedDetail" active-text="只看失败" />
          </div>

          <!-- 表格数据 -->
          <tb-table ref="singleDetailTable" :loading="detailLoading" :table-title="getTableConfig(activeTab).columns"
            :table-data="detailTableData" :pager-config="detailPageConfig" @loadPage="() => loadDetailPage(activeTab)"
            :hasHandler="false" border>
            <template slot="number" slot-scope="scope">
              <span :style="{ color: parseInt(scope.row.number) > 100 ? 'red' : '' }">
                {{ scope.row.number }}
              </span>
            </template>
          </tb-table>
        </div>

        <!-- OCR类型数据表格展示 -->
        <div v-if="evidenceTypes.includes('OCR')" class="ocr-table-container">
          <div class="section-title">
            <span>OCR识别结果</span>
            <div class="divider-line"></div>
          </div>

          <tb-table ref="ocrTable" :loading="ocrLoading" :table-title="ocrTableColumns" :table-data="ocrList"
            :pager-config="ocrPageConfig" @loadPage="loadOcrData" :hasHandler="false" border>
            <!-- 填入值 -->
            <el-table-column prop="proposalValue" label="填入值" min-width="150">
            </el-table-column>

            <!-- 真实值 -->
            <el-table-column prop="ocrValue" label="真实值" min-width="150">
              <template slot-scope="scope">
                {{ scope.row.ocrValue || '-' }}
              </template>
            </el-table-column>

            <!-- 比对结果 - 使用slot-scope渲染状态按钮 -->
            <el-table-column slot="ruleExecStatus" label="比对结果" width="100" align="center">
              <template slot-scope="scope">
                <status-btn :title="scope.row.ruleExecStatus === 'true' ? '通过' : '不通过'"
                  :color="scope.row.ruleExecStatus === 'true' ? '#70B603' : '#F46565'"
                  :bgColor="scope.row.ruleExecStatus === 'true' ? '#F5FEE6' : '#F5CACA'" />
              </template>
            </el-table-column>

            <!-- 照片 - 使用slot-scope渲染图片 -->
            <el-table-column slot="imageUrl" label="照片" width="150" align="center">
              <template slot-scope="scope">
                <el-image style="width: 80px; height: 80px" :src="scope.row.imageUrl"
                  :preview-src-list="[scope.row.imageUrl]" fit="cover">
                </el-image>
              </template>
            </el-table-column>
          </tb-table>
        </div>

        <!-- 图像展示区域 - 当包含 MEDIA 类型时显示 -->
        <div class="media-image-display" v-if="evidenceTypes.includes('MEDIA')">
          <div class="section-title">
            <span>图像展示</span>
            <div class="divider-line"></div>
          </div>

          <div v-loading="imageLoading" class="media-image-gallery">
            <div v-if="imageList.length > 0" class="media-image-grid">
              <div v-for="(image, index) in imageList" :key="index" class="media-image-item">
                <div class="media-image-wrapper">
                  <el-image :src="image.imageUrl" :preview-src-list="imageList.map(img => img.imageUrl)" fit="cover">
                  </el-image>
                  <div class="media-image-status">
                    <status-btn :title="image.ruleExecStatus === 'true' ? '通过' : '不通过'"
                      :color="image.ruleExecStatus === 'true' ? '#70B603' : '#F46565'"
                      :bgColor="image.ruleExecStatus === 'true' ? '#F5FEE6' : '#F5CACA'" />
                  </div>
                </div>
              </div>
            </div>
            <!-- <el-empty v-else description="暂无图像数据"></el-empty> -->

            <!-- 图片分页 -->
            <div class="media-pagination" v-if="imagePageConfig.total > 0">
              <el-pagination @size-change="handleImageSizeChange" @current-change="handleImageCurrentChange"
                :current-page.sync="imagePageConfig.currentPage" :page-size="imagePageConfig.pageSize"
                layout="total, prev, pager, next, jumper" :total="imagePageConfig.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import {
  selectClaimReportInsureEvidences,
  selectPlotReportInsureEvidences,
  selectNReportInsureEvidences,
  selectPReportInsureEvidences,
  selectJoinPolicies,
  selectReportMediaEvidences,
  selectReportOcrEvidences
} from '@/api/modules/ruleLog';

export default {
  name: 'RuleLogDetail',
  data() {
    return {
      detailDialogVisible: false,
      detailLoading: false,
      onlyShowFailedDetail: false,
      activeTab: '',
      evidenceTypes: [],
      detailTableData: [],
      currentTabData: [],
      isOcrOrMediaOnly: false,
      currentDetailRow: null,
      onlyShowFailed: false,
      loading: false,
      detail: {},
      tableData: [],

      // OCR相关
      ocrLoading: false,
      ocrList: [],
      ocrPageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      ocrTableColumns: [
        {
          prop: 'proposalValue',
          label: '填入值',
          minWidth: '150'
        },
        {
          prop: 'ocrValue',
          label: '真实值',
          minWidth: '150'
        },
        {
          slot: 'ruleExecStatus',
          label: '比对结果',
          width: '100',
          align: 'center'
        },
        {
          slot: 'imageUrl',
          label: '照片',
          width: '150',
          align: 'center'
        }
      ],

      // MEDIA相关
      imageLoading: false,
      imageList: [],
      imagePageConfig: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      map: {},
      // 表格配置
      tableTitle: [
        {
          type: 'index',
          width: '60',
          label: '序号'
        },
        {
          slot: 'itemName',
          label: '规则',
          minWidth: '300'
        },
        {
          slot: 'ruleExecStatus',
          label: '规则结果',
          width: '100'
        },
        {
          slot: 'remark',
          label: '自核详情',
          minWidth: '300'
        }
      ],
      photoLoading: false,
      detailPageConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      photoTableTitle: [
        {
          type: 'index',
          width: '60',
          label: '序号'
        },
        {
          slot: 'itemName',
          label: '规则',
          minWidth: '300'
        },
        {
          slot: 'ruleExecStatus',
          label: '规则结果',
          width: '100'
        },
        {
          slot: 'remark',
          label: '自核详情',
          minWidth: '300'
        }
      ],
      photoTableData: [],
      photoMap: {},
      // 不同evidenceType对应的表格列配置
      tableConfigs: {
        'CLAIMRATE': {
          title: '分户赔付率',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'insureName', label: '姓名' },
            { prop: 'cardNo', label: '证件号码' },
            { prop: 'claimRate', label: '赔付率(%)', width: '100' }
          ],
          api: selectClaimReportInsureEvidences
        },
        'PLOT': {
          title: '分户信息',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'insureName', label: '姓名' },
            { prop: 'cardNo', label: '证件号码' },
            { prop: 'remark', label: '勾画结果' },
            { prop: 'number', label: '投保面积(亩)', width: '120' }
          ],
          api: selectPlotReportInsureEvidences
        },
        'INSUREN': {
          title: '分户投保数量',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'insureName', label: '姓名' },
            { prop: 'cardNo', label: '证件号码' },
            { prop: 'number', label: '投保数量(头)', width: '100' },
          ],
          api: selectNReportInsureEvidences
        },
        'INSUREP': {
          title: '分户自缴保费',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'insureName', label: '姓名' },
            { prop: 'cardNo', label: '证件号码' },
            { prop: 'selfPremium', label: '自缴保费(元)', width: '120' }
          ],
          api: selectPReportInsureEvidences
        },
        'JOIN_POLICY': {
          title: '关联保单',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'proposalNo', label: '投保单号' },
            { prop: 'policyNo', label: '保单号' },
            { prop: 'startDate', label: '保险起期' },
            { prop: 'endDate', label: '保险止期' }
          ],
          api: selectJoinPolicies
        },
        'MEDIA': {
          title: '图像辅助',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'imageName', label: '图片名称' },
            { prop: 'imageUrl', label: '图片地址' },
            { prop: 'result', label: '识别结果' }
          ],
          api: selectReportMediaEvidences
        },
        'OCR': {
          title: 'OCR识别',
          columns: [
            { type: 'index', label: '序号' },
            { prop: 'fieldName', label: '字段名称' },
            { prop: 'fieldValue', label: '识别值' },
            { prop: 'originValue', label: '原始值' },
            { prop: 'result', label: '比对结果' }
          ],
          api: selectReportOcrEvidences
        }
      }
    }
  },
  created() {
    this.initPage()
  },
  watch: {
    onlyShowFailedDetail() {
      this.loadDetailPage(this.activeTab);
    },
    onlyShowFailed() {
      this.loadPage();
      this.loadPhotoPage();
    },
    activeTab(newTab) {
      this.loadDetailPage(newTab);
      if (newTab === 'OCR') {
        this.loadOcrData();
      } else if (newTab === 'MEDIA') {
        this.loadMediaData();
      } else {
        // 对于其他标签页，在加载后应用高亮
        this.$nextTick(() => {
          this.highlightCells(newTab);
        });
      }
    },
    currentTabData() {
      // 当表格数据变化时应用高亮
      this.highlightCells(this.activeTab);
    },
  },
  methods: {
    // 判断是否为可点击的证据类型
    isClickableEvidenceType(evidenceType, row) {
      if (!evidenceType) return false;

      const clickableTypes = ['MEDIA', 'OCR', 'INSUREP', 'PLOT', 'INSUREN', 'CLAIMRATE', 'JOIN_POLICY'];

      // 处理可能有多个类型的情况
      const types = evidenceType.split(',').map(type => type.trim());

      // 检查是否是MEDIA或OCR类型，并且mediaCount为0
      if ((types.includes('MEDIA') || types.includes('OCR')) && row && row.mediaCount === 0) {
        return false;
      }

      // 检查是否是JOIN_POLICY类型，并且policyCount为0
      if (types.includes('JOIN_POLICY') && row && row.policyCount === 0) {
        return false;
      }

      // 至少有一个类型是可点击的
      return types.some(type => clickableTypes.includes(type));
    },

    // 获取弹窗标题
    getDialogTitle() {
      if (!this.currentDetailRow || !this.currentDetailRow.evidenceType) {
        return '详情';
      }

      // 如果只有一个类型
      if (this.evidenceTypes.length === 1) {
        const config = this.tableConfigs[this.evidenceTypes[0]];
        return config ? `${config.title}详情` : '详情';
      }

      // 如果有多个类型
      return '详情信息';
    },

    // 获取标签页标签文字
    getTypeTabLabel(type) {
      const config = this.tableConfigs[type];
      return config ? config.title : type;
    },

    // 获取指定类型的表格配置
    getTableConfig(type) {
      return this.tableConfigs[type] || { columns: [] };
    },

    // 显示详情弹窗
    showCheckDetailDialog(row) {
      if (!this.isClickableEvidenceType(row.evidenceType)) {
        return;
      }

      this.currentDetailRow = row;

      // 解析可能的多个类型
      this.evidenceTypes = row.evidenceType.split(',').map(type => type.trim())
        .filter(type => this.tableConfigs[type]); // 只保留有配置的类型

      // 检查是否只有 OCR 或 MEDIA
      this.isOcrOrMediaOnly = this.evidenceTypes.length === 1 &&
        (this.evidenceTypes[0] === 'OCR' || this.evidenceTypes[0] === 'MEDIA');

      // 设置默认激活的标签
      this.activeTab = this.evidenceTypes[0] || '';

      // 重置数据
      this.detailTableData = [];
      this.currentTabData = [];
      this.detailPageConfig.currentPage = 1;
      this.ocrPageConfig.currentPage = 1;
      this.imagePageConfig.currentPage = 1;

      // 显示弹窗
      this.detailDialogVisible = true;

      // 加载第一个标签页的数据
      this.loadDetailPage(this.activeTab);

      // 如果包含OCR类型，加载OCR数据
      if (this.evidenceTypes.includes('OCR')) {
        this.loadOcrData();
      }

      // 如果包含MEDIA类型，加载MEDIA数据
      if (this.evidenceTypes.includes('MEDIA')) {
        this.loadMediaData();
      }
    },

    // 加载详情数据
    loadDetailPage(evidenceType) {
      if (!evidenceType || !this.currentDetailRow || evidenceType === 'OCR' || evidenceType === 'MEDIA') {
        return;
      }

      this.detailLoading = true;

      const config = this.tableConfigs[evidenceType];
      if (!config || !config.api) {
        this.detailLoading = false;
        return;
      }

      const { ruleExecId } = this.$route.query;
      const { reportId } = this.currentDetailRow;

      // 调用对应的API
      config.api({
        ruleExecId,
        reportId,
        ruleExecStatus: this.onlyShowFailedDetail ? 'false' : '',
        currentPage: this.detailPageConfig.currentPage,
        pageSize: this.detailPageConfig.pageSize
      }).then(res => {
        if (res.code === 200) {
          if (this.activeTab === evidenceType) {
            this.detailTableData = res.data.list || [];
            this.currentTabData = res.data.list || [];
            this.detailPageConfig.total = res.data.total || 0;

            // 加载数据后应用高亮
            this.highlightCells(evidenceType);
          }
        }
      }).catch(error => {
        console.error('获取详情数据失败', error);
        this.$message.error('获取详情数据失败');
      }).finally(() => {
        this.detailLoading = false;
      });
    },

    // 加载OCR数据
    loadOcrData() {
      if (!this.currentDetailRow || !this.evidenceTypes.includes('OCR')) {
        return;
      }

      this.ocrLoading = true;
      const { ruleExecId } = this.$route.query;
      const { reportId } = this.currentDetailRow;

      selectReportOcrEvidences({
        ruleExecId,
        reportId,
        currentPage: this.ocrPageConfig.currentPage,
        pageSize: this.ocrPageConfig.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.ocrList = res.data.list || [];
          this.ocrPageConfig.total = res.data.total || 0;
        }
      }).catch(error => {
        console.error('获取OCR数据失败', error);
        this.$message.error('获取OCR数据失败');
      }).finally(() => {
        this.ocrLoading = false;
      });
    },

    // 加载MEDIA数据
    loadMediaData() {
      if (!this.currentDetailRow || !this.evidenceTypes.includes('MEDIA')) {
        return;
      }

      this.imageLoading = true;
      const { ruleExecId } = this.$route.query;
      const { reportId } = this.currentDetailRow;

      selectReportMediaEvidences({
        ruleExecId,
        reportId,
        currentPage: this.imagePageConfig.currentPage,
        pageSize: this.imagePageConfig.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.imageList = res.data.list || [];
          this.imagePageConfig.total = res.data.total || 0;
        }
      }).catch(error => {
        console.error('获取图片数据失败', error);
        this.$message.error('获取图片数据失败');
      }).finally(() => {
        this.imageLoading = false;
      });
    },

    loadPhotoPage() {
      const { ruleExecId } = this.$route.query
      if (!ruleExecId) return

      this.photoLoading = true

      this.$api('ruleLog/selectTargetReports', {
        ruleExecId,
        ruleExecStatus: this.onlyShowFailed ? 'false' : ''
      })
        .then(res => {
          if (res.code === 200) {
            this.photoTableData = res.data || []
          }
        })
        .catch(error => {
          this.$message.error('获取照片验证结果失败')
          console.error(error)
        })
        .finally(() => {
          this.photoLoading = false
        })
    },

    // 初始化页面
    initPage() {
      const { ruleExecId } = this.$route.query
      if (ruleExecId) {
        this.loading = true

        this.$api('ruleLog/getAgriRuleExecDateVO', ruleExecId)
          .then(res => {
            if (res.code === 200 && res.data) {
              this.detail = res.data  // 保存详情数据
              // 获取详情成功后,再加载列表数据
              this.loadPage()
              this.loadPhotoPage()
            }
          })
          .catch(error => {
            this.$message.error('获取详情信息失败')
            console.error(error)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },

    loadPage() {
      const { ruleExecId } = this.$route.query
      if (!ruleExecId) return

      this.loading = true

      this.$api('ruleLog/selectProposalReports', {
        ruleExecId,
        ruleExecStatus: this.onlyShowFailed ? 'false' : ''
      })
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data || []
          }
        })
        .catch(error => {
          this.$message.error('获取投保信息验证结果失败')
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    highlightCells(evidenceType) {
      if (!evidenceType) return;

      this.$nextTick(() => {
        // 获取表格引用 - 可能是单个表格或多标签页中的表格
        let tableRef;
        if (this.evidenceTypes.length <= 1) {
          tableRef = this.$refs.singleDetailTable;
        } else {
          tableRef = this.$refs[`detailTable_${evidenceType}`];
        }

        if (!tableRef || !tableRef.$el) return;

        const table = tableRef.$el;
        const rows = table.querySelectorAll('.el-table__row');

        // 获取当前显示的数据
        const data = this.currentTabData;

        rows.forEach((row, rowIndex) => {
          // 获取当前行对应的数据
          if (rowIndex >= data.length) return;
          const rowData = data[rowIndex];

          // 检查ruleExecStatus
          if (rowData.ruleExecStatus === 'false') {
            // 如果状态为false，根据表格类型找到需要高亮的单元格
            const cells = row.querySelectorAll('.cell');

            switch (evidenceType) {
              case 'INSUREN':
                // 投保数量: 第4列(索引3)
                if (cells.length >= 4) {
                  cells[3].style.color = 'red';
                }
                break;

              case 'CLAIMRATE':
                // 赔付率: 第4列(索引3)
                if (cells.length >= 4) {
                  cells[3].style.color = 'red';
                }
                break;

              case 'PLOT':
                // 投保面积: 第5列(索引4)
                if (cells.length >= 5) {
                  cells[4].style.color = 'red';
                }
                break;

              case 'INSUREP':
                // 自缴保费: 第4列(索引3)
                if (cells.length >= 4) {
                  cells[3].style.color = 'red';
                }
                break;
            }
          }
        });
      });
    },

    // 从包含<link>标签的remark中提取出文本部分
    getSimilarityRemarkText(remark) {
      if (!remark) return '';
      return remark.split('<link>')[0].trim();
    },

    // 从包含<link>标签的remark中提取出链接并在新窗口中打开
    openSimilarityLink(remark) {
      if (!remark || !remark.includes('<link>')) return;

      const linkMatch = remark.match(/<link>(.*?)<\/link>/);
      if (linkMatch && linkMatch[1]) {
        const url = linkMatch[1];
        window.open(url, '_blank');
      }
    },
    // 日期格式转换
    formatDateTime(dateStr) {
      if (!dateStr) return '';
      return dateStr.replace('T', ' ')
    },

    // 获取核保结果标签
    getExecuteResultLabel(ruleExecStatus) {
      const map = {
        'true': '通过',
        'false': '不通过',
        'running': '执行中'
      }
      return map[ruleExecStatus] || ruleExecStatus
    },

    // 获取核保结果样式
    getExecuteResultStyle(ruleExecStatus) {
      const map = {
        'true': {
          color: "#70B603",
          bgColor: "#F5FEE6"
        },
        'false': {
          color: "#F46565",
          bgColor: "#F5CACA"
        }
      }
      return map[ruleExecStatus] || {}
    },

    // 图片预览
    previewImage(url) {
      this.previewImageUrl = url;
      this.previewVisible = true;
    },

    // 图片分页处理
    handleImageSizeChange(val) {
      this.imagePageConfig.pageSize = val;
      this.loadMediaData();
    },

    handleImageCurrentChange(val) {
      this.imagePageConfig.currentPage = val;
      this.loadMediaData();
    },

    // 返回
    goBack() {
      window.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-log-detail {
  padding: 20px;
  background: #fff;
  min-height: 100vh;

  .sticky-header {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 100;
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  .section-title:first-of-type {
    margin-top: 20px;
  }

  .back-btn {
    margin-bottom: 20px;
  }

  .filter-area {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .detail-info {
    margin-bottom: 20px;

    .header-title {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        font-size: 24px;
        margin-bottom: 20px;
      }

      .header-info {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;

        .info-header-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }

    .basic-info-title {
      margin: 30px 0 20px;

      span {
        color: #409EFF;
        font-size: 16px;
        font-weight: 500;
      }

      .divider-line {
        margin-top: 8px;
        height: 1px;
        background-color: #DCDFE6;
      }
    }

    .info-row {
      display: flex;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-item {
        flex: 1;
        display: flex;
        align-items: center;
        min-width: 0;

        .label {
          color: #606266;
          min-width: 90px;
          width: 90px;
          text-align: right;
          margin-right: 10px;
          white-space: nowrap;
        }

        .value {
          color: #303133;
        }
      }
    }
  }

  .section-title {
    margin: 30px 0 20px;

    span {
      color: #409EFF;
      font-size: 16px;
      font-weight: 500;
    }

    .divider-line {
      margin-top: 8px;
      height: 1px;
      background-color: #DCDFE6;
    }
  }

  .rule-table {
    margin-bottom: 30px;

    .reason-content {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  .link-text {
    color: #409EFF;
    cursor: pointer;

    &:hover {
      color: #66b1ff;
    }
  }

  .ocr-table-container {
    margin-bottom: 20px;
  }
}

.media-image-display {
  margin-top: 20px;
}

.media-image-gallery {
  margin-top: 15px;
}

.media-image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.media-image-item {
  width: calc(20% - 15px);
  margin-bottom: 15px;
}

.media-image-wrapper {
  position: relative;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
  height: 200px;

  ::v-deep .el-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-image__inner {
      max-width: 100%;
      max-height: 100%;
      transition: transform 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .media-image-status {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
  }
}

.media-pagination {
  margin-top: 20px;
  text-align: center;
}

@media screen and (max-width: 1200px) {
  .media-image-item {
    width: calc(33.33% - 15px);
  }
}

@media screen and (max-width: 768px) {
  .media-image-item {
    width: calc(50% - 15px);
  }
}

@media screen and (max-width: 480px) {
  .media-image-item {
    width: 100%;
  }
}

.rule-info {
  .rule-name {
    font-size: 14px;
    font-weight: normal;
    color: #303133;
  }

  .rule-description {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    line-height: 1.4;
  }
}

.similarity-link {
  color: #409EFF;
  margin-left: 5px;
  text-decoration: underline;
  cursor: pointer;
}

.similarity-link:hover {
  color: #66b1ff;
}
</style>