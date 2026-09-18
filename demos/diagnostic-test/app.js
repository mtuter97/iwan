/**
 * Diagnostic Test & Learning Loss Analysis Platform
 * Al-Falah Intermediate School - Makkah (1448H)
 * Complete Interactive Analytics, Evidence Viewer, Student Remedial Cards & Executive Report Engine
 */

(function () {
  'use strict';

  // Application State
  let currentClassId = 'class_2_3';
  let activeStudent = null;
  let evidenceCurrentPage = 1; // 1, 2, or 'both'
  let evidenceZoomLevel = 1.0;
  let filteredByQuestion = null;

  // Chart Instances
  let masteryChartInstance = null;
  let skillsRadarChartInstance = null;
  let questionsErrorChartInstance = null;
  let comparisonSkillsChartInstance = null;
  let scoreDistChartInstance = null;

  // DOM Elements - Main Layout
  const statsGrid = document.getElementById('statsGrid');
  const matrixTableBody = document.getElementById('matrixTableBody');
  const matrixSection = document.getElementById('matrixSection');
  const chartsDashboard = document.getElementById('chartsDashboard');
  const remedialHubSection = document.getElementById('remedialHubSection');
  const finalReportSection = document.getElementById('finalReportSection');
  const searchFilterBar = document.getElementById('searchFilterBar');
  const currentClassTitle = document.getElementById('currentClassTitle');
  const matrixPillSummary = document.getElementById('matrixPillSummary');
  const searchInput = document.getElementById('searchInput');
  const levelFilter = document.getElementById('levelFilter');
  const sortFilter = document.getElementById('sortFilter');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const showKeyBtn = document.getElementById('showKeyBtn');
  const showReportBtn = document.getElementById('showReportBtn');
  const btnJumpToFinalReport = document.getElementById('btnJumpToFinalReport');

  // Chart Filter Alert & Loss Badges Grid
  const chartFilterAlert = document.getElementById('chartFilterAlert');
  const filterQuestionText = document.getElementById('filterQuestionText');
  const clearChartFilterBtn = document.getElementById('clearChartFilterBtn');
  const lossMatrixBadgesGrid = document.getElementById('lossMatrixBadgesGrid');

  // Modals & Print Elements
  const studentModal = document.getElementById('studentModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalPrintBtn = document.getElementById('modalPrintBtn');
  const btnStudentRemedialPrint = document.getElementById('btnStudentRemedialPrint');
  const masterKeyModal = document.getElementById('masterKeyModal');
  const keyModalCloseBtn = document.getElementById('keyModalCloseBtn');
  const executiveReportModal = document.getElementById('executiveReportModal');
  const reportModalCloseBtn = document.getElementById('reportModalCloseBtn');
  const executiveReportContent = document.getElementById('executiveReportContent');

  // Student Remedial Card Modal
  const studentRemedialCardModal = document.getElementById('studentRemedialCardModal');
  const remedialCardModalCloseBtn = document.getElementById('remedialCardModalCloseBtn');
  const studentRemedialCardBody = document.getElementById('studentRemedialCardBody');
  const btnPrintRemedialCardModal = document.getElementById('btnPrintRemedialCardModal');

  // Parent Message Modal & Tab Elements
  const btnParentMessage = document.getElementById('btnParentMessage');
  const parentMessageModal = document.getElementById('parentMessageModal');
  const pmModalCloseBtn = document.getElementById('pmModalCloseBtn');
  const pmModalTitle = document.getElementById('pmModalTitle');
  const pmModalSubtitle = document.getElementById('pmModalSubtitle');
  const pmModalStudentStrip = document.getElementById('pmModalStudentStrip');
  const pmModalTextarea = document.getElementById('pmModalTextarea');
  const pmModalCopyBtn = document.getElementById('pmModalCopyBtn');
  const pmModalWhatsappBtn = document.getElementById('pmModalWhatsappBtn');
  const pmModalSmsBtn = document.getElementById('pmModalSmsBtn');
  const pmModalPrintNoticeBtn = document.getElementById('pmModalPrintNoticeBtn');
  const pmModalCopyToast = document.getElementById('pmModalCopyToast');

  const parentMessageTextarea = document.getElementById('parentMessageTextarea');
  const btnCopyParentMessage = document.getElementById('btnCopyParentMessage');
  const btnSendWhatsappDirect = document.getElementById('btnSendWhatsappDirect');
  const btnCopySmsMessage = document.getElementById('btnCopySmsMessage');
  const copyFeedbackToast = document.getElementById('copyFeedbackToast');

  // Print Center Modal & Print Triggers
  const btnPrintCenter = document.getElementById('btnPrintCenter');
  const printCenterModal = document.getElementById('printCenterModal');
  const printCenterCloseBtn = document.getElementById('printCenterCloseBtn');
  const btnPCPrintExecutive = document.getElementById('btnPCPrintExecutive');
  const btnPCPrintRemedial = document.getElementById('btnPCPrintRemedial');
  const btnPCPrintClassRoster = document.getElementById('btnPCPrintClassRoster');
  const btnPCPrintActiveStudent = document.getElementById('btnPCPrintActiveStudent');

  const btnPrintCurrentClassRoster = document.getElementById('btnPrintCurrentClassRoster');
  const btnPrintRemedialHub = document.getElementById('btnPrintRemedialHub');
  const btnPrintFinalReportOfficial = document.getElementById('btnPrintFinalReportOfficial');
  const btnPrintExecutiveReportModal = document.getElementById('btnPrintExecutiveReportModal');
  const isolatedPrintContainer = document.getElementById('isolatedPrintContainer');

  // Evidence Viewer
  const evidenceViewport = document.getElementById('evidenceViewport');
  const evidenceContainerInner = document.getElementById('evidenceContainerInner');
  const modalEvidenceImg = document.getElementById('modalEvidenceImg');
  const modalEvidenceImg2 = document.getElementById('modalEvidenceImg2');
  const btnShowPage1 = document.getElementById('btnShowPage1');
  const btnShowPage2 = document.getElementById('btnShowPage2');
  const btnShowBothPages = document.getElementById('btnShowBothPages');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const btnDownloadEvidence = document.getElementById('btnDownloadEvidence');

  // Final Report Elements
  const targetedStudentsTableBody = document.getElementById('targetedStudentsTableBody');
  const absentStudentsTableBody = document.getElementById('absentStudentsTableBody');
  const btnExportAllCsv = document.getElementById('btnExportAllCsv');

  // Skill translations
  const skillArMap = {
    'Reading Comprehension': 'فهم المقروء',
    'Vocabulary': 'المفردات وتوظيفها',
    'Grammar': 'القواعد والتراكيب',
    'Orthography': 'الرسم الإملائي'
  };

  // Initialize
  function init() {
    setupTheme();
    setupEventListeners();
    renderClassData();
    renderMasterKeyTable();
    updateTabBadges();
    renderRemedialHubGroups();
    renderLossMatrixBadges();
    renderPermanentFinalReport();
  }

  // Theme Management
  function setupTheme() {
    const savedTheme = localStorage.getItem('diag_theme') || 'theme-dark';
    document.body.className = savedTheme;
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('theme-dark');
    const newTheme = isDark ? 'theme-light' : 'theme-dark';
    document.body.className = newTheme;
    localStorage.setItem('diag_theme', newTheme);
    updateThemeIcon(newTheme);
    renderCharts();
  }

  function updateThemeIcon(theme) {
    if (theme === 'theme-light') {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  function updateTabBadges() {
    const c23 = DIAGNOSTIC_DATA.classes.class_2_3;
    const c24 = DIAGNOSTIC_DATA.classes.class_2_4;
    const c33 = DIAGNOSTIC_DATA.classes.class_3_3;
    const c34 = DIAGNOSTIC_DATA.classes.class_3_4;
    if (document.getElementById('badgeCount_2_3') && c23) {
      document.getElementById('badgeCount_2_3').textContent = `${c23.present_count}/${c23.total_enrolled} طالب`;
    }
    if (document.getElementById('badgeCount_2_4') && c24) {
      document.getElementById('badgeCount_2_4').textContent = `${c24.present_count}/${c24.total_enrolled} طالب`;
    }
    if (document.getElementById('badgeCount_3_3') && c33) {
      document.getElementById('badgeCount_3_3').textContent = `${c33.present_count}/${c33.total_enrolled} طالب`;
    }
    if (document.getElementById('badgeCount_3_4') && c34) {
      document.getElementById('badgeCount_3_4').textContent = `${c34.present_count}/${c34.total_enrolled} طالب`;
    }
  }

  // Main Render Controller
  function renderClassData() {
    // 1. Final Report Tab
    if (currentClassId === 'final_report') {
      matrixSection.style.display = 'none';
      chartsDashboard.style.display = 'none';
      searchFilterBar.style.display = 'none';
      remedialHubSection.style.display = 'none';
      finalReportSection.style.display = 'block';
      renderPermanentFinalReport();
      window.scrollTo({ top: finalReportSection.offsetTop - 80, behavior: 'smooth' });
      return;
    }

    // 2. Remedial Hub Tab
    if (currentClassId === 'remedial_hub') {
      matrixSection.style.display = 'none';
      chartsDashboard.style.display = 'none';
      searchFilterBar.style.display = 'none';
      remedialHubSection.style.display = 'block';
      finalReportSection.style.display = 'block';
      renderRemedialHubStats();
      return;
    }

    remedialHubSection.style.display = 'none';
    searchFilterBar.style.display = 'flex';
    chartsDashboard.style.display = 'flex';
    finalReportSection.style.display = 'block';

    // 3. Comparison View Tab
    if (currentClassId === 'comparison') {
      matrixSection.style.display = 'none';
      renderComparisonView();
      renderCharts();
      return;
    }

    // 4. Standard Class Matrix View
    matrixSection.style.display = 'block';
    const classData = DIAGNOSTIC_DATA.classes[currentClassId];
    currentClassTitle.textContent = `مصفوفة الرصد والمهارات — ${classData.name}`;
    document.getElementById('chart1Hint').textContent = classData.short_name;

    // Render KPIs
    renderStats(classData);

    // Filter & Sort Students
    const filteredStudents = getFilteredAndSortedStudents(classData.students);
    renderMatrixTable(filteredStudents, classData);

    // Render Charts
    renderCharts();
  }

  // Top KPI Stats
  function renderStats(classData) {
    const presentStudents = classData.students.filter(s => s.status === 'حاضر');
    const totalEnrolled = classData.total_enrolled;
    const presentCount = classData.present_count;
    const absentCount = classData.absent_count;

    const scores = presentStudents.map(s => s.total_score);
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    const avgPercentage = scores.length ? ((avgScore / 20) * 100).toFixed(1) : 0;

    const masteryCount = presentStudents.filter(s => s.percentage >= 85).length;
    const supportCount = presentStudents.filter(s => s.percentage < 60).length;

    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <h4>نسبة الحضور والغياب</h4>
          <div class="stat-value">${presentCount} <small style="font-size: 1rem; color: var(--text-muted);">/ ${totalEnrolled}</small></div>
          <div class="stat-desc">${absentCount} طلاب غائبون</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-chart-line"></i></div>
        <div class="stat-info">
          <h4>متوسط درجات الفصل</h4>
          <div class="stat-value">${avgScore} <small style="font-size: 1rem; color: var(--text-muted);">/ 20</small></div>
          <div class="stat-desc">نسبة التحصيل العام: ${avgPercentage}%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-award"></i></div>
        <div class="stat-info">
          <h4>مستوى الإتقان والتفوق</h4>
          <div class="stat-value">${masteryCount} <small style="font-size: 1rem; color: var(--text-muted);">طلاب متقنون</small></div>
          <div class="stat-desc">نسبة الإتقان: ${((masteryCount / presentCount) * 100).toFixed(0)}%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="stat-info">
          <h4>أكبر فاقد تعليمي بالمهارات</h4>
          <div class="stat-value" style="font-size: 1.3rem;">القواعد والتراكيب</div>
          <div class="stat-desc">${supportCount} طلاب بحاجة إلى دعم وتدخل مكثف</div>
        </div>
      </div>
    `;
  }

  // Filter & Sort Engine
  function getFilteredAndSortedStudents(students) {
    const query = searchInput.value.trim().toLowerCase();
    const level = levelFilter.value;
    const sort = sortFilter.value;

    let filtered = students.filter(s => {
      const matchQuery = !query || 
        s.name.toLowerCase().includes(query) || 
        String(s.roster_id).includes(query);
      const matchLevel = (level === 'all') || (s.level === level);
      return matchQuery && matchLevel;
    });

    // Apply specific Question Error Filter
    if (filteredByQuestion) {
      filtered = filtered.filter(s => {
        if (s.status === 'غائب') return false;
        const q = s.questions.find(item => item.num === filteredByQuestion);
        return q && !q.is_correct;
      });
    }

    filtered.sort((a, b) => {
      switch (sort) {
        case 'id_asc':
          return a.roster_id - b.roster_id;
        case 'id_desc':
          return b.roster_id - a.roster_id;
        case 'score_desc':
          return b.total_score - a.total_score;
        case 'score_asc':
          return a.total_score - b.total_score;
        case 'name_asc':
          return a.name.localeCompare(b.name, 'ar');
        default:
          return a.roster_id - b.roster_id;
      }
    });

    return filtered;
  }

  // Render Diagnostic Matrix Table
  function renderMatrixTable(students, classData) {
    const filterInfo = filteredByQuestion ? ` [مصفى حسب السؤال ${filteredByQuestion}]` : '';
    matrixPillSummary.textContent = `عرض ${students.length} من أصل ${classData.total_enrolled} طالباً${filterInfo}`;

    if (students.length === 0) {
      matrixTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i class="fa-solid fa-filter-circle-xmark" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
            لا توجد نتائج مطابقة لشروط البحث والفلترة.
          </td>
        </tr>
      `;
      return;
    }

    matrixTableBody.innerHTML = students.map(s => {
      if (s.status === 'غائب') {
        return `
          <tr class="row-absent">
            <td><span class="roster-id-badge">${s.roster_id}</span></td>
            <td><span class="student-name-cell" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')">${s.name}</span></td>
            <td><span class="badge-status absent"><i class="fa-solid fa-circle-xmark"></i> غائب</span></td>
            <td colspan="4" style="text-align: center; color: var(--text-sub);">لم يؤدِ الطالب الاختبار (غائب)</td>
            <td><span class="score-badge-cell"><span class="score-val">0</span>/20</span></td>
            <td><span class="level-tag neutral">غائب</span></td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')">
                <i class="fa-solid fa-eye"></i> تفاصيل
              </button>
            </td>
          </tr>
        `;
      }

      const rc = s.skills["Reading Comprehension"].earned;
      const voc = s.skills["Vocabulary"].earned;
      const gr = s.skills["Grammar"].earned;
      const orth = s.skills["Orthography"].earned;

      return `
        <tr>
          <td><span class="roster-id-badge">${s.roster_id}</span></td>
          <td><span class="student-name-cell" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')">${s.name}</span></td>
          <td><span class="badge-status present"><i class="fa-solid fa-circle-check"></i> حاضر</span></td>
          <td>
            <span class="skill-score-pill ${rc >= 3 ? 'high' : rc === 2 ? 'mid' : 'low'}">
              ${rc}/4
            </span>
          </td>
          <td>
            <span class="skill-score-pill ${voc >= 5 ? 'high' : voc >= 3 ? 'mid' : 'low'}">
              ${voc}/6
            </span>
          </td>
          <td>
            <span class="skill-score-pill ${gr >= 5 ? 'high' : gr >= 3 ? 'mid' : 'low'}">
              ${gr}/6
            </span>
          </td>
          <td>
            <span class="skill-score-pill ${orth >= 3 ? 'high' : orth === 2 ? 'mid' : 'low'}">
              ${orth}/4
            </span>
          </td>
          <td>
            <div class="score-badge-cell">
              <span class="score-val" style="color: ${s.level_color};">${s.total_score}</span>
              <small style="color: var(--text-sub);">(${s.percentage}%)</small>
            </div>
          </td>
          <td>
            <span class="level-tag ${s.level_badge}">${s.level}</span>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn btn-outline btn-sm" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')" title="عرض شاهد الورقة والتحليل">
                <i class="fa-solid fa-camera"></i> الشاهد
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.app.generateRemedialCard(${s.roster_id}, '${s.class_id}')" title="طباعة بطاقة الخطة العلاجية" style="color: var(--primary-light);">
                <i class="fa-solid fa-id-card"></i>
              </button>
              <button class="btn btn-outline btn-sm" onclick="window.app.openParentMessageModal(${s.roster_id}, '${s.class_id}')" title="إنشاء رسالة ولي الأمر (واتساب / SMS)" style="color: #10b981; border-color: rgba(16, 185, 129, 0.4);">
                <i class="fa-brands fa-whatsapp"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Comparison View
  function renderComparisonView() {
    const c23 = DIAGNOSTIC_DATA.classes.class_2_3;
    const c24 = DIAGNOSTIC_DATA.classes.class_2_4;
    const c33 = DIAGNOSTIC_DATA.classes.class_3_3;
    const c34 = DIAGNOSTIC_DATA.classes.class_3_4;

    const p23 = c23.students.filter(s => s.status === 'حاضر');
    const p24 = c24.students.filter(s => s.status === 'حاضر');
    const p33 = c33 ? c33.students.filter(s => s.status === 'حاضر') : [];
    const p34 = c34 ? c34.students.filter(s => s.status === 'حاضر') : [];

    const totalEnrolled = c23.total_enrolled + c24.total_enrolled + (c33 ? c33.total_enrolled : 0) + (c34 ? c34.total_enrolled : 0);
    const totalPresent = p23.length + p24.length + p33.length + p34.length;

    const avg23 = (p23.reduce((a, b) => a + b.total_score, 0) / p23.length).toFixed(1);
    const avg24 = (p24.reduce((a, b) => a + b.total_score, 0) / p24.length).toFixed(1);
    const avg33 = p33.length ? (p33.reduce((a, b) => a + b.total_score, 0) / p33.length).toFixed(1) : 0;
    const avg34 = p34.length ? (p34.reduce((a, b) => a + b.total_score, 0) / p34.length).toFixed(1) : 0;
    const schoolAvg = ((p23.reduce((a, b) => a + b.total_score, 0) + p24.reduce((a, b) => a + b.total_score, 0) + p33.reduce((a, b) => a + b.total_score, 0) + p34.reduce((a, b) => a + b.total_score, 0)) / totalPresent).toFixed(1);

    document.getElementById('chart1Hint').textContent = 'مقارنة شاملة بين الفصول الأربعة';

    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-school"></i></div>
        <div class="stat-info">
          <h4>إجمالي الطلاب المقيدين</h4>
          <div class="stat-value">${totalEnrolled} <small style="font-size: 1rem; color: var(--text-muted);">طالباً</small></div>
          <div class="stat-desc">فصل 2/3: ${c23.total_enrolled} | فصل 2/4: ${c24.total_enrolled} | فصل 3/3: ${c33 ? c33.total_enrolled : 0} | فصل 3/4: ${c34 ? c34.total_enrolled : 0}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-clipboard-check"></i></div>
        <div class="stat-info">
          <h4>إجمالي الأوراق المصححة</h4>
          <div class="stat-value">${totalPresent} <small style="font-size: 1rem; color: var(--text-muted);">طالباً حاضراً</small></div>
          <div class="stat-desc">نسبة الحضور الإجمالية: ${((totalPresent / totalEnrolled) * 100).toFixed(1)}% (${totalEnrolled - totalPresent} غائبين)</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-scale-balanced"></i></div>
        <div class="stat-info">
          <h4>مقارنة متوسط الفصول</h4>
          <div class="stat-value" style="font-size: 0.98rem;">2/3: ${avg23} | 2/4: ${avg24} | 3/3: ${avg33} | 3/4: ${avg34}</div>
          <div class="stat-desc">المتوسط المدرسي العام: <strong>${schoolAvg} / 20</strong> (${((schoolAvg / 20) * 100).toFixed(1)}%)</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger"><i class="fa-solid fa-bullseye"></i></div>
        <div class="stat-info">
          <h4>أبرز فاقد بالمدرسة</h4>
          <div class="stat-value" style="font-size: 1.15rem;">صياغة النفي (won't)</div>
          <div class="stat-desc">السؤال 13 يمثل أولوية المعالجة التدخلية العاجلة</div>
        </div>
      </div>
    `;
  }

  // Remedial Hub Top Stats
  function renderRemedialHubStats() {
    const allStudents = Object.values(DIAGNOSTIC_DATA.classes).flatMap(c => c.students);
    const presentStudents = allStudents.filter(s => s.status === 'حاضر');
    const needSupport = presentStudents.filter(s => s.percentage < 60);

    const c23Support = DIAGNOSTIC_DATA.classes.class_2_3.students.filter(s => s.status === 'حاضر' && s.percentage < 60).length;
    const c24Support = DIAGNOSTIC_DATA.classes.class_2_4.students.filter(s => s.status === 'حاضر' && s.percentage < 60).length;
    const c33Support = DIAGNOSTIC_DATA.classes.class_3_3 ? DIAGNOSTIC_DATA.classes.class_3_3.students.filter(s => s.status === 'حاضر' && s.percentage < 60).length : 0;
    const c34Support = DIAGNOSTIC_DATA.classes.class_3_4 ? DIAGNOSTIC_DATA.classes.class_3_4.students.filter(s => s.status === 'حاضر' && s.percentage < 60).length : 0;

    statsGrid.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon danger"><i class="fa-solid fa-user-xmark"></i></div>
        <div class="stat-info">
          <h4>الطلاب المستهدفون بالخطة العلاجية</h4>
          <div class="stat-value">${needSupport.length} <small style="font-size: 1rem; color: var(--text-muted);">طلاب (< 60%)</small></div>
          <div class="stat-desc">فصل 2/3: ${c23Support} | فصل 2/4: ${c24Support} | فصل 3/3: ${c33Support} | فصل 3/4: ${c34Support}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning"><i class="fa-solid fa-layer-group"></i></div>
        <div class="stat-info">
          <h4>المجالات المستهدفة بالمعالجة</h4>
          <div class="stat-value">4 <small style="font-size: 1rem; color: var(--text-muted);">مجالات رئيسية</small></div>
          <div class="stat-desc">القواعد، الإملاء، المفردات، الاستيعاب</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon primary"><i class="fa-solid fa-stopwatch"></i></div>
        <div class="stat-info">
          <h4>المدة الزمنية المقترحة للخطة</h4>
          <div class="stat-value">3 <small style="font-size: 1rem; color: var(--text-muted);">أسابيع متتالية</small></div>
          <div class="stat-desc">10 دقائق علاجية في كل حصة صفية</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success"><i class="fa-solid fa-bullseye"></i></div>
        <div class="stat-info">
          <h4>مؤشر الإنجاز والهدف المنشود</h4>
          <div class="stat-value">85% <small style="font-size: 1rem; color: var(--text-muted);">نسبة إتقان</small></div>
          <div class="stat-desc">رفع مستوى الطلاب للاجتياز الكامل</div>
        </div>
      </div>
    `;
  }

  // Remedial Hub Student Groups
  function renderRemedialHubGroups() {
    const allStudents = Object.values(DIAGNOSTIC_DATA.classes)
      .flatMap(c => c.students)
      .filter(s => s.status === 'حاضر');

    const grammarGroup = allStudents.filter(s => s.skills["Grammar"].earned < 4);
    const orthGroup = allStudents.filter(s => s.skills["Orthography"].earned < 3);
    const vocabGroup = allStudents.filter(s => s.skills["Vocabulary"].earned < 4);
    const readingGroup = allStudents.filter(s => s.skills["Reading Comprehension"].earned < 3);

    const getShortClass = (cName) => {
      return cName.replace('الصف الثاني متوسط / ', '2/').replace('الصف الثالث متوسط / ', '3/').replace('الصف ', '');
    };

    const container = document.getElementById('remedialGroupsGrid');
    container.innerHTML = `
      <div class="remedial-group-box">
        <h4><span><i class="fa-solid fa-spell-check text-danger"></i> مجموعة دعم القواعد (Grammar)</span> <span class="badge" style="background: var(--danger); color: #fff;">${grammarGroup.length} طلاب</span></h4>
        <div class="student-chips-container">
          ${grammarGroup.map(s => `<span class="student-chip" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')" style="cursor: pointer;">${s.name} (${getShortClass(s.class_name)})</span>`).join('')}
        </div>
      </div>

      <div class="remedial-group-box">
        <h4><span><i class="fa-solid fa-pen-nib" style="color: var(--warning);"></i> مجموعة دعم الإملاء (Orthography)</span> <span class="badge" style="background: var(--warning); color: #fff;">${orthGroup.length} طلاب</span></h4>
        <div class="student-chips-container">
          ${orthGroup.map(s => `<span class="student-chip" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')" style="cursor: pointer;">${s.name} (${getShortClass(s.class_name)})</span>`).join('')}
        </div>
      </div>

      <div class="remedial-group-box">
        <h4><span><i class="fa-solid fa-book-bookmark" style="color: var(--primary-light);"></i> مجموعة دعم المفردات (Vocabulary)</span> <span class="badge" style="background: var(--primary); color: #fff;">${vocabGroup.length} طلاب</span></h4>
        <div class="student-chips-container">
          ${vocabGroup.map(s => `<span class="student-chip" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')" style="cursor: pointer;">${s.name} (${getShortClass(s.class_name)})</span>`).join('')}
        </div>
      </div>

      <div class="remedial-group-box">
        <h4><span><i class="fa-solid fa-glasses" style="color: var(--success);"></i> مجموعة دعم فهم المقروء (Reading)</span> <span class="badge" style="background: var(--success); color: #fff;">${readingGroup.length} طلاب</span></h4>
        <div class="student-chips-container">
          ${readingGroup.map(s => `<span class="student-chip" onclick="window.app.openStudentModal(${s.roster_id}, '${s.class_id}')" style="cursor: pointer;">${s.name} (${getShortClass(s.class_name)})</span>`).join('')}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // Chart.js Data Visualization Engine
  // -------------------------------------------------------------
  function renderCharts() {
    const isDark = document.body.classList.contains('theme-dark');
    const textColor = isDark ? '#f9fafb' : '#0f172a';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

    const c23Students = DIAGNOSTIC_DATA.classes.class_2_3.students.filter(s => s.status === 'حاضر');
    const c24Students = DIAGNOSTIC_DATA.classes.class_2_4.students.filter(s => s.status === 'حاضر');
    const c33Students = DIAGNOSTIC_DATA.classes.class_3_3 ? DIAGNOSTIC_DATA.classes.class_3_3.students.filter(s => s.status === 'حاضر') : [];
    const c34Students = DIAGNOSTIC_DATA.classes.class_3_4 ? DIAGNOSTIC_DATA.classes.class_3_4.students.filter(s => s.status === 'حاضر') : [];

    let studentsToAnalyze = [];
    if (currentClassId === 'comparison') {
      studentsToAnalyze = [...c23Students, ...c24Students, ...c33Students, ...c34Students];
    } else {
      studentsToAnalyze = DIAGNOSTIC_DATA.classes[currentClassId].students.filter(s => s.status === 'حاضر');
    }

    if (studentsToAnalyze.length === 0) return;

    // 1. Mastery Level Doughnut Chart
    const masteryCounts = {
      'متقن': studentsToAnalyze.filter(s => s.percentage >= 85).length,
      'متوسط / متمكن': studentsToAnalyze.filter(s => s.percentage >= 60 && s.percentage < 85).length,
      'يحتاج دعم وتدخل': studentsToAnalyze.filter(s => s.percentage < 60).length
    };

    const ctxMastery = document.getElementById('masteryChart').getContext('2d');
    if (masteryChartInstance) masteryChartInstance.destroy();

    masteryChartInstance = new Chart(ctxMastery, {
      type: 'doughnut',
      data: {
        labels: ['متقن (>= 85%)', 'متوسط (60-84%)', 'يحتاج دعم (< 60%)'],
        datasets: [{
          data: [masteryCounts['متقن'], masteryCounts['متوسط / متمكن'], masteryCounts['يحتاج دعم وتدخل']],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Cairo', size: 12, weight: 'bold' } }
          }
        },
        cutout: '65%'
      }
    });

    // 2. Skills Radar Chart
    const skillsEarned = {
      'Reading Comprehension': 0,
      'Vocabulary': 0,
      'Grammar': 0,
      'Orthography': 0
    };
    const skillsTotal = {
      'Reading Comprehension': 4 * studentsToAnalyze.length,
      'Vocabulary': 6 * studentsToAnalyze.length,
      'Grammar': 6 * studentsToAnalyze.length,
      'Orthography': 4 * studentsToAnalyze.length
    };

    studentsToAnalyze.forEach(s => {
      Object.keys(s.skills).forEach(k => {
        skillsEarned[k] += s.skills[k].earned;
      });
    });

    const skillPercentages = [
      Math.round((skillsEarned['Reading Comprehension'] / skillsTotal['Reading Comprehension']) * 100),
      Math.round((skillsEarned['Vocabulary'] / skillsTotal['Vocabulary']) * 100),
      Math.round((skillsEarned['Grammar'] / skillsTotal['Grammar']) * 100),
      Math.round((skillsEarned['Orthography'] / skillsTotal['Orthography']) * 100)
    ];

    const ctxRadar = document.getElementById('skillsRadarChart').getContext('2d');
    if (skillsRadarChartInstance) skillsRadarChartInstance.destroy();

    skillsRadarChartInstance = new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: ['فهم المقروء (Reading)', 'المفردات (Vocabulary)', 'القواعد (Grammar)', 'الرسم الإملائي (Spelling)'],
        datasets: [{
          label: 'نسبة الإتقان %',
          data: skillPercentages,
          backgroundColor: 'rgba(79, 70, 229, 0.25)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#8b5cf6',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: { color: textColor, font: { family: 'Cairo', size: 11, weight: 'bold' } },
            ticks: { display: false, min: 0, max: 100 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    // 3. Comparative Skills Chart (Class 2/3 vs Class 2/4 vs Class 3/4)
    const calcClassSkillAvg = (studentsList) => {
      const earned = { 'Reading Comprehension': 0, 'Vocabulary': 0, 'Grammar': 0, 'Orthography': 0 };
      studentsList.forEach(s => {
        Object.keys(s.skills).forEach(k => earned[k] += s.skills[k].earned);
      });
      const len = studentsList.length || 1;
      return [
        ((earned['Reading Comprehension'] / (4 * len)) * 100).toFixed(1),
        ((earned['Vocabulary'] / (6 * len)) * 100).toFixed(1),
        ((earned['Grammar'] / (6 * len)) * 100).toFixed(1),
        ((earned['Orthography'] / (4 * len)) * 100).toFixed(1)
      ];
    };

    const c23Averages = calcClassSkillAvg(c23Students);
    const c24Averages = calcClassSkillAvg(c24Students);
    const c33Averages = calcClassSkillAvg(c33Students);
    const c34Averages = calcClassSkillAvg(c34Students);

    const ctxComp = document.getElementById('comparisonSkillsChart').getContext('2d');
    if (comparisonSkillsChartInstance) comparisonSkillsChartInstance.destroy();

    comparisonSkillsChartInstance = new Chart(ctxComp, {
      type: 'bar',
      data: {
        labels: ['فهم المقروء (4د)', 'المفردات (6د)', 'القواعد (6د)', 'الإملاء (4د)'],
        datasets: [
          {
            label: `الصف 2/3 (${c23Students.length} طالباً)`,
            data: c23Averages,
            backgroundColor: '#4f46e5',
            borderRadius: 6
          },
          {
            label: `الصف 2/4 (${c24Students.length} طالباً)`,
            data: c24Averages,
            backgroundColor: '#0ea5e9',
            borderRadius: 6
          },
          {
            label: `الصف 3/3 (${c33Students.length} طالباً)`,
            data: c33Averages,
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          },
          {
            label: `الصف 3/4 (${c34Students.length} طالباً)`,
            data: c34Averages,
            backgroundColor: '#10b981',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Cairo', size: 11, weight: 'bold' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: val => `${val}%`,
              font: { family: 'Cairo', size: 10 }
            },
            min: 0,
            max: 100
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Cairo', size: 11, weight: 'bold' } }
          }
        }
      }
    });

    // 4. Score Distribution Histogram (0-5, 6-10, 11-15, 16-20)
    const scoreBuckets = [
      studentsToAnalyze.filter(s => s.total_score >= 0 && s.total_score <= 5).length,
      studentsToAnalyze.filter(s => s.total_score >= 6 && s.total_score <= 10).length,
      studentsToAnalyze.filter(s => s.total_score >= 11 && s.total_score <= 15).length,
      studentsToAnalyze.filter(s => s.total_score >= 16 && s.total_score <= 20).length
    ];

    const ctxScoreDist = document.getElementById('scoreDistChart').getContext('2d');
    if (scoreDistChartInstance) scoreDistChartInstance.destroy();

    scoreDistChartInstance = new Chart(ctxScoreDist, {
      type: 'bar',
      data: {
        labels: ['ضعف حرج (0-5)', 'يحتاج دعم (6-10)', 'متوسط/متمكن (11-15)', 'متفوق/متقن (16-20)'],
        datasets: [{
          label: 'عدد الطلاب',
          data: scoreBuckets,
          backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Cairo', size: 10, weight: 'bold' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, stepSize: 2, font: { family: 'Cairo', size: 10 } },
            beginAtZero: true
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    // 5. Question Error Rates Horizontal Bar Chart (Q1 to Q20)
    const qErrors = {};
    for (let q = 1; q <= 20; q++) qErrors[q] = 0;

    studentsToAnalyze.forEach(s => {
      s.questions.forEach(q => {
        if (!q.is_correct) qErrors[q.num]++;
      });
    });

    const qLabels = Object.keys(qErrors).map(q => `س ${q}`);
    const qPercentages = Object.keys(qErrors).map(q => Math.round((qErrors[q] / studentsToAnalyze.length) * 100));

    const barColors = qPercentages.map(pct => {
      if (pct >= 60) return '#ef4444'; // Danger
      if (pct >= 40) return '#f59e0b'; // Warning
      return '#10b981'; // Success
    });

    const ctxQuestions = document.getElementById('questionsErrorChart').getContext('2d');
    if (questionsErrorChartInstance) questionsErrorChartInstance.destroy();

    questionsErrorChartInstance = new Chart(ctxQuestions, {
      type: 'bar',
      data: {
        labels: qLabels,
        datasets: [{
          label: 'نسبة الخطأ والفاقد %',
          data: qPercentages,
          backgroundColor: barColors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, activeElements) => {
          if (!activeElements || activeElements.length === 0) return;
          const clickedIdx = activeElements[0].index;
          const qNum = clickedIdx + 1;
          applyQuestionFilter(qNum);
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Cairo', size: 10, weight: 'bold' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: val => `${val}%`,
              font: { family: 'Cairo', size: 10 }
            },
            min: 0,
            max: 100
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: context => {
                const qNum = context[0].dataIndex + 1;
                const ak = DIAGNOSTIC_DATA.answer_key[qNum];
                return `السؤال ${qNum}: [${skillArMap[ak.skill]}] (انقر للتصفية)`;
              },
              label: context => {
                const qNum = context.dataIndex + 1;
                const ak = DIAGNOSTIC_DATA.answer_key[qNum];
                return [
                  `نسبة الخطأ: ${context.parsed.y}% (${qErrors[qNum]} طلاب)`,
                  `المعيار: ${ak.std_ar}`,
                  `الإجابة الصحيحة: (${ak.ans})`
                ];
              }
            }
          }
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Question Filter Logic & Badges Grid
  // -------------------------------------------------------------
  function applyQuestionFilter(qNum) {
    filteredByQuestion = qNum;
    const ak = DIAGNOSTIC_DATA.answer_key[qNum];
    filterQuestionText.textContent = `السؤال ${qNum} [${skillArMap[ak.skill]}: ${ak.std_ar}]`;
    chartFilterAlert.style.display = 'flex';

    // If on comparison or remedial hub, switch to current active class
    if (currentClassId === 'comparison' || currentClassId === 'remedial_hub' || currentClassId === 'final_report') {
      currentClassId = 'class_2_3';
      document.querySelectorAll('.class-tabs .tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-class') === 'class_2_3');
      });
    }

    renderClassData();

    // Smooth scroll to matrix
    matrixSection.scrollIntoView({ behavior: 'smooth' });
  }

  function clearQuestionFilter() {
    filteredByQuestion = null;
    chartFilterAlert.style.display = 'none';
    renderClassData();
  }

  function renderLossMatrixBadges() {
    const allPresent = Object.values(DIAGNOSTIC_DATA.classes)
      .flatMap(c => c.students)
      .filter(s => s.status === 'حاضر');

    const totalPresent = allPresent.length;

    lossMatrixBadgesGrid.innerHTML = Object.keys(DIAGNOSTIC_DATA.answer_key).map(Number).sort((a, b) => a - b).map(qNum => {
      const ak = DIAGNOSTIC_DATA.answer_key[qNum];
      const errorCount = allPresent.filter(s => {
        const q = s.questions.find(item => item.num === qNum);
        return q && !q.is_correct;
      }).length;

      const pct = Math.round((errorCount / totalPresent) * 100);
      let severityClass = 'success';
      if (pct >= 60) severityClass = 'danger';
      else if (pct >= 35) severityClass = 'warning';

      return `
        <div class="loss-badge-item ${severityClass}" onclick="window.app.filterByQuestion(${qNum})" title="انقر لتصفية الطلاب الذين أخطأوا في هذا السؤال">
          <div class="badge-info">
            <span class="badge-q">سؤال ${qNum} (${ak.ans})</span>
            <span class="badge-skill">${skillArMap[ak.skill]}</span>
          </div>
          <span class="badge-pct" style="color: var(--${severityClass === 'danger' ? 'danger' : severityClass === 'warning' ? 'warning' : 'success'});">${pct}%</span>
        </div>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // Student Modal & Evidence Dossier
  // -------------------------------------------------------------
  function openStudentModal(rosterId, classId) {
    let student = null;
    if (classId && DIAGNOSTIC_DATA.classes[classId]) {
      student = DIAGNOSTIC_DATA.classes[classId].students.find(s => s.roster_id === rosterId);
    }
    if (!student && currentClassId && DIAGNOSTIC_DATA.classes[currentClassId]) {
      student = DIAGNOSTIC_DATA.classes[currentClassId].students.find(s => s.roster_id === rosterId);
    }
    if (!student) {
      for (const cid in DIAGNOSTIC_DATA.classes) {
        student = DIAGNOSTIC_DATA.classes[cid].students.find(s => s.roster_id === rosterId);
        if (student) break;
      }
    }
    if (!student) return;

    activeStudent = student;
    evidenceCurrentPage = 1;
    evidenceZoomLevel = 1.0;

    // Header info
    document.getElementById('modalStudentName').textContent = student.name;
    document.getElementById('modalStudentClass').textContent = student.class_name;
    document.getElementById('modalStudentRosterId').textContent = `رقم الكشف: ${student.roster_id}`;
    
    const statusTag = document.getElementById('modalStudentStatus');
    statusTag.textContent = student.status;
    statusTag.className = `tag status-tag ${student.status === 'حاضر' ? '' : 'absent'}`;

    // Score & Level
    document.getElementById('modalScoreDisplay').innerHTML = `${student.total_score}<small>/20</small>`;
    const levelDisplay = document.getElementById('modalLevelDisplay');
    levelDisplay.textContent = student.level;
    levelDisplay.style.color = student.level_color;
    document.getElementById('modalScoreBarFill').style.width = `${student.percentage}%`;
    document.getElementById('modalScoreBarFill').style.background = student.level_color;

    // Mini Skills Breakdown
    const skillsGrid = document.getElementById('modalSkillsBreakdown');
    skillsGrid.innerHTML = Object.keys(student.skills).map(k => {
      const sk = student.skills[k];
      return `
        <div class="mini-skill-card">
          <span class="s-title">${sk.ar}</span>
          <span class="s-val">${sk.earned}/${sk.total}</span>
        </div>
      `;
    }).join('');

    // Evidence Image
    updateEvidenceImage();

    // Remedial Plan List
    const remedialList = document.getElementById('modalRemedialList');
    if (student.status === 'غائب') {
      remedialList.innerHTML = `<li>الطالب غائب: يوصى بإعادة تطبيق الاختبار التشخيصي له لتقييم مستواه ورصد الفاقد التعليمي بدقة.</li>`;
    } else if (student.learning_loss.length === 0) {
      remedialList.innerHTML = `<li style="color: var(--success); font-weight: 700;">ما شاء الله! الطالب أتقن جميع معايير الاختبار التشخيصي بدرجة كاملة (20/20). يوصى بإشراكه في برامج الإثراء والأنشطة المتقدمة.</li>`;
    } else {
      remedialList.innerHTML = student.learning_loss.map(item => `
        <li><strong>السؤال ${item.question_num} (${item.skill_ar}):</strong> ${item.standard_ar} — (إجابة الطالب: <code>${item.student_answer}</code>، الإجابة الصحيحة: <code>${item.correct_answer}</code>).</li>
      `).join('');
    }

    // Questions Table
    const qTableBody = document.getElementById('modalQuestionsTableBody');
    if (student.status === 'غائب') {
      qTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">لا توجد إجابات مسجلة (طالب غائب)</td></tr>`;
    } else {
      qTableBody.innerHTML = student.questions.map(q => `
        <tr>
          <td><strong>${q.num}</strong></td>
          <td>${q.skill_ar}</td>
          <td>${q.standard_ar}</td>
          <td><code style="font-weight: 700; color: ${q.is_correct ? 'var(--success)' : 'var(--danger)'};">${q.student_ans}</code></td>
          <td><code style="font-weight: 700; color: var(--primary-light);">${q.correct_ans}</code></td>
          <td>
            <span class="q-result-badge ${q.is_correct ? 'correct' : 'incorrect'}">
              <i class="fa-solid ${q.is_correct ? 'fa-check' : 'fa-xmark'}"></i>
            </span>
          </td>
        </tr>
      `).join('');
    }

    // Render Individual Remedial Activities
    renderIndividualRemedialPlan(student);

    // Pre-fill parent message textarea in inner tab
    if (parentMessageTextarea) {
      parentMessageTextarea.value = generateParentMessage(student, 'whatsapp');
    }

    // Show modal
    studentModal.classList.add('active');
    switchInnerTab('evidence');
  }

  function renderIndividualRemedialPlan(student) {
    const container = document.getElementById('individualRemedialContent');
    if (student.status === 'غائب') {
      container.innerHTML = `
        <div class="remedial-activity-item">
          <h4>إجراء فوري مطلوب</h4>
          <p>الطالب مسجل كـ "غائب" في الاختبار التشخيصي. يجب تحديد جلسة استدراكية لإجراء الاختبار التشخيصي أولاً قبل بناء الخطة الفردية.</p>
        </div>
      `;
      return;
    }

    if (student.learning_loss.length === 0) {
      container.innerHTML = `
        <div class="remedial-activity-item" style="border-right: 4px solid var(--success);">
          <div class="header-row">
            <h4>خطة إثرائية للطالب المتميز</h4>
            <span class="level-tag success">إتقان 100%</span>
          </div>
          <p>أظهر الطالب تفوقاً تاماً في جميع محاور الاختبار. يُقترح تكليف الطالب بقيادة المجموعات التعلمية (Peer Tutoring) والمشاركة في مسابقات القراءة والتحدث المتقدمة باللغة الإنجليزية.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = student.learning_loss.map((item, idx) => {
      let activityText = '';
      if (item.question_num === 13) {
        activityText = 'ورقة عمل تدريبية على تركيب زمن المستقبل المنفي: قاعدة (won\'t + V1) مع 5 تمارين تصحيح أخطاء شائعة.';
      } else if (item.question_num === 19) {
        activityText = 'تدريب صوتي وإملائي على الكلمات ذات الحروف المضعفة (allergic, different, happy) عبر تقنية التهجئة المقطعية.';
      } else if (item.question_num === 5) {
        activityText = 'قائمة الكلمات وضدها لصفات الأماكن (peaceful vs noisy / relaxing vs stressful) مع كتابة 3 جمل تصف الأماكن المفضلة.';
      } else if (item.question_num === 16) {
        activityText = 'بطاقات مطابقة الفاعل والفاعل في زمن المضارع البسيط (We sleep / He sleeps) لترسيخ قاعدة s المفرد.';
      } else {
        activityText = `تطبيق علاجي في مهارة [${item.skill_ar}]: مراجعة معيار ${item.standard_ar} وتكرار السؤال مع 3 أسئلة مماثلة للتحقق من زوال الفاقد.`;
      }

      return `
        <div class="remedial-activity-item">
          <div class="header-row">
            <h4>نشاط علاجي (${idx + 1}): معالجة السؤال ${item.question_num} (${item.skill_ar})</h4>
            <span class="level-tag danger">فاقد تعليمي</span>
          </div>
          <p><strong>المعيار المستهدف:</strong> ${item.standard_ar}</p>
          <div class="exercise-box">
            <strong>المهمة الموصى بها للمعلم والطالب:</strong>
            <br>${activityText}
          </div>
        </div>
      `;
    }).join('');
  }

  function closeStudentModal() {
    studentModal.classList.remove('active');
    activeStudent = null;
  }

  // Evidence Viewer Toggle & Zoom
  function updateEvidenceImage() {
    if (!activeStudent || activeStudent.status === 'غائب') {
      modalEvidenceImg.src = '';
      modalEvidenceImg.style.display = 'none';
      modalEvidenceImg2.style.display = 'none';
      btnDownloadEvidence.removeAttribute('href');
      return;
    }

    if (evidenceCurrentPage === 'both') {
      evidenceContainerInner.classList.add('side-by-side');
      modalEvidenceImg.style.display = 'block';
      modalEvidenceImg.src = activeStudent.evidence_p1;
      modalEvidenceImg2.style.display = 'block';
      modalEvidenceImg2.src = activeStudent.evidence_p2;
      btnDownloadEvidence.href = activeStudent.evidence_p1;
    } else {
      evidenceContainerInner.classList.remove('side-by-side');
      modalEvidenceImg.style.display = 'block';
      modalEvidenceImg2.style.display = 'none';
      const imgPath = evidenceCurrentPage === 1 ? activeStudent.evidence_p1 : activeStudent.evidence_p2;
      modalEvidenceImg.src = imgPath;
      btnDownloadEvidence.href = imgPath;
    }

    // Toggle button active states
    btnShowPage1.classList.toggle('active', evidenceCurrentPage === 1);
    btnShowPage2.classList.toggle('active', evidenceCurrentPage === 2);
    btnShowBothPages.classList.toggle('active', evidenceCurrentPage === 'both');

    applyEvidenceZoom();
  }

  function applyEvidenceZoom() {
    modalEvidenceImg.style.transform = `scale(${evidenceZoomLevel})`;
    modalEvidenceImg2.style.transform = `scale(${evidenceZoomLevel})`;
  }

  function switchInnerTab(tabName) {
    document.querySelectorAll('.inner-tab').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    document.getElementById('paneEvidence').classList.toggle('active', tabName === 'evidence');
    document.getElementById('paneAnalysis').classList.toggle('active', tabName === 'analysis');
    document.getElementById('paneIndividualRemedial').classList.toggle('active', tabName === 'individual_remedial');
    const panePm = document.getElementById('paneParentMessage');
    if (panePm) panePm.classList.toggle('active', tabName === 'parent_message');
  }

  // -------------------------------------------------------------
  // Parent Messaging System Engine (WhatsApp, SMS & Formal Notice)
  // -------------------------------------------------------------
  function generateParentMessage(student, format = 'whatsapp') {
    if (!student) return '';
    if (student.status === 'غائب') {
      if (format === 'sms') {
        return `المكرم ولي أمر الطالب/ ${student.name} (${student.class_name})، نفيدكم بغياب ابنكم عن الاختبار التشخيصي للغة الإنجليزية. نرجو التنسيق مع المدرسة لتطبيق الاختبار الاستدراكي. متوسطة الفلاح بمكة.`;
      }
      return `السلام عليكم ورحمة الله وبركاته،\nالمكرم ولي أمر الطالب/ *${student.name}* الموقر (${student.class_name})\nتحية طيبة وبعد،،\n\nنود إحاطتكم علماً بأن ابننا الغالي كان *غائباً* عن أداء الاختبار التشخيصي لمادة اللغة الإنجليزية للعام الدراسي 1448هـ.\nنظراً للأهمية التربوية البالغة للاختبار في قياس المعايير وبناء خطط الدعم المناسبة، نرجو التكرم بالتنسيق مع معلم المادة لتطبيق الاختبار الاستدراكي في أقرب وقت.\n\nشاكرين كريم اهتمامكم ومتابعتكم.\nمعلم المادة: *أ. محمود السعيد*\nإدارة مدرسة *متوسطة الفلاح بمكة المكرمة*`;
    }

    const weakItems = student.learning_loss || [];
    const strongSkills = Object.keys(student.skills)
      .filter(k => (student.skills[k].earned / student.skills[k].total) >= 0.75)
      .map(k => student.skills[k].ar);

    if (format === 'sms') {
      return `المكرم ولي أمر الطالب/ ${student.name} (${student.class_name})، نفيدكم بنتيجة ابنكم في الاختبار التشخيصي للغة الإنجليزية: الدرجة (${student.total_score}/20) بنسبة (${student.percentage}%)، المستوى (${student.level}). نأمل متابعة خطة الدعم مع معلم المادة. متوسطة الفلاح بمكة.`;
    }

    // WhatsApp Rich Formatting
    let strengthsText = '';
    if (strongSkills.length > 0) {
      strengthsText = strongSkills.map(s => `  ✓ إتقان وتميز في محور: *${s}*`).join('\n');
    } else {
      strengthsText = '  ✓ تجاوب ومشاركة جيدة في أداء الاختبار وبداية واعدة.';
    }

    let lossText = '';
    if (weakItems.length === 0) {
      lossText = '  🎉 ما شاء الله تبارك الله! حقق الطالب العلامة الكاملة (20/20) دون أي فاقد تعليمي.';
    } else {
      lossText = weakItems.map(item => `  • السؤال ${item.question_num} (${item.skill_ar}): *${item.standard_ar}*`).join('\n');
    }

    let homeAdvice = '';
    if (weakItems.length === 0) {
      homeAdvice = '• الاستمرار في تشجيع الطالب على القراءة الحرة باللغة الإنجليزية ومشاهدة المواد التعليمية المثرية.';
    } else {
      homeAdvice = [
        '• تخصيص 15 دقيقة يومياً لمراجعة المفردات وقواعد الدروس المقررة.',
        '• متابعة أوراق العمل والتدريبات التفاعلية التي يرسلها المعلم عبر المنصة.',
        '• تشجيع الطالب على تصويب الأخطاء والاستفسار عما يصعب عليه أثناء الحصة.'
      ].join('\n');
    }

    return `السلام عليكم ورحمة الله وبركاته،
المكرم ولي أمر الطالب/ *${student.name}* الموقر (${student.class_name})
تحية طيبة وبعد،،

انطلاقاً من مبدأ الشراكة التكاملية بين المدرسة والأسرة الكريمة لمتابعة التحصيل الدراسي، نحيطكم علماً بأن مدرسة *متوسطة الفلاح بمكة المكرمة* قد نفذت الاختبار التشخيصي لمادة اللغة الإنجليزية (1448هـ) لقياس المهارات ورصد الفاقد التعليمي، وكانت نتيجة ابننا كالتالي:

📊 *النتيجة العامة للاختبار:*
• الدرجة المحققة: *${student.total_score} من 20* (النسبة: *${student.percentage}%*)
• التقدير العام: *${student.level}*
• رقم الكشف: *${student.roster_id}*

🌟 *أبرز نقاط القوة والإتقان:*
${strengthsText}

🎯 *المهارات المستهدفة بالمعالجة والدعم (الفاقد التعليمي):*
${lossText}

💡 *توصيات المتابعة المنزلية المشتركة:*
${homeAdvice}

سائلين المولى عز وجل لابننا الغالي دوام التوفيق والنجاح وأعلى المراتب.

مع تحيات:
معلم المادة: *أ. محمود السعيد*
إدارة مدرسة *متوسطة الفلاح بمكة المكرمة*`;
  }

  function openParentMessageModal(rosterId, classId) {
    let student = null;
    if (classId && DIAGNOSTIC_DATA.classes[classId]) {
      student = DIAGNOSTIC_DATA.classes[classId].students.find(s => s.roster_id === rosterId);
    }
    if (!student && currentClassId && DIAGNOSTIC_DATA.classes[currentClassId]) {
      student = DIAGNOSTIC_DATA.classes[currentClassId].students.find(s => s.roster_id === rosterId);
    }
    if (!student) {
      for (const cid in DIAGNOSTIC_DATA.classes) {
        student = DIAGNOSTIC_DATA.classes[cid].students.find(s => s.roster_id === rosterId);
        if (student) break;
      }
    }
    if (!student) return;

    activeStudent = student;

    // Header info
    pmModalTitle.textContent = `رسالة تربوية لولي أمر الطالب / ${student.name}`;
    pmModalSubtitle.textContent = `إشعار رسمي بنتيجة الاختبار التشخيصي وخطة الدعم — ${student.class_name} (رقم الكشف: ${student.roster_id})`;

    // Student summary strip
    pmModalStudentStrip.innerHTML = `
      <div class="strip-item"><span class="strip-label">اسم الطالب:</span> <span class="strip-val">${student.name}</span></div>
      <div class="strip-item"><span class="strip-label">الصف:</span> <span class="strip-val">${student.class_name}</span></div>
      <div class="strip-item"><span class="strip-label">رقم الكشف:</span> <span class="strip-val">#${student.roster_id}</span></div>
      <div class="strip-item"><span class="strip-label">الدرجة:</span> <span class="strip-val" style="color: ${student.level_color};">${student.total_score} / 20 (${student.percentage}%)</span></div>
      <div class="strip-item"><span class="strip-label">المستوى:</span> <span class="strip-val">${student.level}</span></div>
      <div class="strip-item"><span class="strip-label">الحالة:</span> <span class="strip-val">${student.status}</span></div>
    `;

    // Populate textarea
    pmModalTextarea.value = generateParentMessage(student, 'whatsapp');

    // Show modal
    parentMessageModal.classList.add('active');
  }

  function closeParentMessageModal() {
    parentMessageModal.classList.remove('active');
  }

  function copyToClipboard(text, toastEl) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (toastEl) {
        toastEl.style.display = 'inline-flex';
        setTimeout(() => {
          toastEl.style.display = 'none';
        }, 2500);
      }
    }).catch(err => {
      console.warn('Clipboard copy error:', err);
    });
  }

  function sendWhatsAppDirect(text) {
    if (!text) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  // -------------------------------------------------------------
  // Isolated Modular Print Engine (Selective Printing Only)
  // -------------------------------------------------------------
  function executeIsolatedPrint(htmlContent, title) {
    if (!isolatedPrintContainer) return;
    const originalTitle = document.title;
    if (title) document.title = title;
    isolatedPrintContainer.innerHTML = htmlContent;

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        isolatedPrintContainer.innerHTML = '';
        document.title = originalTitle;
      }, 500);
    }, 150);
  }

  // Print Center Modal open/close
  function openPrintCenterModal() {
    if (printCenterModal) printCenterModal.classList.add('active');
  }
  function closePrintCenterModal() {
    if (printCenterModal) printCenterModal.classList.remove('active');
  }

  // 1. Print Student Dossier with Evidence
  function printStudentDossier(student, withEvidence = true) {
    if (!student) {
      if (activeStudent) student = activeStudent;
      else {
        alert('يرجى تحديد طالب أولاً لطباعة ملفه وشواهده');
        return;
      }
    }

    const weakQuestions = student.learning_loss || [];
    const skillsKeys = Object.keys(student.skills);

    let html = `
      <div class="printable-document">
        <!-- Page 1: Student Official Report -->
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>تقرير نتيجة الطالب في الاختبار التشخيصي والفاقد التعليمي</h1>
            <h2>مادة اللغة الإنجليزية — الفصل الدراسي الأول 1448هـ</h2>
            <p>سجل رسمي موثق ومطابق لأوراق الإجابة الممسوحة ضوئياً</p>
          </div>
          <div class="side-meta">
            رقم الاستمارة: ${student.class_id}_${student.roster_id}<br>
            تاريخ التشخيص: 1448/01/15هـ<br>
            حالة الطالب: ${student.status}
          </div>
        </div>

        <!-- Student Info Strip -->
        <div class="print-info-grid">
          <div class="print-info-cell"><span class="lbl">اسم الطالب:</span> <span class="val">${student.name}</span></div>
          <div class="print-info-cell"><span class="lbl">الصف الدراسي:</span> <span class="val">${student.class_name}</span></div>
          <div class="print-info-cell"><span class="lbl">رقم الكشف:</span> <span class="val">#${student.roster_id}</span></div>
          <div class="print-info-cell"><span class="lbl">الدرجة المحققة:</span> <span class="val">${student.total_score} / 20 (${student.percentage}%)</span></div>
        </div>

        <!-- Skills Breakdown Table -->
        <div class="print-section-title">أولاً: مصفوفة مهارات ومعايير الاختبار التشخيصي</div>
        <table class="print-table">
          <thead>
            <tr>
              ${skillsKeys.map(k => `<th>${student.skills[k].ar} (${student.skills[k].total} درجات)</th>`).join('')}
              <th>المجموع الكلي (20)</th>
              <th>المستوى والتقدير</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              ${skillsKeys.map(k => `<td class="center"><strong>${student.skills[k].earned} / ${student.skills[k].total}</strong></td>`).join('')}
              <td class="center" style="font-size: 11pt; font-weight: bold;">${student.total_score} / 20 (${student.percentage}%)</td>
              <td class="center"><strong>${student.level}</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Learning Loss Table -->
        <div class="print-section-title">ثانياً: تشخيص الفاقد التعليمي والأسئلة غير المتقنة</div>
        ${weakQuestions.length === 0 ? `
          <div style="padding: 10px; border: 1px dashed #000; text-align: center; font-weight: bold; margin-bottom: 15px;">
            ما شاء الله تبارك الله! أتقن الطالب جميع مهارات الاختبار بدرجة كاملة (20/20) ولا يوجد لديه أي فاقد تعليمي مرصود.
          </div>
        ` : `
          <table class="print-table">
            <thead>
              <tr>
                <th style="width: 40px;">س#</th>
                <th style="width: 140px;">المجال</th>
                <th>المعيار التعليمي المستهدف (Standard)</th>
                <th style="width: 80px;">إجابة الطالب</th>
                <th style="width: 80px;">الإجابة الصحيحة</th>
                <th>التشخيص التدخلي</th>
              </tr>
            </thead>
            <tbody>
              ${weakQuestions.map(item => `
                <tr>
                  <td class="center"><strong>${item.question_num}</strong></td>
                  <td>${item.skill_ar}</td>
                  <td>${item.standard_ar}</td>
                  <td class="center"><code style="font-weight: bold; color: #b91c1c;">${item.student_answer}</code></td>
                  <td class="center"><code style="font-weight: bold; color: #15803d;">${item.correct_answer}</code></td>
                  <td>تدريب علاجي في معيار: ${item.standard_ar}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}

        <!-- Prescribed Actions -->
        <div class="print-section-title">ثالثاً: التدخلات العلاجية الموصوفة للطالب</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 35px;">م</th>
              <th>المهارة المستهدفة</th>
              <th>الإجراء والنشاط العلاجي المقترح</th>
              <th style="width: 110px;">الفترة الزمنية</th>
              <th style="width: 100px;">التحقق والاعتماد</th>
            </tr>
          </thead>
          <tbody>
            ${weakQuestions.length === 0 ? `
              <tr>
                <td class="center">1</td>
                <td>مهارات إثرائية متقدمة</td>
                <td>إشراك الطالب في برنامج المعلم الصغير ومسابقات القراءة المتقدمة باللغة الإنجليزية</td>
                <td class="center">مستمر للفصل الأول</td>
                <td class="center">[  ] تم الإنجاز</td>
              </tr>
            ` : weakQuestions.slice(0, 4).map((item, idx) => {
              let act = '';
              if (item.question_num === 13) act = 'ورقة عمل صياغة زمن المستقبل المنفي (won\'t + V1) وتمارين تصويب الأخطاء';
              else if (item.question_num === 19) act = 'التجزئة الصوتية للكلمات ذات الحروف المضعفة (allergic) وبطاقات التلوين';
              else if (item.question_num === 5) act = 'بطاقات المفردات المتضادة لصفات الأماكن (peaceful vs noisy) وكتابة 3 جمل';
              else if (item.question_num === 16) act = 'تطبيق قاعدة ميزان تصريف المضارع مع الجمع (We sleep) وتدريبات سريعة';
              else act = `مراجعة تدريبية مكثفة في معيار ${item.standard_ar} ونماذج مماثلة`;

              return `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td>${item.skill_ar} (س${item.question_num})</td>
                  <td>${act}</td>
                  <td class="center">الأسبوع ${idx === 0 ? 'الأول' : idx === 1 ? 'الثاني' : 'الثالث'}</td>
                  <td class="center">[  ] تم الإتقان</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Signatures Box -->
        <div class="print-signatures-box">
          <div class="print-sig-col">
            <div class="role">معلم المادة</div>
            <div class="name">أ. محمود السعيد</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">الموجه الطلابي</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">ولي أمر الطالب بالعلم والمتابعة</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
        </div>

        ${withEvidence && student.status === 'حاضر' ? `
          <!-- Page 2: Evidence Page 1 (Scanned ZipGrade Bubble Sheet) -->
          <div class="print-evidence-page">
            <div class="print-header" style="margin-bottom: 8px;">
              <div class="side-inst">متوسطة الفلاح بمكة المكرمة</div>
              <div class="center-title">
                <h2>شاهد ورقة الإجابة الممسوحة ضوئياً (الصفحة 1 - نموذج التظليل الرسمي)</h2>
                <p>الطالب: <strong>${student.name}</strong> — ${student.class_name} — رقم الكشف: #${student.roster_id} — الدرجة: ${student.total_score}/20</p>
              </div>
              <div class="side-meta">شاهد رسمي معتمد</div>
            </div>
            <div class="print-evidence-img-wrapper">
              <img src="${student.evidence_p1}" class="print-evidence-img" alt="شاهد ورقة الإجابة صفحة 1">
            </div>
          </div>

          <!-- Page 3: Evidence Page 2 (Scanned Question Paper) -->
          <div class="print-evidence-page">
            <div class="print-header" style="margin-bottom: 8px;">
              <div class="side-inst">متوسطة الفلاح بمكة المكرمة</div>
              <div class="center-title">
                <h2>شاهد ورقة الأسئلة والتوصيل والإملاء (الصفحة 2 - الورقة الأصلية)</h2>
                <p>الطالب: <strong>${student.name}</strong> — ${student.class_name} — رقم الكشف: #${student.roster_id}</p>
              </div>
              <div class="side-meta">شاهد رسمي معتمد</div>
            </div>
            <div class="print-evidence-img-wrapper">
              <img src="${student.evidence_p2}" class="print-evidence-img" alt="شاهد ورقة الأسئلة صفحة 2">
            </div>
          </div>
        ` : ''}
      </div>
    `;

    executeIsolatedPrint(html, `تقرير_الطالب_${student.name}_مع_الشواهد`);
  }

  // 2. Print Executive Report for School Leadership & Principal
  function printExecutiveReport() {
    const c23 = DIAGNOSTIC_DATA.classes.class_2_3;
    const c24 = DIAGNOSTIC_DATA.classes.class_2_4;
    const c33 = DIAGNOSTIC_DATA.classes.class_3_3;
    const c34 = DIAGNOSTIC_DATA.classes.class_3_4;

    const p23 = c23.students.filter(s => s.status === 'حاضر');
    const p24 = c24.students.filter(s => s.status === 'حاضر');
    const p33 = c33 ? c33.students.filter(s => s.status === 'حاضر') : [];
    const p34 = c34 ? c34.students.filter(s => s.status === 'حاضر') : [];

    const totalEnrolled = c23.total_enrolled + c24.total_enrolled + (c33 ? c33.total_enrolled : 0) + (c34 ? c34.total_enrolled : 0);
    const totalPresent = p23.length + p24.length + p33.length + p34.length;
    const totalAbsent = totalEnrolled - totalPresent;

    const avg23 = (p23.reduce((a, b) => a + b.total_score, 0) / p23.length).toFixed(1);
    const avg24 = (p24.reduce((a, b) => a + b.total_score, 0) / p24.length).toFixed(1);
    const avg33 = p33.length ? (p33.reduce((a, b) => a + b.total_score, 0) / p33.length).toFixed(1) : 0;
    const avg34 = p34.length ? (p34.reduce((a, b) => a + b.total_score, 0) / p34.length).toFixed(1) : 0;
    const schoolAvg = (((p23.reduce((a, b) => a + b.total_score, 0) + p24.reduce((a, b) => a + b.total_score, 0) + p33.reduce((a, b) => a + b.total_score, 0) + p34.reduce((a, b) => a + b.total_score, 0)) / totalPresent)).toFixed(1);

    const allStudents = Object.values(DIAGNOSTIC_DATA.classes).flatMap(c => c.students);
    const targetedStudents = allStudents
      .filter(s => s.status === 'حاضر' && s.total_score < 12)
      .sort((a, b) => a.total_score - b.total_score);

    const absentStudents = allStudents
      .filter(s => s.status === 'غائب')
      .sort((a, b) => a.class_id.localeCompare(b.class_id) || a.roster_id - b.roster_id);

    let html = `
      <div class="printable-document">
        <!-- Header -->
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوصطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>التقرير التشخيصي الختامي الشامل لإدارة المدرسة</h1>
            <h2>تحليل نتائج الاختبار التشخيصي وخطة معالجة الفاقد التعليمي (1448هـ)</h2>
            <p>مادة اللغة الإنجليزية — الصفوف: الثاني متوسط والثالث متوسط</p>
          </div>
          <div class="side-meta">
            العام الدراسي: 1448هـ<br>
            تاريخ الاعتماد: 1448/01/20هـ<br>
            الجهة: إدارة المدرسة والإشراف التربوي
          </div>
        </div>

        <!-- Executive KPI Cards -->
        <div class="print-kpi-row">
          <div class="print-kpi-box">
            <div class="num">${totalEnrolled}</div>
            <div class="sub">إجمالي الطلاب المقيدين</div>
          </div>
          <div class="print-kpi-box">
            <div class="num">${totalPresent} (${((totalPresent / totalEnrolled) * 100).toFixed(1)}%)</div>
            <div class="sub">الحاضرون والمختبرون</div>
          </div>
          <div class="print-kpi-box">
            <div class="num" style="color: #b91c1c;">${totalAbsent} (${((totalAbsent / totalEnrolled) * 100).toFixed(1)}%)</div>
            <div class="sub">الطلاب الغائبون بعذر</div>
          </div>
          <div class="print-kpi-box">
            <div class="num">${schoolAvg} / 20 (${((schoolAvg / 20) * 100).toFixed(1)}%)</div>
            <div class="sub">المتوسط العام للمدرسة</div>
          </div>
        </div>

        <!-- Section 1: Class Comparison Table -->
        <div class="print-section-title">أولاً: مقارنة مؤشرات الأداء والتحصيل بين الفصول الدراسية</div>
        <table class="print-table">
          <thead>
            <tr>
              <th>الصف / الفصل</th>
              <th>المقيدون</th>
              <th>الحاضرون</th>
              <th>الغائبون</th>
              <th>متوسط الدرجات (من 20)</th>
              <th>نسبة الإتقان العامة</th>
              <th>مستوى أداء الفصل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>الصف الثاني متوسط / 3</strong></td>
              <td class="center">${c23.total_enrolled}</td>
              <td class="center">${p23.length}</td>
              <td class="center">${c23.absent_count}</td>
              <td class="center"><strong>${avg23} / 20</strong></td>
              <td class="center">${((avg23 / 20) * 100).toFixed(1)}%</td>
              <td class="center">متوسط / متمكن</td>
            </tr>
            <tr>
              <td><strong>الصف الثاني متوسط / 4</strong></td>
              <td class="center">${c24.total_enrolled}</td>
              <td class="center">${p24.length}</td>
              <td class="center">${c24.absent_count}</td>
              <td class="center"><strong>${avg24} / 20</strong></td>
              <td class="center">${((avg24 / 20) * 100).toFixed(1)}%</td>
              <td class="center">متوسط / متمكن</td>
            </tr>
            <tr>
              <td><strong>الصف الثالث متوسط / 3</strong></td>
              <td class="center">${c33 ? c33.total_enrolled : 28}</td>
              <td class="center">${p33.length}</td>
              <td class="center">${c33 ? c33.absent_count : 4}</td>
              <td class="center"><strong>${avg33} / 20</strong></td>
              <td class="center">${((avg33 / 20) * 100).toFixed(1)}%</td>
              <td class="center">متقدم / متمكن</td>
            </tr>
            <tr>
              <td><strong>الصف الثالث متوسط / 4</strong></td>
              <td class="center">${c34 ? c34.total_enrolled : 28}</td>
              <td class="center">${p34.length}</td>
              <td class="center">${c34 ? c34.absent_count : 0}</td>
              <td class="center"><strong>${avg34} / 20</strong></td>
              <td class="center">${((avg34 / 20) * 100).toFixed(1)}%</td>
              <td class="center">متقدم / متميز</td>
            </tr>
            <tr style="background: #f0f0f0; font-weight: bold;">
              <td><strong>المتوسط العام للمدرسة (الإجمالي)</strong></td>
              <td class="center"><strong>${totalEnrolled}</strong></td>
              <td class="center"><strong>${totalPresent}</strong></td>
              <td class="center"><strong>${totalAbsent}</strong></td>
              <td class="center"><strong>${schoolAvg} / 20</strong></td>
              <td class="center"><strong>${((schoolAvg / 20) * 100).toFixed(1)}%</strong></td>
              <td class="center"><strong>مستوى عام جيد جداً</strong></td>
            </tr>
          </tbody>
        </table>

        <!-- Section 2: Skills Comparative Breakdown -->
        <div class="print-section-title">ثانياً: تحليل نسب إتقان المهارات اللغوية الأربعة بين الفصول</div>
        <table class="print-table">
          <thead>
            <tr>
              <th>المجال المهاري المستهدف</th>
              <th>الدرجة القصوى</th>
              <th>الصف 2/3</th>
              <th>الصف 2/4</th>
              <th>الصف 3/3</th>
              <th>الصف 3/4</th>
              <th>المتوسط المدرسي العام</th>
              <th>الحالة التشخيصية</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>فهم المقروء (Reading Comprehension)</strong></td>
              <td class="center">4 درجات</td>
              <td class="center">90.6%</td>
              <td class="center">96.4%</td>
              <td class="center">99.0%</td>
              <td class="center">100.0%</td>
              <td class="center"><strong>96.6%</strong></td>
              <td class="center">مستوى متقدم ومتقن جداً</td>
            </tr>
            <tr>
              <td><strong>المفردات والدلالة (Vocabulary)</strong></td>
              <td class="center">6 درجات</td>
              <td class="center">61.1%</td>
              <td class="center">63.5%</td>
              <td class="center">78.5%</td>
              <td class="center">83.3%</td>
              <td class="center"><strong>72.3%</strong></td>
              <td class="center">مستوى جيد جداً ومتمكن</td>
            </tr>
            <tr>
              <td><strong>القواعد والتراكيب (Grammar)</strong></td>
              <td class="center">6 درجات</td>
              <td class="center">58.3%</td>
              <td class="center">61.1%</td>
              <td class="center">72.2%</td>
              <td class="center">81.0%</td>
              <td class="center"><strong>68.9%</strong></td>
              <td class="center">فاقد متوسط (نفي المستقبل)</td>
            </tr>
            <tr>
              <td><strong>الرسم الإملائي والصوتي (Orthography)</strong></td>
              <td class="center">4 درجات</td>
              <td class="center">51.0%</td>
              <td class="center">57.1%</td>
              <td class="center">64.6%</td>
              <td class="center">80.4%</td>
              <td class="center"><strong>64.2%</strong></td>
              <td class="center">أولوية خطة علاجية مكثفة</td>
            </tr>
          </tbody>
        </table>

        <!-- Section 3: Priority School-wide Learning Losses -->
        <div class="print-section-title">ثالثاً: أبرز مهارات الفاقد التعليمي المشتركة على مستوى المدرسة (الحاضرون 97 طالباً)</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 45px;">الأولوية</th>
              <th>المجال والمهارة المستهدفة</th>
              <th>المعيار التعليمي المرصود</th>
              <th style="width: 95px;">عدد المخفقين</th>
              <th style="width: 80px;">نسبة الفاقد</th>
              <th>الإجراء التدخلي المعتمد</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center"><strong>1</strong></td>
              <td><strong>القواعد (س13)</strong></td>
              <td>صياغة النفي في زمن المستقبل البسيط (will not -> won't)</td>
              <td class="center"><strong>58 طالباً</strong></td>
              <td class="center" style="color: #b91c1c; font-weight: bold;">59.8%</td>
              <td>خريطة مفاهيم بصرية + بطاقات المعادلات (will + not = won't) + تدريب 5 دقائق يومياً</td>
            </tr>
            <tr>
              <td class="center"><strong>2</strong></td>
              <td><strong>الإملاء (س19)</strong></td>
              <td>كتابة الكلمات ذات الحروف المضعفة (allergic -> L)</td>
              <td class="center"><strong>51 طالباً</strong></td>
              <td class="center" style="color: #b91c1c; font-weight: bold;">52.6%</td>
              <td>التجزئة الصوتية المقطعية (Chunking: al-ler-gic) + تقنية التلوين الإملائي</td>
            </tr>
            <tr>
              <td class="center"><strong>3</strong></td>
              <td><strong>القواعد (س16)</strong></td>
              <td>المضارع البسيط للروتين مع ضمائر الجمع (We sleep / no s)</td>
              <td class="center"><strong>42 طالباً</strong></td>
              <td class="center" style="color: #b91c1c; font-weight: bold;">43.3%</td>
              <td>قاعدة ميزان تصريف الأفعال مع المفرد والجمع + اختبارات تكوينية أسبوعية</td>
            </tr>
            <tr>
              <td class="center"><strong>4</strong></td>
              <td><strong>المفردات (س05)</strong></td>
              <td>توظيف الصفات المعجمية للأماكن والمشاعر (peaceful vs noisy)</td>
              <td class="center"><strong>40 طالباً</strong></td>
              <td class="center" style="color: #d97706; font-weight: bold;">41.2%</td>
              <td>سلسلة الكلمة وضدها في سياقات واقعية + بطاقات الفلاش كارد المعجمية</td>
            </tr>
            <tr>
              <td class="center"><strong>5</strong></td>
              <td><strong>الإملاء (س18)</strong></td>
              <td>التهجئة الصحيحة لمفردات الطوارئ والحوادث (emergency -> m)</td>
              <td class="center"><strong>37 طالباً</strong></td>
              <td class="center" style="color: #d97706; font-weight: bold;">38.1%</td>
              <td>تدريبات الإملاء المنظور وقوائم التهجئة المصغرة الأسبوعية</td>
            </tr>
          </tbody>
        </table>

        <!-- Section 3: Targeted Students Roster (< 60%) -->
        <div class="print-page-break"></div>
        <div class="print-header">
          <div class="side-inst">متوسطة الفلاح بمكة المكرمة</div>
          <div class="center-title">
            <h2>كشوف حصر الطلاب المستهدفين بالخطة العلاجية والطلاب الغائبين</h2>
            <p>تابع التقرير التشخيصي الختامي الشامل لإدارة المدرسة (1448هـ)</p>
          </div>
          <div class="side-meta">صفحة 2 من 2</div>
        </div>

        <div class="print-section-title">رابعاً: كشف الطلاب المستهدفين بالخطة العلاجية المكثفة (أقل من 60% — ${targetedStudents.length} طالباً)</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>اسم الطالب</th>
              <th style="width: 90px;">الصف</th>
              <th style="width: 60px;">رقم الكشف</th>
              <th style="width: 80px;">الدرجة</th>
              <th>أبرز مهارات الفاقد المرصودة</th>
              <th style="width: 130px;">نوع التدخل المطلوب</th>
            </tr>
          </thead>
          <tbody>
            ${targetedStudents.map((s, idx) => {
              const weakSkills = s.learning_loss.map(i => `س${i.question_num}`).join(', ') || 'مهارات عامة';
              const shortClass = s.class_name.replace('الصف الثاني متوسط / ', '2/').replace('الصف الثالث متوسط / ', '3/');
              return `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td><strong>${s.name}</strong></td>
                  <td class="center">${shortClass}</td>
                  <td class="center">#${s.roster_id}</td>
                  <td class="center" style="color: #b91c1c; font-weight: bold;">${s.total_score} / 20</td>
                  <td>${weakSkills}</td>
                  <td class="center">خطة معالجة مكثفة (3 أسابيع)</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Section 4: Absent Students -->
        <div class="print-section-title">خامساً: كشف الطلاب الغائبين المجدول لهم اختبار استدراكي (${absentStudents.length} طلاب)</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>اسم الطالب</th>
              <th style="width: 90px;">الصف</th>
              <th style="width: 60px;">رقم الكشف</th>
              <th>حالة الغياب</th>
              <th>الإجراء الإداري والتربوي المطلوب</th>
            </tr>
          </thead>
          <tbody>
            ${absentStudents.map((s, idx) => {
              const shortClass = s.class_name.replace('الصف الثاني متوسط / ', '2/').replace('الصف الثالث متوسط / ', '3/');
              return `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td><strong>${s.name}</strong></td>
                  <td class="center">${shortClass}</td>
                  <td class="center">#${s.roster_id}</td>
                  <td class="center">غائب بعذر</td>
                  <td>تطبيق جلسة الاختبار التشخيصي الاستدراكي وحصر الفاقد قبل نهاية الأسبوع القادم</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Section 5: Administrative Recommendations -->
        <div class="print-section-title">سادساً: التوصيات الإدارية والتربوية المعتمدة</div>
        <ul style="padding-right: 20px; font-size: 8.5pt; line-height: 1.6; margin: 4px 0 15px 0;">
          <li><strong>تنفيذ خطة المعالجة الصباحية:</strong> تخصيص 10 دقائق من الحصص اليومية لتنفيذ تمارين الفاقد للطلاب المستهدفين.</li>
          <li><strong>الاختبار الاستدراكي:</strong> تكليف معلم المادة بحصر الطلاب الغائبين وتطبيق الاختبار لهم قبل 1448/01/25هـ.</li>
          <li><strong>الشراكة مع أولياء الأمور:</strong> إرسال رسائل التقرير التشخيصي لأولياء أمور الطلاب عبر تطبيق الواتساب لمتابعة خطة الدعم.</li>
          <li><strong>القياس البعدي (Post-Test):</strong> تطبيق اختبار بعدي موازي بنهاية الأسبوع الثالث لقياس نسبة تعافي الفاقد التعليمي.</li>
        </ul>

        <!-- Signatures Box -->
        <div class="print-signatures-box">
          <div class="print-sig-col">
            <div class="role">معلم المادة</div>
            <div class="name">أ. محمود السعيد</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">الموجه الطلابي</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">مدير متوسطة الفلاح بمكة</div>
            <div class="name">أ. ................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">الختم والتوقيع: .....................</div>
          </div>
        </div>
      </div>
    `;

    executeIsolatedPrint(html, 'التقرير_التشخيصي_الختامي_لمدير_المدرسة');
  }

  // 3. Print Remedial Action Plan Report
  function printRemedialPlan() {
    let html = `
      <div class="printable-document">
        <!-- Header -->
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>الخطة العلاجية الشاملة لمعالجة الفاقد التعليمي</h1>
            <h2>مادة اللغة الإنجليزية — الفصل الدراسي الأول 1448هـ</h2>
            <p>مصفوفة التدخلات التدريسية وجدولة الأنشطة ومجموعات الدعم الصفي</p>
          </div>
          <div class="side-meta">
            الفصول: 2/3 ، 2/4 ، 3/4<br>
            المدة: 3 أسابيع مكثفة<br>
            معلم المادة: أ. محمود السعيد
          </div>
        </div>

        <!-- Section 1: Detailed Strategies Grid -->
        <div class="print-section-title">أولاً: مصفوفة استراتيجيات معالجة مهارات الفاقد ذات الأولوية</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 40px;">م</th>
              <th style="width: 130px;">المهارة المستهدفة</th>
              <th>تشخيص سبب الخلل التعليمي</th>
              <th>الأنشطة والتدخلات العلاجية المقترحة</th>
              <th style="width: 80px;">أداة التحقق</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center"><strong>1</strong></td>
              <td><strong>القواعد: صياغة النفي (won't)<br><small style="color: #b91c1c;">(الفاقد 78%)</small></strong></td>
              <td>عدم التمييز بين صيغ النفي المختصرة والخلط بين won't و isn't و not will.</td>
              <td>خريطة مفاهيمية (will + not = won't) + مسابقة اكتشاف وتصويب الأخطاء (Find & Fix) + ورقة عمل يومية 5 دقائق.</td>
              <td class="center">كويز 3 أسئلة</td>
            </tr>
            <tr>
              <td class="center"><strong>2</strong></td>
              <td><strong>الإملاء: الحروف المضعفة<br><small style="color: #b91c1c;">(الفاقد 64.5%)</small></strong></td>
              <td>صعوبة تذكر وتحديد الحرف المكرر في الكلمات متعددة المقاطع (allergic).</td>
              <td>استراتيجية التجزئة الصوتية (Chunking) + بطاقات التلوين الهجائية + تفعيل (Look-Say-Cover-Write-Check).</td>
              <td class="center">إملاء قصير</td>
            </tr>
            <tr>
              <td class="center"><strong>3</strong></td>
              <td><strong>المفردات: صفات الأماكن<br><small style="color: #d97706;">(الفاقد 57.5%)</small></strong></td>
              <td>فقر في الحصيلة المعجمية الوصفية للأماكن الهادئة مقابل الصاخبة (peaceful vs noisy).</td>
              <td>بطاقات المفردات المتضادة (Antonyms Flashcards) + توظيف الكلمات في جمل من واقع بيئة الطالب.</td>
              <td class="center">مطابقة معجمية</td>
            </tr>
            <tr>
              <td class="center"><strong>4</strong></td>
              <td><strong>القواعد: المضارع مع الجمع<br><small style="color: #d97706;">(الفاقد 53.5%)</small></strong></td>
              <td>الخلط بين إضافة s لفاعل المفرد والجمع في الجمل الخبرية (We sleep).</td>
              <td>قاعدة ميزان الجمع والمفرد البصرية + تمرين الاختيار السريع (Speed Quiz) عبر بطاقات ملونة.</td>
              <td class="center">تطبيق بنائي</td>
            </tr>
          </tbody>
        </table>

        <!-- Section 2: 3-Week Implementation Timeline -->
        <div class="print-section-title">ثانياً: الجدول الزمني لتنفيذ ومتابعة الخطة العلاجية (3 أسابيع)</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 110px;">الفترة الزمنية</th>
              <th style="width: 140px;">المهارة المركّز عليها</th>
              <th>الإجراءات التدريسية اليومية</th>
              <th style="width: 140px;">مخرجات التعلم المتوقعة</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>الأسبوع الأول</strong></td>
              <td>مهارات القواعد (س13 و س16)</td>
              <td>شرح قاعدة زمن المستقبل المنفي (won't) + مطابقة الجمع والمفرد في بداية كل حصة دراسية لمدة 10 دقائق.</td>
              <td>قدرة الطالب على صياغة جمل النفي السليمة ونفي المستقبل بنسبة إتقان لا تقل عن 80%.</td>
            </tr>
            <tr>
              <td><strong>الأسبوع الثاني</strong></td>
              <td>مهارة الإملاء الصوتي (س19)</td>
              <td>تطبيقات التجزئة الصوتية على الكلمات المضعفة (allergic, different, dinner) ومسابقات سبورة سريعة.</td>
              <td>إتقان كتابة الكلمات الإملائية المعيارية وتمييز مواضع التضعيف بدقة.</td>
            </tr>
            <tr>
              <td><strong>الأسبوع الثالث</strong></td>
              <td>المفردات والتقييم البعدي</td>
              <td>مراجعة صفات الأماكن والمعاني المتقابلة + تطبيق الاختبار البعدي التكويني (Post-Test) الموازي لرصد التعافي.</td>
              <td>قياس نسبة زوال الفاقد التعليمي واعتماد انتقال الطالب للمستوى المتقن.</td>
            </tr>
          </tbody>
        </table>

        <!-- Section 3: Signatures Box -->
        <div class="print-signatures-box">
          <div class="print-sig-col">
            <div class="role">معلم المادة</div>
            <div class="name">أ. محمود السعيد</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">الموجه الطلابي</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">مدير المدرسة</div>
            <div class="name">أ. ................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">الختم والتوقيع: .....................</div>
          </div>
        </div>
      </div>
    `;

    executeIsolatedPrint(html, 'الخطة_العلاجية_الشاملة_للفاقد_التعليمي');
  }

  // 4. Print Student Remedial Card Modal
  function printStudentRemedialCard(student) {
    if (!student) {
      if (activeStudent) student = activeStudent;
      else return;
    }
    const weakQuestions = student.learning_loss || [];

    let html = `
      <div class="printable-document">
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>بطاقة الخطة العلاجية الفردية للطالب</h1>
            <h2>سجل متابعة ومعالجة الفاقد التعليمي لمادة اللغة الإنجليزية (1448هـ)</h2>
            <p>استمارة التدخل الفردي المعتمدة للتوقيع والمتابعة المنزلية والمدرسية</p>
          </div>
          <div class="side-meta">
            رقم الاستمارة: ${student.class_id}_${student.roster_id}<br>
            تاريخ التشخيص: 1448/01/15هـ<br>
            حالة الطالب: ${student.status}
          </div>
        </div>

        <div class="print-info-grid">
          <div class="print-info-cell"><span class="lbl">اسم الطالب:</span> <span class="val">${student.name}</span></div>
          <div class="print-info-cell"><span class="lbl">الصف الدراسي:</span> <span class="val">${student.class_name}</span></div>
          <div class="print-info-cell"><span class="lbl">رقم الكشف:</span> <span class="val">#${student.roster_id}</span></div>
          <div class="print-info-cell"><span class="lbl">الدرجة المحققة:</span> <span class="val">${student.total_score} / 20 (${student.percentage}%) - ${student.level}</span></div>
        </div>

        <div class="print-section-title">أولاً: مصفوفة تشخيص الفاقد التعليمي والمهارات غير المتقنة</div>
        ${weakQuestions.length === 0 ? `
          <div style="padding: 10px; border: 1px dashed #000; text-align: center; font-weight: bold; margin-bottom: 12px;">
            الطالب متقن لكافة المعايير بنسبة 100% ولا يوجد لديه أي فاقد تعليمي مرصود.
          </div>
        ` : `
          <table class="print-table">
            <thead>
              <tr>
                <th style="width: 40px;">س#</th>
                <th style="width: 130px;">المجال</th>
                <th>المعيار التعليمي المستهدف</th>
                <th style="width: 80px;">إجابة الطالب</th>
                <th style="width: 80px;">الإجابة الصحيحة</th>
              </tr>
            </thead>
            <tbody>
              ${weakQuestions.map(item => `
                <tr>
                  <td class="center"><strong>${item.question_num}</strong></td>
                  <td>${item.skill_ar}</td>
                  <td>${item.standard_ar}</td>
                  <td class="center"><code style="color: #b91c1c; font-weight: bold;">${item.student_answer}</code></td>
                  <td class="center"><code style="color: #15803d; font-weight: bold;">${item.correct_answer}</code></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}

        <div class="print-section-title">ثانياً: خطة التدخل والأنشطة العلاجية الموصوفة للطالب</div>
        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 35px;">م</th>
              <th>المهارة المستهدفة</th>
              <th>الإستراتيجية والنشاط العلاجي المقترح</th>
              <th style="width: 100px;">الجدول الزمني</th>
              <th style="width: 90px;">حالة التحقق</th>
            </tr>
          </thead>
          <tbody>
            ${weakQuestions.slice(0, 4).map((item, idx) => {
              let strat = '';
              if (item.question_num === 13) strat = 'ورقة عمل قاعدة صياغة المستقبل المنفي (won\'t + V1) + لعبة Find & Fix';
              else if (item.question_num === 19) strat = 'التجزئة الصوتية للكلمات ذات الحروف المضعفة (allergic) وبطاقات التلوين';
              else if (item.question_num === 5) strat = 'بطاقات المفردات المتضادة لصفات الأماكن (peaceful vs noisy) وكتابة 3 جمل';
              else if (item.question_num === 16) strat = 'تطبيق قاعدة ميزان تصريف المضارع مع الجمع (We sleep) وتدريبات سريعة';
              else strat = `مراجعة تدريبية مكثفة في معيار ${item.standard_ar} وتكرار نماذج مماثلة`;

              return `
                <tr>
                  <td class="center">${idx + 1}</td>
                  <td>${item.skill_ar} (س${item.question_num})</td>
                  <td>${strat}</td>
                  <td class="center">الأسبوع ${idx === 0 ? 'الأول' : idx === 1 ? 'الثاني' : 'الثالث'}</td>
                  <td class="center">[  ] تم الإتقان</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="print-signatures-box">
          <div class="print-sig-col">
            <div class="role">معلم المادة</div>
            <div class="name">أ. محمود السعيد</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">الموجه الطلابي</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">ولي أمر الطالب بالعلم والمتابعة</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
        </div>
      </div>
    `;

    executeIsolatedPrint(html, `بطاقة_الخطة_العلاجية_الفردية_${student.name}`);
  }

  // 5. Print Class Roster Grade Matrix
  function printClassRoster(classId) {
    const targetCid = classId || currentClassId;
    const cls = DIAGNOSTIC_DATA.classes[targetCid];
    if (!cls) return;

    const students = cls.students;
    const presentCount = students.filter(s => s.status === 'حاضر').length;
    const absentCount = students.filter(s => s.status === 'غائب').length;
    const avgScore = presentCount > 0 ? (students.filter(s => s.status === 'حاضر').reduce((a, b) => a + b.total_score, 0) / presentCount).toFixed(1) : 0;

    let html = `
      <div class="printable-document">
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>كشف رصد درجات الاختبار التشخيصي وتصنيف المهارات</h1>
            <h2>مادة اللغة الإنجليزية — ${cls.name}</h2>
            <p>كشف رسمي مطابق للكشوف الرسمية المعتمدة لعام 1448هـ</p>
          </div>
          <div class="side-meta">
            إجمالي الطلاب: ${cls.total_enrolled}<br>
            الحضور: ${presentCount} | الغياب: ${absentCount}<br>
            متوسط الفصل: ${avgScore} / 20
          </div>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th style="width: 35px;">كشف</th>
              <th>اسم الطالب</th>
              <th style="width: 60px;">الحالة</th>
              <th style="width: 65px;">فهم المقروء (4)</th>
              <th style="width: 65px;">المفردات (6)</th>
              <th style="width: 65px;">القواعد (6)</th>
              <th style="width: 65px;">الإملاء (4)</th>
              <th style="width: 75px;">المجموع (20)</th>
              <th style="width: 60px;">النسبة</th>
              <th style="width: 95px;">مستوى الإتقان</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => {
              if (s.status === 'غائب') {
                return `
                  <tr style="background: #fff0f0;">
                    <td class="center"><strong>#${s.roster_id}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td class="center" style="color: #b91c1c; font-weight: bold;">غائب</td>
                    <td class="center">-</td>
                    <td class="center">-</td>
                    <td class="center">-</td>
                    <td class="center">-</td>
                    <td class="center" style="color: #b91c1c; font-weight: bold;">0 / 20</td>
                    <td class="center">0%</td>
                    <td class="center" style="color: #b91c1c;">غائب بعذر</td>
                  </tr>
                `;
              }
              const rc = s.skills["Reading Comprehension"].earned;
              const voc = s.skills["Vocabulary"].earned;
              const gr = s.skills["Grammar"].earned;
              const orth = s.skills["Orthography"].earned;

              return `
                <tr>
                  <td class="center">#${s.roster_id}</td>
                  <td><strong>${s.name}</strong></td>
                  <td class="center">حاضر</td>
                  <td class="center">${rc}/4</td>
                  <td class="center">${voc}/6</td>
                  <td class="center">${gr}/6</td>
                  <td class="center">${orth}/4</td>
                  <td class="center"><strong>${s.total_score} / 20</strong></td>
                  <td class="center">${s.percentage}%</td>
                  <td class="center">${s.level}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="print-signatures-box">
          <div class="print-sig-col">
            <div class="role">معلم المادة</div>
            <div class="name">أ. محمود السعيد</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">الموجه الطلابي</div>
            <div class="name">................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">التوقيع: .....................</div>
          </div>
          <div class="print-sig-col">
            <div class="role">مدير متوسطة الفلاح بمكة</div>
            <div class="name">أ. ................................</div>
            <div style="margin-top: 15px; font-size: 8pt;">الختم والتوقيع: .....................</div>
          </div>
        </div>
      </div>
    `;

    executeIsolatedPrint(html, `كشف_رصد_${cls.short_name}`);
  }

  // 6. Print Official Parent Notice Slip
  function printParentNotice(student) {
    if (!student) {
      if (activeStudent) student = activeStudent;
      else return;
    }

    const weakQuestions = student.learning_loss || [];

    let html = `
      <div class="printable-document">
        <div class="print-header">
          <div class="side-inst">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div class="center-title">
            <h1>إشعار رسمي بنتيجة الاختبار التشخيصي للغة الإنجليزية</h1>
            <h2>إلى المكرم ولي أمر الطالب / ${student.name} الموقر</h2>
            <p>العام الدراسي 1448هـ — الصف: ${student.class_name}</p>
          </div>
          <div class="side-meta">
            التاريخ: 1448/01/20هـ<br>
            رقم الاستمارة: ${student.class_id}_${student.roster_id}
          </div>
        </div>

        <div style="font-size: 10pt; line-height: 1.8; margin-bottom: 15px;">
          السلام عليكم ورحمة الله وبركاته،،<br>
          انطلاقاً من الشراكة التربوية بين المدرسة والأسرة، يسر إدارة متوسطة الفلاح بمكة المكرمة أن تضع بين أيديكم الكريمة نتيجة ابننا الغالي في الاختبار التشخيصي لمادة اللغة الإنجليزية للعام الدراسي 1448هـ:
        </div>

        <div class="print-info-grid">
          <div class="print-info-cell"><span class="lbl">اسم الطالب:</span> <span class="val">${student.name}</span></div>
          <div class="print-info-cell"><span class="lbl">الصف:</span> <span class="val">${student.class_name}</span></div>
          <div class="print-info-cell"><span class="lbl">الدرجة:</span> <span class="val">${student.total_score} / 20 (${student.percentage}%)</span></div>
          <div class="print-info-cell"><span class="lbl">المستوى:</span> <span class="val">${student.level}</span></div>
        </div>

        <div class="print-section-title">التشخيص والتوجيهات التربوية المشتركة:</div>
        <div style="font-size: 9.5pt; line-height: 1.7; margin-bottom: 15px; border: 1px solid #ccc; padding: 10px; border-radius: 4px;">
          ${student.status === 'غائب' ? `
            • الطالب مسجل كـ "غائب" عن الاختبار. نرجو التواصل مع المدرسة لتحديد موعد الاختبار الاستدراكي.
          ` : weakQuestions.length === 0 ? `
            • ما شاء الله! الطالب أظهر تميزاً استثنائياً وحقق العلامة الكاملة. نرجو الاستمرار في دعمه وتشجيعه.
          ` : `
            • المهارات التي تحتاج لمتابعة وتدريب منزلي: <strong>${weakQuestions.map(w => w.skill_ar + ' (' + w.standard_ar + ')').join(' ، ')}</strong>.<br>
            • نرجو تخصيص 15 دقيقة يومياً لمراجعة التدريبات وتصويب الأخطاء ومتابعة دفتر الطالب.
          `}
        </div>

        <!-- Official Signatures -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div>معلم المادة: <strong>أ. محمود السعيد</strong> (التوقيع: ............)</div>
          <div>مدير المدرسة: <strong>أ. ...........................</strong> (الختم والتوقيع: ............)</div>
        </div>

        <!-- Tear-off slip -->
        <div style="border-top: 2px dashed #444; padding-top: 15px; margin-top: 20px;">
          <div style="text-align: center; font-weight: bold; margin-bottom: 10px; font-size: 10pt;">
            [ قسيمة إشعار استلام وتعهد بالمتابعة — يُرجى توقيعها وإعادتها لإدارة المدرسة ]
          </div>
          <div style="font-size: 9.5pt; line-height: 1.8;">
            أنا ولي أمر الطالب/ <strong>${student.name}</strong> المقيد بالصف/ <strong>${student.class_name}</strong>، أشهد بأنني اطلعت على نتيجة ابني في الاختبار التشخيصي وتوجيهات معلم المادة، وأتعهد بالمتابعة المنزلية المستمرة.<br>
            اسم ولي الأمر: ............................................ التوقيع: .............................. التاريخ: ...... / ...... / 1448هـ
          </div>
        </div>
      </div>
    `;

    executeIsolatedPrint(html, `إشعار_ولي_أمر_الطالب_${student.name}`);
  }

  // -------------------------------------------------------------
  // Student Individual Remedial Dossier Card Modal (Official Printable Layout)
  // -------------------------------------------------------------
  function generateRemedialCard(rosterId, classId) {
    let student = null;
    if (classId && DIAGNOSTIC_DATA.classes[classId]) {
      student = DIAGNOSTIC_DATA.classes[classId].students.find(s => s.roster_id === rosterId);
    }
    if (!student && currentClassId && DIAGNOSTIC_DATA.classes[currentClassId]) {
      student = DIAGNOSTIC_DATA.classes[currentClassId].students.find(s => s.roster_id === rosterId);
    }
    if (!student) {
      for (const cid in DIAGNOSTIC_DATA.classes) {
        student = DIAGNOSTIC_DATA.classes[cid].students.find(s => s.roster_id === rosterId);
        if (student) break;
      }
    }
    if (!student) return;

    renderStudentRemedialCardModal(student);
  }

  function renderStudentRemedialCardModal(student) {
    const weakQuestions = student.learning_loss || [];

    studentRemedialCardBody.innerHTML = `
      <div class="student-remedial-card">
        <!-- Letterhead -->
        <div class="student-card-header">
          <div class="official-side">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div style="text-align: center;">
            <h3 style="font-size: 1.3rem; font-weight: 900; color: var(--text-main);">بطاقة الخطة العلاجية الفردية للطالب</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">سجل متابعة ومعالجة الفاقد التعليمي لمادة اللغة الإنجليزية (1448هـ)</p>
          </div>
          <div class="official-side" style="text-align: left;">
            رقم الاستمارة: ${student.class_id}_${student.roster_id}<br>
            تاريخ التشخيص: 1448/01/15هـ<br>
            حالة الطالب: ${student.status}
          </div>
        </div>

        <!-- Student Meta Grid -->
        <div class="student-card-meta-grid">
          <div class="meta-item">
            <span class="label">اسم الطالب:</span>
            <span class="value">${student.name}</span>
          </div>
          <div class="meta-item">
            <span class="label">الصف الدراسي:</span>
            <span class="value">${student.class_name}</span>
          </div>
          <div class="meta-item">
            <span class="label">رقم الكشف:</span>
            <span class="value">${student.roster_id}</span>
          </div>
          <div class="meta-item">
            <span class="label">الدرجة المحققة:</span>
            <span class="value" style="color: ${student.level_color};">${student.total_score} / 20 (${student.percentage}%)</span>
          </div>
          <div class="meta-item">
            <span class="label">مستوى الإتقان:</span>
            <span class="value">${student.level}</span>
          </div>
        </div>

        <!-- Weakness Diagnosis Section -->
        <div class="report-section">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--primary-light); margin-bottom: 0.5rem;">
            أولاً: مصفوفة تشخيص الفاقد التعليمي والمهارات غير المتقنة
          </h4>
          ${weakQuestions.length === 0 ? `
            <div style="padding: 1.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px; color: var(--success); font-weight: 700;">
              ما شاء الله! الطالب أتقن كافة معايير الاختبار بنسبة 100% ولا يوجد لديه أي فاقد تعليمي مرصود.
            </div>
          ` : `
            <table class="report-table">
              <thead>
                <tr>
                  <th style="width: 50px;">س#</th>
                  <th>المجال المهاري</th>
                  <th>المعيار التعليمي المستهدف</th>
                  <th style="width: 90px; text-align: center;">إجابة الطالب</th>
                  <th style="width: 90px; text-align: center;">الإجابة الصحيحة</th>
                </tr>
              </thead>
              <tbody>
                ${weakQuestions.map(item => `
                  <tr>
                    <td><strong>${item.question_num}</strong></td>
                    <td>${item.skill_ar}</td>
                    <td>${item.standard_ar}</td>
                    <td style="text-align: center;"><code style="color: var(--danger); font-weight: 800;">${item.student_answer}</code></td>
                    <td style="text-align: center;"><code style="color: var(--success); font-weight: 800;">${item.correct_answer}</code></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>

        <!-- Prescribed Intervention Plan -->
        <div class="report-section">
          <h4 style="font-size: 1rem; font-weight: 800; color: var(--primary-light); margin-bottom: 0.5rem;">
            ثانياً: خطة التدخل والأنشطة العلاجية الموصوفة للطالب
          </h4>
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 50px;">م</th>
                <th>المهارة المستهدفة</th>
                <th>الإستراتيجية والنشاط العلاجي المقترح</th>
                <th style="width: 120px;">الجدول الزمني</th>
                <th style="width: 120px;">حالة التحقق</th>
              </tr>
            </thead>
            <tbody>
              ${weakQuestions.slice(0, 4).map((item, idx) => {
                let strat = '';
                if (item.question_num === 13) strat = 'ورقة عمل قاعدة صياغة المستقبل المنفي (won\'t + V1) + لعبة Find & Fix';
                else if (item.question_num === 19) strat = 'التجزئة الصوتية للكلمات ذات الحروف المضعفة (allergic) وبطاقات التلوين';
                else if (item.question_num === 5) strat = 'بطاقات المفردات المتضادة لصفات الأماكن (peaceful vs noisy) وكتابة 3 جمل';
                else if (item.question_num === 16) strat = 'تطبيق قاعدة ميزان تصريف المضارع مع الجمع (We sleep) وتدريبات سريعة';
                else strat = `مراجعة تدريبية مكثفة في معيار ${item.standard_ar} وتكرار نماذج مماثلة`;

                return `
                  <tr>
                    <td><strong>${idx + 1}</strong></td>
                    <td>${item.skill_ar} (س${item.question_num})</td>
                    <td>${strat}</td>
                    <td>الأسبوع ${idx === 0 ? 'الأول' : idx === 1 ? 'الثاني' : 'الثالث'}</td>
                    <td style="text-align: center;">[  ] تم الإتقان</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Signatures Row -->
        <div class="parent-signature-box">
          <div class="sig-box">
            <div class="sig-role">معلم المادة</div>
            <div class="sig-line">التوقيع: ...........................</div>
            <div class="sig-date">التاريخ: 1448 / 01 / ...... هـ</div>
          </div>
          <div class="sig-box">
            <div class="sig-role">الموجه الطلابي / المرشد</div>
            <div class="sig-line">التوقيع: ...........................</div>
            <div class="sig-date">التاريخ: 1448 / 01 / ...... هـ</div>
          </div>
          <div class="sig-box">
            <div class="sig-role">ولي أمر الطالب بالعلم والمتابعة</div>
            <div class="sig-line">التوقيع: ...........................</div>
            <div class="sig-date">التاريخ: 1448 / 01 / ...... هـ</div>
          </div>
        </div>
      </div>
    `;

    studentRemedialCardModal.classList.add('active');
  }

  // -------------------------------------------------------------
  // Master Key Table
  // -------------------------------------------------------------
  function renderMasterKeyTable() {
    const tbody = document.getElementById('masterKeyTableBody');
    const questions = Object.keys(DIAGNOSTIC_DATA.answer_key).map(Number).sort((a, b) => a - b);
    tbody.innerHTML = questions.map(q => {
      const ak = DIAGNOSTIC_DATA.answer_key[q];
      return `
        <tr>
          <td><strong>${q}</strong></td>
          <td><span class="skill-score-pill mid">${skillArMap[ak.skill]}</span></td>
          <td><strong>${ak.std_ar}</strong></td>
          <td style="text-align: center;"><code style="font-size: 1.1rem; font-weight: 800; color: var(--success);">${ak.ans}</code></td>
          <td>${ak.std_ar} — تدريب وتطبيق مكثف لمعالجة الضعف.</td>
        </tr>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // Permanent Final Report Engine (At the End of the Page)
  // -------------------------------------------------------------
  function renderPermanentFinalReport() {
    const allStudents = Object.values(DIAGNOSTIC_DATA.classes).flatMap(c => c.students);

    // 1. Targeted Students List (< 12 / 20)
    const targetedStudents = allStudents
      .filter(s => s.status === 'حاضر' && s.total_score < 12)
      .sort((a, b) => a.total_score - b.total_score);

    targetedStudentsTableBody.innerHTML = targetedStudents.map((s, idx) => {
      const weakSkills = Object.keys(s.skills)
        .filter(k => (s.skills[k].earned / s.skills[k].total) < 0.6)
        .map(k => skillArMap[k])
        .join(' + ') || 'مفاهيم عامة';

      const shortClass = s.class_name.replace('الصف الثاني متوسط / ', 'الصف 2/').replace('الصف الثالث متوسط / ', 'الصف 3/');

      return `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td>${shortClass}</td>
          <td><span class="roster-id-badge">${s.roster_id}</span></td>
          <td><span style="color: var(--danger); font-weight: 800;">${s.total_score} / 20</span> (${s.percentage}%)</td>
          <td>${weakSkills}</td>
          <td>
            <span class="level-tag danger">خطة علاجية مكثفة (3 أسابيع)</span>
          </td>
        </tr>
      `;
    }).join('');

    // 2. Absent Students List
    const absentStudents = allStudents
      .filter(s => s.status === 'غائب')
      .sort((a, b) => a.class_id.localeCompare(b.class_id) || a.roster_id - b.roster_id);

    absentStudentsTableBody.innerHTML = absentStudents.map((s, idx) => {
      const shortClass = s.class_name.replace('الصف الثاني متوسط / ', 'الصف 2/').replace('الصف الثالث متوسط / ', 'الصف 3/');
      return `
        <tr>
          <td><strong>${idx + 1}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td>${shortClass}</td>
          <td><span class="roster-id-badge">${s.roster_id}</span></td>
          <td>غياب بعذر / إجازة مرضية</td>
          <td>الأحد القادم 1448/01/20هـ (الحصة الأولى)</td>
          <td>معلم المادة + الموجه الطلابي</td>
        </tr>
      `;
    }).join('');
  }

  // -------------------------------------------------------------
  // Executive Report Generator (Modal View)
  // -------------------------------------------------------------
  function renderExecutiveReport() {
    const c23 = DIAGNOSTIC_DATA.classes.class_2_3;
    const c24 = DIAGNOSTIC_DATA.classes.class_2_4;
    const c33 = DIAGNOSTIC_DATA.classes.class_3_3;
    const c34 = DIAGNOSTIC_DATA.classes.class_3_4;

    const p23 = c23.students.filter(s => s.status === 'حاضر');
    const p24 = c24.students.filter(s => s.status === 'حاضر');
    const p33 = c33 ? c33.students.filter(s => s.status === 'حاضر') : [];
    const p34 = c34 ? c34.students.filter(s => s.status === 'حاضر') : [];

    const totalStudents = c23.total_enrolled + c24.total_enrolled + (c33 ? c33.total_enrolled : 0) + (c34 ? c34.total_enrolled : 0);
    const totalPresent = p23.length + p24.length + p33.length + p34.length;
    const totalAbsent = c23.absent_count + c24.absent_count + (c33 ? c33.absent_count : 0) + (c34 ? c34.absent_count : 0);

    const avg23 = (p23.reduce((a, b) => a + b.total_score, 0) / p23.length).toFixed(1);
    const avg24 = (p24.reduce((a, b) => a + b.total_score, 0) / p24.length).toFixed(1);
    const avg33 = p33.length ? (p33.reduce((a, b) => a + b.total_score, 0) / p33.length).toFixed(1) : 0;
    const avg34 = p34.length ? (p34.reduce((a, b) => a + b.total_score, 0) / p34.length).toFixed(1) : 0;
    const avgTotal = (((parseFloat(avg23) * p23.length) + (parseFloat(avg24) * p24.length) + (parseFloat(avg33) * p33.length) + (parseFloat(avg34) * p34.length)) / totalPresent).toFixed(1);

    const m23 = p23.filter(s => s.percentage >= 85).length;
    const m24 = p24.filter(s => s.percentage >= 85).length;
    const m33 = p33.filter(s => s.percentage >= 85).length;
    const m34 = p34.filter(s => s.percentage >= 85).length;

    const mid23 = p23.filter(s => s.percentage >= 60 && s.percentage < 85).length;
    const mid24 = p24.filter(s => s.percentage >= 60 && s.percentage < 85).length;
    const mid33 = p33.filter(s => s.percentage >= 60 && s.percentage < 85).length;
    const mid34 = p34.filter(s => s.percentage >= 60 && s.percentage < 85).length;

    const low23 = p23.filter(s => s.percentage < 60).length;
    const low24 = p24.filter(s => s.percentage < 60).length;
    const low33 = p33.filter(s => s.percentage < 60).length;
    const low34 = p34.filter(s => s.percentage < 60).length;

    executiveReportContent.innerHTML = `
      <div class="executive-report-body">
        <!-- Official Header -->
        <div class="report-official-header">
          <div class="official-side">
            <strong>المملكة العربية السعودية</strong><br>
            وزارة التعليم<br>
            الإدارة العامة للتعليم بمنطقة مكة المكرمة<br>
            متوسطة الفلاح بمكة المكرمة
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--text-main);">التقرير التشخيصي لمعالجة الفاقد التعليمي</div>
            <div style="font-size: 0.95rem; color: var(--text-muted);">مادة: اللغة الإنجليزية — الصفوف: الثاني والثالث متوسط (1448هـ)</div>
          </div>
          <div class="official-side" style="text-align: left;">
            التاريخ: 1448/01/15هـ<br>
            الدرجة الكلية: 20 درجة<br>
            عدد الفصول: 4 فصول<br>
            الجهة: قسم الإشراف والتطوير
          </div>
        </div>

        <!-- Executive Summary Cards -->
        <div class="report-section">
          <h3>أولاً: ملخص المؤشرات الإحصائية العامة</h3>
          <table class="diagnostic-table" style="border: 1px solid var(--border-color);">
            <thead>
              <tr>
                <th>البيان</th>
                <th>الصف 2/3</th>
                <th>الصف 2/4</th>
                <th>الصف 3/3</th>
                <th>الصف 3/4</th>
                <th>المجموع / المتوسط العام</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>إجمالي الطلاب المقيدين</strong></td>
                <td>${c23.total_enrolled} طالباً</td>
                <td>${c24.total_enrolled} طالباً</td>
                <td>${c33 ? c33.total_enrolled : 0} طالباً</td>
                <td>${c34 ? c34.total_enrolled : 0} طالباً</td>
                <td><strong>${totalStudents} طالباً</strong></td>
              </tr>
              <tr>
                <td><strong>عدد الحاضرين للأداء</strong></td>
                <td>${p23.length} طالباً (${((p23.length / c23.total_enrolled) * 100).toFixed(1)}%)</td>
                <td>${p24.length} طالباً (${((p24.length / c24.total_enrolled) * 100).toFixed(1)}%)</td>
                <td>${p33.length} طالباً (${c33 ? ((p33.length / c33.total_enrolled) * 100).toFixed(1) : 0}%)</td>
                <td>${p34.length} طالباً (${c34 ? ((p34.length / c34.total_enrolled) * 100).toFixed(1) : 0}%)</td>
                <td><strong>${totalPresent} طالباً (${((totalPresent / totalStudents) * 100).toFixed(1)}%)</strong></td>
              </tr>
              <tr>
                <td><strong>عدد الطلاب الغائبين</strong></td>
                <td>${c23.absent_count} طالبان (#3, #9)</td>
                <td>${c24.absent_count} طلاب (#2, #4, #7, #10, #11, #20)</td>
                <td>${c33 ? c33.absent_count : 0} طلاب (#1, #9, #15, #24)</td>
                <td>${c34 ? c34.absent_count : 0} طلاب (لا يوجد)</td>
                <td><strong>${totalAbsent} طلاب (${((totalAbsent / totalStudents) * 100).toFixed(1)}%)</strong></td>
              </tr>
              <tr>
                <td><strong>متوسط درجات الفصل (من 20)</strong></td>
                <td><strong>${avg23}</strong> (${((avg23 / 20) * 100).toFixed(1)}%)</td>
                <td><strong>${avg24}</strong> (${((avg24 / 20) * 100).toFixed(1)}%)</td>
                <td><strong>${avg33}</strong> (${((avg33 / 20) * 100).toFixed(1)}%)</td>
                <td><strong>${avg34}</strong> (${((avg34 / 20) * 100).toFixed(1)}%)</td>
                <td><strong>${avgTotal}</strong> (${((avgTotal / 20) * 100).toFixed(1)}%)</td>
              </tr>
              <tr>
                <td><strong>الطلاب المتقنون (>= 85%)</strong></td>
                <td>${m23} طلاب</td>
                <td>${m24} طلاب</td>
                <td>${m33} طالباً</td>
                <td>${m34} طالباً</td>
                <td><strong>${m23 + m24 + m33 + m34} طالباً (${(((m23 + m24 + m33 + m34) / totalPresent) * 100).toFixed(1)}%)</strong></td>
              </tr>
              <tr>
                <td><strong>الطلاب المتوسطون (60-84%)</strong></td>
                <td>${mid23} طالباً</td>
                <td>${mid24} طالباً</td>
                <td>${mid33} طالباً</td>
                <td>${mid34} طلاب</td>
                <td><strong>${mid23 + mid24 + mid33 + mid34} طالباً (${(((mid23 + mid24 + mid33 + mid34) / totalPresent) * 100).toFixed(1)}%)</strong></td>
              </tr>
              <tr>
                <td><strong>الطلاب بحاجة لدعم وتدخل (< 60%)</strong></td>
                <td>${low23} طلاب</td>
                <td>${low24} طلاب</td>
                <td>${low33} طالبان</td>
                <td>${low34} طلاب</td>
                <td><strong>${low23 + low24 + low33 + low34} طالباً (${(((low23 + low24 + low33 + low34) / totalPresent) * 100).toFixed(1)}%)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Learning Loss Priorities -->
        <div class="report-section">
          <h3>ثانياً: تحليل الفاقد التعليمي وأولويات التدخل العاجل</h3>
          <p>بناءً على المعالجة الآلية لأوراق وإجابات الطلاب بـ 4 فصول بالمدرسة، تم تحديد المهارات الأكثر تأثيراً في تدني درجات الطلاب والتي تشكل الفاقد التعليمي الحرج بالمدرسة:</p>
          <div class="priority-actions-list" style="margin-top: 0.5rem;">
            <div class="action-item-box" style="border-right: 4px solid var(--danger);">
              <div class="act-header" style="color: var(--danger);">
                <i class="fa-solid fa-1"></i>
                <span>السؤال 13: صياغة النفي في زمن المستقبل (won't) — فاقد القواعد الأول بالمدرسة</span>
              </div>
              <p>الخلل يكمن في عدم استيعاب اختصار will not = won't واستخدام صيغ خاطئة مثل isn't أو not will. التدخل: أوراق عمل مكثفة وخريطة مفاهيمية لمدة أسبوع.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--warning);">
              <div class="act-header" style="color: var(--warning);">
                <i class="fa-solid fa-2"></i>
                <span>السؤال 19: الحروف المضعفة (allergic -> L) — فاقد إملائي صوتي</span>
              </div>
              <p>فاقد إملائي في تذكر الحرف المكرر في الكلمات متعددة المقاطع. التدخل: بطاقات هجائية وقوائم استذكار دورية.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--primary);">
              <div class="act-header" style="color: var(--primary-light);">
                <i class="fa-solid fa-3"></i>
                <span>السؤال 5: صفات الأماكن المعجمية (peaceful) — فاقد المفردات</span>
              </div>
              <p>ضعف في توظيف صفات الأماكن والمشاعر الهادئة مقابل الصاخبة. التدخل: تفعيل القواميس المصورة وسياقات الجمل.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--success);">
              <div class="act-header" style="color: var(--success);">
                <i class="fa-solid fa-4"></i>
                <span>السؤال 16: المضارع البسيط للروتين مع ضمائر الجمع (sleep)</span>
              </div>
              <p>الخلط بين إضافة s لفاعل المفرد والجمع في الجمل الخبرية. التدخل: أنشطة مطابقة الفاعل بالفعل.</p>
            </div>
          </div>
        </div>

        <!-- Skills Breakdown Table -->
        <div class="report-section">
          <h3>ثانياً: تحليل نسب إتقان المهارات اللغوية الأربعة بين الفصول</h3>
          <table class="diagnostic-table" style="border: 1px solid var(--border-color);">
            <thead>
              <tr>
                <th>المجال المهاري</th>
                <th>الصف 2/3</th>
                <th>الصف 2/4</th>
                <th>الصف 3/3</th>
                <th>الصف 3/4</th>
                <th>المتوسط العام</th>
                <th>الحالة التشخيصية</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>فهم المقروء (4 درجات)</strong></td>
                <td>90.6%</td>
                <td>96.4%</td>
                <td>99.0%</td>
                <td>100.0%</td>
                <td><strong>96.6%</strong></td>
                <td><span class="level-tag success">مستوى متقدم ومتقن</span></td>
              </tr>
              <tr>
                <td><strong>المفردات اللغوية (6 درجات)</strong></td>
                <td>61.1%</td>
                <td>63.5%</td>
                <td>78.5%</td>
                <td>83.3%</td>
                <td><strong>72.3%</strong></td>
                <td><span class="level-tag success">مستوى جيد جداً ومتمكن</span></td>
              </tr>
              <tr>
                <td><strong>القواعد والتراكيب (6 درجات)</strong></td>
                <td>58.3%</td>
                <td>61.1%</td>
                <td>72.2%</td>
                <td>81.0%</td>
                <td><strong>68.9%</strong></td>
                <td><span class="level-tag warning">فاقد في نفي المستقبل والروتين</span></td>
              </tr>
              <tr>
                <td><strong>الرسم الإملائي (4 درجات)</strong></td>
                <td>51.0%</td>
                <td>57.1%</td>
                <td>64.6%</td>
                <td>80.4%</td>
                <td><strong>64.2%</strong></td>
                <td><span class="level-tag danger">أولوية تدخل علاجي مكثف</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Learning Loss Priorities -->
        <div class="report-section">
          <h3>ثالثاً: تحليل الفاقد التعليمي وأولويات التدخل العاجل (الحاضرون 97 طالباً)</h3>
          <p>بناءً على المعالجة الآلية المصححة لأوراق طلاب الفصول الأربعة (97 حاضراً)، تم ترتيب المهارات الأكثر تأثيراً في تدني درجات الطلاب بالمدرسة:</p>
          <div class="priority-actions-list" style="margin-top: 0.5rem;">
            <div class="action-item-box" style="border-right: 4px solid var(--danger);">
              <div class="act-header" style="color: var(--danger);">
                <i class="fa-solid fa-1"></i>
                <span>السؤال 13: صياغة النفي في زمن المستقبل البسيط (won't) — فاقد القواعد الأول (58 طالباً - 59.8%)</span>
              </div>
              <p>الخلل يكمن في عدم استيعاب دمج will not لتصبح won't واستخدام صيغ خاطئة مثل isn't will أو not will. التدخل: أوراق عمل مكثفة وخريطة مفاهيمية لمدة أسبوع.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--danger);">
              <div class="act-header" style="color: var(--danger);">
                <i class="fa-solid fa-2"></i>
                <span>السؤال 19: الحروف المضعفة في الكلمات الشائعة (allergic -> L) — فاقد إملائي صوتي (51 طالباً - 52.6%)</span>
              </div>
              <p>فاقد إملائي في تمييز الحرف المكرر في الكلمات متعددة المقاطع. التدخل: تقنية التجزئة المقطعية الصوتية (Chunking) وبطاقات التلوين الإملائي.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--warning);">
              <div class="act-header" style="color: var(--warning);">
                <i class="fa-solid fa-3"></i>
                <span>السؤال 16: المضارع البسيط للروتين مع ضمائر الجمع (We sleep) — فاقد القواعد (42 طالباً - 43.3%)</span>
              </div>
              <p>الخلط الميكانيكي بين إضافة s الشخص الثالث لفاعل المفرد وتجريد الفعل مع الجمع. التدخل: أنشطة ميزان الفاعل ومسابقات الاختيار السريع.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid var(--primary);">
              <div class="act-header" style="color: var(--primary-light);">
                <i class="fa-solid fa-4"></i>
                <span>السؤال 5: صفات الأماكن والمعاني المعجمية (peaceful vs noisy) — فاقد المفردات (40 طالباً - 41.2%)</span>
              </div>
              <p>ضعف في الحصيلة المعجمية لصفات الهدوء مقابل الصخب. التدخل: تفعيل القواميس المصورة وسياقات الضد والترادف في جمل حياتية.</p>
            </div>
            <div class="action-item-box" style="border-right: 4px solid #8b5cf6;">
              <div class="act-header" style="color: #8b5cf6;">
                <i class="fa-solid fa-5"></i>
                <span>السؤال 18: تهجئة مفردات الطوارئ والحوادث (emergency -> m) — فاقد إملائي (37 طالباً - 38.1%)</span>
              </div>
              <p>صعوبة تهجئة الكلمات الطويلة واسترجاع الحروف الساكنة. التدخل: قوائم التهجئة المصغرة والإملاء المنظور اليومي.</p>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="report-section">
          <h3>رابعاً: التوصيات الإدارية والتربوية المعتمدة</h3>
          <ul style="padding-right: 1.5rem; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
            <li><strong>تنفيذ خطة المعالجة الصباحية:</strong> تخصيص 10 دقائق من بداية كل حصة لغة إنجليزية لتطبيق الأنشطة العلاجية المقننة وفق بطاقات الفاقد الفردية.</li>
            <li><strong>الاختبارات الاستدراكية للغائبين:</strong> تكليف معلم المادة بحصر الطلاب الـ 12 الغائبين بعذر وتطبيق الاختبار التشخيصي لهم قبل نهاية الأسبوع القادم.</li>
            <li><strong>برنامج الإثراء ورعاية الموهوبين:</strong> إشراك الطلاب الـ 36 المتقنين (وخاصة الـ 15 الحاصلين على الدرجة الكاملة 20/20) في دور "المعلم الصغير" ونادي المحادثة.</li>
            <li><strong>المتابعة الأسرية الفاعلة:</strong> تزويد أولياء أمور الطلاب الـ 20 المحتاجين لدعم برسائل توجيهية وخطط المتابعة المنزلية عبر الواتساب.</li>
            <li><strong>إعادة القياس التكويني (Post-Test):</strong> تطبيق اختبار بعدي مقنن بعد 3 أسابيع من تنفيذ الخطة العلاجية لقياس نسبة تعافي الفاقد التعليمي.</li>
          </ul>
        </div>
      </div>
    `;

    executiveReportModal.classList.add('active');
  }

  // Combined Excel / CSV Exporter
  function exportCombinedCsv() {
    const allStudents = Object.values(DIAGNOSTIC_DATA.classes).flatMap(c => c.students);

    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += 'الصف,رقم الكشف,اسم الطالب,الحالة,فهم المقروء (4),المفردات (6),القواعد (6),الإملاء (4),المجموع الكلي (20),النسبة المئوية,مستوى الإتقان,عدد الأسئلة الخاطئة,أبرز مهارات الفاقد\r\n';

    allStudents.forEach(s => {
      if (s.status === 'غائب') {
        csvContent += `"${s.class_name}","${s.roster_id}","${s.name}","غائب","0","0","0","0","0","0%","غائب","20","غياب عن الاختبار"\r\n`;
      } else {
        const rc = s.skills["Reading Comprehension"].earned;
        const voc = s.skills["Vocabulary"].earned;
        const gr = s.skills["Grammar"].earned;
        const orth = s.skills["Orthography"].earned;
        const weakSkills = s.learning_loss.map(item => `س${item.question_num}`).join(' - ');

        csvContent += `"${s.class_name}","${s.roster_id}","${s.name}","حاضر","${rc}","${voc}","${gr}","${orth}","${s.total_score}","${s.percentage}%","${s.level}","${s.learning_loss.length}","${weakSkills}"\r\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'تقرير_الفاقد_التعليمي_الشامل_لكافة_الطلاب.csv');
    document.body.appendChild(link);
    link.click();
  }

  // Event Listeners Setup
  function setupEventListeners() {
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Class Tabs
    document.querySelectorAll('.class-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.class-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentClassId = btn.getAttribute('data-class');
        renderClassData();
      });
    });

    // Jump to Final Report button in header
    btnJumpToFinalReport.addEventListener('click', () => {
      finalReportSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Search and Filters
    searchInput.addEventListener('input', () => renderClassData());
    levelFilter.addEventListener('change', () => renderClassData());
    sortFilter.addEventListener('change', () => renderClassData());

    // Clear Question Filter
    clearChartFilterBtn.addEventListener('click', clearQuestionFilter);

    // Modals
    modalCloseBtn.addEventListener('click', closeStudentModal);
    studentModal.addEventListener('click', (e) => {
      if (e.target === studentModal) closeStudentModal();
    });

    showKeyBtn.addEventListener('click', () => masterKeyModal.classList.add('active'));
    keyModalCloseBtn.addEventListener('click', () => masterKeyModal.classList.remove('active'));
    masterKeyModal.addEventListener('click', (e) => {
      if (e.target === masterKeyModal) masterKeyModal.classList.remove('active');
    });

    showReportBtn.addEventListener('click', renderExecutiveReport);
    reportModalCloseBtn.addEventListener('click', () => executiveReportModal.classList.remove('active'));
    executiveReportModal.addEventListener('click', (e) => {
      if (e.target === executiveReportModal) executiveReportModal.classList.remove('active');
    });

    // Remedial Card Modal Close
    remedialCardModalCloseBtn.addEventListener('click', () => studentRemedialCardModal.classList.remove('active'));
    studentRemedialCardModal.addEventListener('click', (e) => {
      if (e.target === studentRemedialCardModal) studentRemedialCardModal.classList.remove('active');
    });

    // Student Modal Inner Tabs
    document.querySelectorAll('.inner-tab').forEach(b => {
      b.addEventListener('click', () => switchInnerTab(b.getAttribute('data-tab')));
    });

    // Evidence Page Toggles
    btnShowPage1.addEventListener('click', () => {
      evidenceCurrentPage = 1;
      updateEvidenceImage();
    });
    btnShowPage2.addEventListener('click', () => {
      evidenceCurrentPage = 2;
      updateEvidenceImage();
    });
    btnShowBothPages.addEventListener('click', () => {
      evidenceCurrentPage = 'both';
      updateEvidenceImage();
    });

    // Evidence Zoom Controls
    btnZoomIn.addEventListener('click', () => {
      evidenceZoomLevel = Math.min(2.5, evidenceZoomLevel + 0.25);
      applyEvidenceZoom();
    });
    btnZoomOut.addEventListener('click', () => {
      evidenceZoomLevel = Math.max(0.6, evidenceZoomLevel - 0.25);
      applyEvidenceZoom();
    });
    btnZoomReset.addEventListener('click', () => {
      evidenceZoomLevel = 1.0;
      applyEvidenceZoom();
    });

    // Print Center & Selective Print Event Listeners
    if (btnPrintCenter) btnPrintCenter.addEventListener('click', openPrintCenterModal);
    if (printCenterCloseBtn) printCenterCloseBtn.addEventListener('click', closePrintCenterModal);
    if (printCenterModal) {
      printCenterModal.addEventListener('click', (e) => {
        if (e.target === printCenterModal) closePrintCenterModal();
      });
    }

    if (btnPCPrintExecutive) {
      btnPCPrintExecutive.addEventListener('click', () => {
        closePrintCenterModal();
        printExecutiveReport();
      });
    }
    if (btnPCPrintRemedial) {
      btnPCPrintRemedial.addEventListener('click', () => {
        closePrintCenterModal();
        printRemedialPlan();
      });
    }
    if (btnPCPrintClassRoster) {
      btnPCPrintClassRoster.addEventListener('click', () => {
        closePrintCenterModal();
        printClassRoster(currentClassId);
      });
    }
    if (btnPCPrintActiveStudent) {
      btnPCPrintActiveStudent.addEventListener('click', () => {
        closePrintCenterModal();
        printStudentDossier(activeStudent, true);
      });
    }

    // Direct Selective Print Buttons in Interface
    if (modalPrintBtn) {
      modalPrintBtn.addEventListener('click', () => {
        printStudentDossier(activeStudent, true);
      });
    }
    if (btnStudentRemedialPrint) {
      btnStudentRemedialPrint.addEventListener('click', () => {
        if (activeStudent) {
          renderStudentRemedialCardModal(activeStudent);
        }
      });
    }
    if (btnPrintRemedialCardModal) {
      btnPrintRemedialCardModal.addEventListener('click', () => {
        printStudentRemedialCard(activeStudent);
      });
    }
    if (btnPrintRemedialHub) {
      btnPrintRemedialHub.addEventListener('click', () => {
        printRemedialPlan();
      });
    }
    if (btnPrintFinalReportOfficial) {
      btnPrintFinalReportOfficial.addEventListener('click', () => {
        printExecutiveReport();
      });
    }
    if (btnPrintExecutiveReportModal) {
      btnPrintExecutiveReportModal.addEventListener('click', () => {
        printExecutiveReport();
      });
    }
    if (btnPrintCurrentClassRoster) {
      btnPrintCurrentClassRoster.addEventListener('click', () => {
        printClassRoster(currentClassId);
      });
    }

    // Parent Message Listeners (Inside Student Modal)
    if (btnParentMessage) {
      btnParentMessage.addEventListener('click', () => {
        switchInnerTab('parent_message');
      });
    }
    if (btnCopyParentMessage) {
      btnCopyParentMessage.addEventListener('click', () => {
        copyToClipboard(parentMessageTextarea.value, copyFeedbackToast);
      });
    }
    if (btnSendWhatsappDirect) {
      btnSendWhatsappDirect.addEventListener('click', () => {
        sendWhatsAppDirect(parentMessageTextarea.value);
      });
    }
    if (btnCopySmsMessage) {
      btnCopySmsMessage.addEventListener('click', () => {
        copyToClipboard(generateParentMessage(activeStudent, 'sms'), copyFeedbackToast);
      });
    }

    // Parent Message Listeners (Standalone Modal)
    if (pmModalCloseBtn) pmModalCloseBtn.addEventListener('click', closeParentMessageModal);
    if (parentMessageModal) {
      parentMessageModal.addEventListener('click', (e) => {
        if (e.target === parentMessageModal) closeParentMessageModal();
      });
    }
    if (pmModalCopyBtn) {
      pmModalCopyBtn.addEventListener('click', () => {
        copyToClipboard(pmModalTextarea.value, pmModalCopyToast);
      });
    }
    if (pmModalWhatsappBtn) {
      pmModalWhatsappBtn.addEventListener('click', () => {
        sendWhatsAppDirect(pmModalTextarea.value);
      });
    }
    if (pmModalSmsBtn) {
      pmModalSmsBtn.addEventListener('click', () => {
        copyToClipboard(generateParentMessage(activeStudent, 'sms'), pmModalCopyToast);
      });
    }
    if (pmModalPrintNoticeBtn) {
      pmModalPrintNoticeBtn.addEventListener('click', () => {
        printParentNotice(activeStudent);
      });
    }

    // Export CSV Buttons
    exportCsvBtn.addEventListener('click', () => {
      let file = 'تقرير_الفاقد_التعليمي_فصل_2_3.csv';
      if (currentClassId === 'class_2_4') file = 'تقرير_الفاقد_التعليمي_فصل_2_4.csv';
      else if (currentClassId === 'class_3_3') file = 'تقرير_الفاقد_التعليمي_فصل_3_3.csv';
      else if (currentClassId === 'class_3_4') file = 'تقرير_الفاقد_التعليمي_فصل_3_4.csv';
      else if (currentClassId === 'comparison' || currentClassId === 'final_report') {
        exportCombinedCsv();
        return;
      }
      const a = document.createElement('a');
      a.href = file;
      a.download = file;
      a.click();
    });

    btnExportAllCsv.addEventListener('click', exportCombinedCsv);

    // ESC Key to close any open modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeStudentModal();
        closeParentMessageModal();
        closePrintCenterModal();
        masterKeyModal.classList.remove('active');
        executiveReportModal.classList.remove('active');
        studentRemedialCardModal.classList.remove('active');
      }
    });
  }

  // Global exposure for inline HTML event handlers
  window.app = {
    openStudentModal,
    generateRemedialCard,
    openParentMessageModal,
    openPrintCenterModal,
    closePrintCenterModal,
    printStudentDossier,
    printExecutiveReport,
    printRemedialPlan,
    printClassRoster,
    printParentNotice,
    printStudentRemedialCard,
    filterByQuestion: applyQuestionFilter
  };

  document.addEventListener('DOMContentLoaded', init);
})();
