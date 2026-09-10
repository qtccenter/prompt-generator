// ============================================
// GAS Web App Prompt Generator - Dynamic Steps
// ============================================

let currentStep = 1;
const totalSteps = 6;
let lastRenderedType = null;

// ========== TYPE CONFIGURATIONS ==========

const TYPE_CONFIG = {
    dashboard: {
        labels: ['ประเภทแอป', 'แหล่งข้อมูล', 'Widgets & กราฟ', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'storage', title: 'แหล่งข้อมูล', subtitle: 'กำหนด Google Sheets ที่ต้องการดึงข้อมูลมาแสดงบน Dashboard' },
        step3: { icon: 'widgets', title: 'Widgets & กราฟ', subtitle: 'เลือก Widget และกราฟที่ต้องการแสดงบน Dashboard' },
    },
    form: {
        labels: ['ประเภทแอป', 'ฟิลด์ในฟอร์ม', 'การบันทึก & แจ้งเตือน', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'edit_note', title: 'ฟิลด์ในฟอร์ม', subtitle: 'กำหนดฟิลด์ที่ต้องการให้ผู้ใช้กรอกข้อมูล' },
        step3: { icon: 'save', title: 'การบันทึก & แจ้งเตือน', subtitle: 'กำหนดรูปแบบการบันทึกและการแจ้งเตือนหลังกรอกฟอร์ม' },
    },
    display: {
        labels: ['ประเภทแอป', 'แหล่งข้อมูล', 'การแสดงผล', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'storage', title: 'แหล่งข้อมูล', subtitle: 'กำหนด Google Sheets ที่ต้องการดึงข้อมูลมาแสดง' },
        step3: { icon: 'table_view', title: 'การแสดงผล', subtitle: 'กำหนดรูปแบบการแสดงผลข้อมูลในตาราง' },
    },
    crud: {
        labels: ['ประเภทแอป', 'โครงสร้างข้อมูล', 'ฟีเจอร์จัดการข้อมูล', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'build_circle', title: 'โครงสร้างข้อมูล', subtitle: 'กำหนดฟิลด์ข้อมูลที่ใช้ทั้งในฟอร์มและตาราง' },
        step3: { icon: 'tune', title: 'ฟีเจอร์จัดการข้อมูล', subtitle: 'เลือกฟีเจอร์สำหรับการจัดการข้อมูล CRUD' },
    },
    report: {
        labels: ['ประเภทแอป', 'แหล่งข้อมูล', 'รายงาน & Export', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'storage', title: 'แหล่งข้อมูล', subtitle: 'กำหนด Google Sheets ที่ต้องการดึงข้อมูลมาสร้างรายงาน' },
        step3: { icon: 'summarize', title: 'รายงาน & Export', subtitle: 'กำหนดรูปแบบรายงานและการ Export' },
    },
    approval: {
        labels: ['ประเภทแอป', 'แบบฟอร์ม & ลำดับอนุมัติ', 'Workflow & แจ้งเตือน', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'fact_check', title: 'แบบฟอร์มคำขอ & ลำดับอนุมัติ', subtitle: 'กำหนดฟิลด์ในฟอร์มคำขอและลำดับขั้นการอนุมัติ' },
        step3: { icon: 'route', title: 'Workflow & แจ้งเตือน', subtitle: 'กำหนดการทำงานของ Workflow และการแจ้งเตือน' },
    },
    inventory: {
        labels: ['ประเภทแอป', 'ข้อมูลสินค้า', 'การจัดการสต็อก', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'inventory_2', title: 'ข้อมูลสินค้า', subtitle: 'กำหนดฟิลด์ข้อมูลสินค้าและหมวดหมู่' },
        step3: { icon: 'swap_horiz', title: 'การจัดการสต็อก', subtitle: 'กำหนดฟีเจอร์การเบิก-จ่ายและแจ้งเตือนสต็อก' },
    },
    booking: {
        labels: ['ประเภทแอป', 'ทรัพยากร & เวลา', 'กฎ & ฟีเจอร์การจอง', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'event_available', title: 'ทรัพยากร & เวลา', subtitle: 'กำหนดทรัพยากรที่จองได้และช่วงเวลา' },
        step3: { icon: 'rule', title: 'กฎ & ฟีเจอร์การจอง', subtitle: 'กำหนดกฎการจองและฟีเจอร์เสริม' },
    },
    attendance: {
        labels: ['ประเภทแอป', 'ข้อมูลพนักงาน & เวลางาน', 'ฟีเจอร์ลงเวลา', 'UI & ธีม', 'รายละเอียด', 'สร้าง Prompt'],
        step2: { icon: 'badge', title: 'ข้อมูลพนักงาน & เวลางาน', subtitle: 'กำหนดข้อมูลพนักงานและเวลาทำงาน' },
        step3: { icon: 'fingerprint', title: 'ฟีเจอร์ลงเวลา', subtitle: 'เลือกฟีเจอร์สำหรับระบบลงเวลา Check-in/Check-out' },
    },
};

// ========== FIELD TYPE OPTIONS ==========

const FIELD_TYPES = [
    { value: 'text', label: 'ข้อความ (Text)' },
    { value: 'number', label: 'ตัวเลข (Number)' },
    { value: 'email', label: 'อีเมล (Email)' },
    { value: 'tel', label: 'เบอร์โทร (Tel)' },
    { value: 'date', label: 'วันที่ (Date)' },
    { value: 'time', label: 'เวลา (Time)' },
    { value: 'datetime', label: 'วันที่และเวลา' },
    { value: 'textarea', label: 'ข้อความยาว (Textarea)' },
    { value: 'dropdown', label: 'ตัวเลือก (Dropdown)' },
    { value: 'radio', label: 'ตัวเลือก (Radio)' },
    { value: 'checkbox', label: 'เช็คบ็อกซ์ (Checkbox)' },
    { value: 'file', label: 'ไฟล์แนบ (File Upload)' },
];

const FIELD_TYPE_OPTIONS = FIELD_TYPES.map(t => `<option value="${t.value}">${t.label}</option>`).join('');

// ========== REUSABLE HTML BUILDERS ==========

function sheetsConfigHtml(showColumnsHint) {
    const hint = showColumnsHint || 'ใส่ชื่อ header ของแต่ละคอลัมน์ คั่นด้วย comma';
    return `
        <div class="form-group">
            <label class="form-label">
                <span class="material-icons-round">link</span>
                Google Sheets ID <span class="hint">(จาก URL ของ Google Sheets)</span>
            </label>
            <input type="text" id="sheetsId" class="form-input" placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms">
            <small class="form-hint">คัดลอกจาก URL: https://docs.google.com/spreadsheets/d/<strong>[SHEETS_ID]</strong>/edit</small>
        </div>
        <div id="sheets-container">
            <div class="sheet-entry" data-index="0">
                <div class="sheet-header">
                    <h3><span class="material-icons-round">table_chart</span> ชีทที่ 1</h3>
                </div>
                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="form-label">ชื่อชีท</label>
                        <input type="text" class="form-input sheet-name" placeholder="เช่น Sheet1, รายชื่อพนักงาน">
                    </div>
                    <div class="form-group flex-1">
                        <label class="form-label">วัตถุประสงค์</label>
                        <input type="text" class="form-input sheet-purpose" placeholder="เช่น เก็บข้อมูลพนักงาน">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">คอลัมน์ (Column Headers)</label>
                    <input type="text" class="form-input sheet-columns" placeholder="เช่น ID, ชื่อ, นามสกุล, ตำแหน่ง (คั่นด้วย comma)">
                    <small class="form-hint">${hint}</small>
                </div>
            </div>
        </div>
        <button type="button" class="btn-add" onclick="addSheet()">
            <span class="material-icons-round">add_circle</span> เพิ่มชีท
        </button>
    `;
}

function formFieldsBuilderHtml(title, subtitle) {
    return `
        <div class="form-group">
            <label class="form-label">
                <span class="material-icons-round">link</span>
                Google Sheets ID <span class="hint">(จาก URL ของ Google Sheets)</span>
            </label>
            <input type="text" id="sheetsId" class="form-input" placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms">
        </div>
        <div class="form-group">
            <label class="form-label">ชื่อชีทที่จะบันทึกข้อมูล</label>
            <input type="text" id="targetSheet" class="form-input" placeholder="เช่น Sheet1, ข้อมูลพนักงาน">
        </div>
        <h3 class="sub-heading"><span class="material-icons-round" style="font-size:1.2rem">input</span> ฟิลด์ในฟอร์ม</h3>
        <div class="info-box">
            <span class="material-icons-round">info</span>
            <span>กำหนดฟิลด์ที่ต้องการให้ผู้ใช้กรอก — ชื่อฟิลด์จะถูกใช้เป็น Column Header ใน Google Sheets ด้วย</span>
        </div>
        <div id="fields-container"></div>
        <button type="button" class="btn-add" onclick="addField()">
            <span class="material-icons-round">add_circle</span> เพิ่มฟิลด์
        </button>
    `;
}

function fieldEntryHtml(index) {
    return `
        <div class="field-entry" data-index="${index}">
            <div class="field-entry-header">
                <h4><span class="material-icons-round">input</span> ฟิลด์ที่ ${index + 1}</h4>
                ${index > 0 ? `<button type="button" class="btn-icon" onclick="removeField(this)"><span class="material-icons-round">close</span></button>` : ''}
            </div>
            <div class="field-row">
                <div class="form-group fg-name">
                    <label class="form-label">ชื่อฟิลด์</label>
                    <input type="text" class="form-input field-name" placeholder="เช่น ชื่อ-นามสกุล, วันที่, แผนก">
                </div>
                <div class="form-group fg-type">
                    <label class="form-label">ประเภท</label>
                    <select class="form-input field-type" onchange="toggleFieldOptions(this)">${FIELD_TYPE_OPTIONS}</select>
                </div>
                <div class="form-group fg-required">
                    <label class="checkbox-inline"><input type="checkbox" class="field-required" checked> จำเป็น</label>
                </div>
            </div>
            <div class="field-options-row">
                <div class="form-group">
                    <label class="form-label">ตัวเลือก</label>
                    <input type="text" class="form-input field-options" placeholder="เช่น ฝ่ายบุคคล, ฝ่ายการเงิน, ฝ่ายไอที (คั่นด้วย comma)">
                    <small class="form-hint">ใส่ตัวเลือกคั่นด้วย comma — หรือพิมพ์ "จากชีท:ชื่อชีท" เพื่อดึงจาก Google Sheets</small>
                </div>
            </div>
        </div>
    `;
}

function featureGridHtml(features) {
    return `<div class="feature-grid">${features.map(f =>
        `<label class="feature-item">
            <input type="checkbox" name="features" value="${f.value}">
            <div class="feature-inner">
                <span class="material-icons-round">${f.icon}</span>
                <span>${f.label}</span>
            </div>
        </label>`
    ).join('')}</div>`;
}

// ========== STEP 2 RENDERERS ==========

function renderStep2(type) {
    const cfg = TYPE_CONFIG[type].step2;
    let html = `<div class="section-header">
        <span class="material-icons-round section-icon">${cfg.icon}</span>
        <div><h2>${cfg.title}</h2><p>${cfg.subtitle}</p></div>
    </div>`;

    switch (type) {
        case 'form':
            html += formFieldsBuilderHtml();
            break;
        case 'crud':
            html += formFieldsBuilderHtml();
            html += `<div class="info-box" style="margin-top:1rem">
                <span class="material-icons-round">info</span>
                <span>ฟิลด์เหล่านี้จะแสดงทั้งในฟอร์มกรอกข้อมูลและในตารางแสดงข้อมูล</span>
            </div>`;
            break;
        case 'approval':
            html += formFieldsBuilderHtml();
            html += `
                <h3 class="sub-heading" style="margin-top:1.5rem"><span class="material-icons-round" style="font-size:1.2rem">approval</span> ลำดับขั้นการอนุมัติ</h3>
                <div id="levels-container"></div>
                <button type="button" class="btn-add" onclick="addApprovalLevel()">
                    <span class="material-icons-round">add_circle</span> เพิ่มลำดับอนุมัติ
                </button>
            `;
            break;
        case 'inventory':
            html += formFieldsBuilderHtml();
            html += `
                <h3 class="sub-heading"><span class="material-icons-round" style="font-size:1.2rem">category</span> หมวดหมู่และหน่วยนับ</h3>
                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="form-label">หมวดหมู่สินค้า</label>
                        <input type="text" id="inventoryCategories" class="form-input" placeholder="เช่น อุปกรณ์สำนักงาน, อิเล็กทรอนิกส์, วัสดุสิ้นเปลือง (คั่นด้วย comma)">
                    </div>
                    <div class="form-group flex-1">
                        <label class="form-label">หน่วยนับ</label>
                        <input type="text" id="inventoryUnits" class="form-input" placeholder="เช่น ชิ้น, กล่อง, แพ็ค, ม้วน (คั่นด้วย comma)">
                    </div>
                </div>
            `;
            html += `<div class="info-box" style="margin-top:1rem">
                <span class="material-icons-round">info</span>
                <span>ฟิลด์พื้นฐานเช่น "จำนวนคงเหลือ" จะถูกเพิ่มให้อัตโนมัติ — ให้กำหนดเฉพาะฟิลด์ข้อมูลสินค้า</span>
            </div>`;
            break;
        case 'booking':
            html += `
                <div class="form-group">
                    <label class="form-label"><span class="material-icons-round">link</span> Google Sheets ID</label>
                    <input type="text" id="sheetsId" class="form-input" placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms">
                </div>
                <h3 class="sub-heading"><span class="material-icons-round" style="font-size:1.2rem">meeting_room</span> ทรัพยากรที่จองได้</h3>
                <div class="info-box">
                    <span class="material-icons-round">info</span>
                    <span>ระบุรายการทรัพยากรที่ผู้ใช้สามารถจองได้ เช่น ห้องประชุม, อุปกรณ์, ยานพาหนะ</span>
                </div>
                <div class="form-group">
                    <label class="form-label">ประเภททรัพยากร</label>
                    <input type="text" id="resourceType" class="form-input" placeholder="เช่น ห้องประชุม, รถยนต์, โปรเจคเตอร์">
                </div>
                <div class="form-group">
                    <label class="form-label">รายการทรัพยากร</label>
                    <input type="text" id="resourceList" class="form-input" placeholder="เช่น ห้อง A, ห้อง B, ห้อง C (คั่นด้วย comma)">
                </div>
                <h3 class="sub-heading"><span class="material-icons-round" style="font-size:1.2rem">schedule</span> การตั้งค่าเวลา</h3>
                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="form-label">ช่วงเวลาเปิดจอง</label>
                        <input type="text" id="bookingHours" class="form-input" placeholder="เช่น 08:00 - 18:00">
                    </div>
                    <div class="form-group flex-1">
                        <label class="form-label">หน่วยเวลาจอง</label>
                        <select id="bookingUnit" class="form-input">
                            <option value="30min">ทุก 30 นาที</option>
                            <option value="1hour" selected>ทุก 1 ชั่วโมง</option>
                            <option value="halfday">ครึ่งวัน (เช้า/บ่าย)</option>
                            <option value="fullday">เต็มวัน</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">ข้อมูลเพิ่มเติมที่ต้องกรอกตอนจอง</label>
                    <input type="text" id="bookingFields" class="form-input" placeholder="เช่น ชื่อผู้จอง, แผนก, จุดประสงค์ (คั่นด้วย comma)">
                </div>
            `;
            break;
        case 'attendance':
            html += `
                <div class="form-group">
                    <label class="form-label"><span class="material-icons-round">link</span> Google Sheets ID</label>
                    <input type="text" id="sheetsId" class="form-input" placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms">
                </div>
                <div class="form-row">
                    <div class="form-group flex-1">
                        <label class="form-label">ชีทบันทึกเวลา</label>
                        <input type="text" id="targetSheet" class="form-input" placeholder="เช่น Attendance, บันทึกเวลา">
                    </div>
                    <div class="form-group flex-1">
                        <label class="form-label">ชีทข้อมูลพนักงาน</label>
                        <input type="text" id="employeeSheet" class="form-input" placeholder="เช่น Employees, รายชื่อพนักงาน">
                    </div>
                </div>
                <div class="info-box">
                    <span class="material-icons-round">info</span>
                    <span>สูตรคำนวณเวลา เช่น ชั่วโมงทำงาน, OT, มาสาย แนะนำให้ใส่สูตรตรงใน Google Sheets เพื่อความยืดหยุ่นสูงสุด</span>
                </div>
                <h3 class="sub-heading"><span class="material-icons-round" style="font-size:1.2rem">how_to_reg</span> วิธีลงเวลา</h3>
            `;
            html += featureGridHtml([
                { value: 'manual-checkin', icon: 'touch_app', label: 'กดปุ่ม Check-in/Check-out' },
                { value: 'qr-checkin', icon: 'qr_code_scanner', label: 'สแกน QR Code' },
                { value: 'gps-checkin', icon: 'my_location', label: 'บันทึกตำแหน่ง GPS' },
            ]);
            html += `
                <div class="form-group" style="margin-top:1rem">
                    <label class="form-label">ข้อมูลพนักงานที่ต้องการเก็บ</label>
                    <input type="text" id="employeeFields" class="form-input" placeholder="เช่น รหัสพนักงาน, ชื่อ-นามสกุล, แผนก, ตำแหน่ง (คั่นด้วย comma)">
                </div>
            `;
            break;
        default: // dashboard, display, report
            html += sheetsConfigHtml();
            break;
    }

    document.getElementById('step-2-content').innerHTML = html;

    // Initialize dynamic lists
    if (['form', 'crud', 'approval', 'inventory'].includes(type)) {
        addField(); // add first field
        if (type === 'approval') addApprovalLevel(); // add first level
    }
}

// ========== STEP 3 RENDERERS ==========

function renderStep3(type) {
    const cfg = TYPE_CONFIG[type].step3;
    let html = `<div class="section-header">
        <span class="material-icons-round section-icon">${cfg.icon}</span>
        <div><h2>${cfg.title}</h2><p>${cfg.subtitle}</p></div>
    </div>`;

    switch (type) {
        case 'dashboard':
            html += `
                <h3 class="sub-heading">Summary Cards (ข้อมูลสรุป)</h3>
                <div class="form-group">
                    <label class="form-label">การ์ดสรุปที่ต้องการแสดง</label>
                    <input type="text" id="dashCards" class="form-input" placeholder="เช่น จำนวนพนักงานทั้งหมด, ยอดขายเดือนนี้, จำนวนออเดอร์วันนี้ (คั่นด้วย comma)">
                    <small class="form-hint">ระบุข้อมูลสรุปที่ต้องการแสดงเป็นการ์ดด้านบนของ Dashboard</small>
                </div>
                <h3 class="sub-heading">กราฟ / Charts</h3>
            `;
            html += featureGridHtml([
                { value: 'chart-bar', icon: 'bar_chart', label: 'กราฟแท่ง (Bar Chart)' },
                { value: 'chart-line', icon: 'show_chart', label: 'กราฟเส้น (Line Chart)' },
                { value: 'chart-pie', icon: 'pie_chart', label: 'กราฟวงกลม (Pie Chart)' },
                { value: 'chart-donut', icon: 'donut_large', label: 'กราฟโดนัท (Donut Chart)' },
            ]);
            html += `
                <div class="form-group" style="margin-top:1rem">
                    <label class="form-label">รายละเอียดกราฟที่ต้องการ</label>
                    <textarea id="chartDetail" class="form-input textarea" rows="3" placeholder="เช่น กราฟแท่งแสดงยอดขายแต่ละเดือน, กราฟวงกลมแสดงสัดส่วนสินค้าตามหมวดหมู่"></textarea>
                </div>
                <h3 class="sub-heading">ฟีเจอร์เพิ่มเติม</h3>
            `;
            html += featureGridHtml([
                { value: 'date-filter', icon: 'date_range', label: 'กรองตามช่วงวันที่' },
                { value: 'auto-refresh', icon: 'refresh', label: 'รีเฟรชข้อมูลอัตโนมัติ' },
                { value: 'filter', icon: 'filter_list', label: 'Dropdown กรองข้อมูล' },
                { value: 'export-pdf', icon: 'picture_as_pdf', label: 'Export เป็น PDF' },
                { value: 'export-excel', icon: 'file_download', label: 'Export เป็น Excel/CSV' },
                { value: 'print', icon: 'print', label: 'พิมพ์ (Print)' },
                { value: 'data-table', icon: 'table_view', label: 'แสดงตารางข้อมูลด้วย' },
            ]);
            break;

        case 'form':
            html += `<h3 class="sub-heading">หลังกดบันทึก</h3>`;
            html += featureGridHtml([
                { value: 'clear-form', icon: 'restart_alt', label: 'ล้างฟอร์มหลังบันทึก' },
                { value: 'success-msg', icon: 'check_circle', label: 'แสดงข้อความบันทึกสำเร็จ' },
                { value: 'show-summary', icon: 'receipt', label: 'แสดงสรุปข้อมูลที่บันทึก' },
            ]);
            html += `<h3 class="sub-heading">การตรวจสอบข้อมูล</h3>`;
            html += featureGridHtml([
                { value: 'validation', icon: 'verified', label: 'ตรวจสอบข้อมูลก่อนบันทึก' },
                { value: 'duplicate-check', icon: 'content_copy', label: 'ตรวจสอบข้อมูลซ้ำ' },
                { value: 'auto-id', icon: 'pin', label: 'สร้าง Running Number อัตโนมัติ' },
                { value: 'auto-timestamp', icon: 'schedule', label: 'บันทึกวันเวลาอัตโนมัติ' },
            ]);
            html += `<h3 class="sub-heading">การแจ้งเตือน</h3>`;
            html += featureGridHtml([
                { value: 'email-notify', icon: 'email', label: 'แจ้งเตือนทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
            ]);
            html += `<h3 class="sub-heading">อื่นๆ</h3>`;
            html += featureGridHtml([
                { value: 'upload-file', icon: 'cloud_upload', label: 'อัปโหลดไฟล์ไป Google Drive' },
                { value: 'multi-step', icon: 'view_carousel', label: 'ฟอร์มหลายขั้นตอน (Multi-step)' },
                { value: 'edit-after', icon: 'edit', label: 'แก้ไขข้อมูลหลังบันทึกได้' },
                { value: 'dropdown-from-sheet', icon: 'arrow_drop_down_circle', label: 'Dropdown ดึงข้อมูลจากชีทอื่น' },
            ]);
            break;

        case 'display':
            html += `<h3 class="sub-heading">การค้นหาและกรอง</h3>`;
            html += featureGridHtml([
                { value: 'search', icon: 'search', label: 'ค้นหาข้อมูล (Search)' },
                { value: 'filter', icon: 'filter_list', label: 'กรองข้อมูล (Filter)' },
                { value: 'sort', icon: 'sort', label: 'เรียงลำดับข้อมูล' },
                { value: 'date-filter', icon: 'date_range', label: 'กรองตามช่วงวันที่' },
            ]);
            html += `<h3 class="sub-heading">การแสดงผล</h3>`;
            html += featureGridHtml([
                { value: 'pagination', icon: 'last_page', label: 'แบ่งหน้า (Pagination)' },
                { value: 'row-detail', icon: 'open_in_full', label: 'คลิกดูรายละเอียดแต่ละแถว' },
                { value: 'highlight', icon: 'highlight', label: 'ไฮไลท์แถวตามเงื่อนไข' },
                { value: 'image-preview', icon: 'image', label: 'แสดงรูปภาพจาก Google Drive' },
                { value: 'card-view', icon: 'view_module', label: 'มุมมอง Card View (แทนตาราง)' },
            ]);
            html += `<h3 class="sub-heading">Export & พิมพ์</h3>`;
            html += featureGridHtml([
                { value: 'export-excel', icon: 'file_download', label: 'Export เป็น Excel/CSV' },
                { value: 'export-pdf', icon: 'picture_as_pdf', label: 'Export เป็น PDF' },
                { value: 'print', icon: 'print', label: 'พิมพ์ (Print)' },
            ]);
            break;

        case 'crud':
            html += `<h3 class="sub-heading">การจัดการข้อมูล</h3>`;
            html += featureGridHtml([
                { value: 'modal-form', icon: 'open_in_new', label: 'เปิดฟอร์มแบบ Modal/Popup' },
                { value: 'inline-edit', icon: 'edit', label: 'แก้ไขข้อมูลในตาราง (Inline Edit)' },
                { value: 'confirm-delete', icon: 'delete_forever', label: 'ยืนยันก่อนลบข้อมูล' },
                { value: 'soft-delete', icon: 'restore_from_trash', label: 'ลบแบบ Soft Delete (กู้คืนได้)' },
                { value: 'bulk-action', icon: 'checklist', label: 'เลือกหลายแถว & ดำเนินการพร้อมกัน' },
            ]);
            html += `<h3 class="sub-heading">การค้นหาและแสดงผล</h3>`;
            html += featureGridHtml([
                { value: 'search', icon: 'search', label: 'ค้นหาข้อมูล' },
                { value: 'filter', icon: 'filter_list', label: 'กรองข้อมูล (Filter)' },
                { value: 'sort', icon: 'sort', label: 'เรียงลำดับ' },
                { value: 'pagination', icon: 'last_page', label: 'แบ่งหน้า (Pagination)' },
                { value: 'date-filter', icon: 'date_range', label: 'กรองตามช่วงวันที่' },
            ]);
            html += `<h3 class="sub-heading">การตรวจสอบและอื่นๆ</h3>`;
            html += featureGridHtml([
                { value: 'validation', icon: 'verified', label: 'ตรวจสอบข้อมูลก่อนบันทึก' },
                { value: 'duplicate-check', icon: 'content_copy', label: 'ตรวจสอบข้อมูลซ้ำ' },
                { value: 'auto-id', icon: 'pin', label: 'สร้าง Running Number อัตโนมัติ' },
                { value: 'auto-timestamp', icon: 'schedule', label: 'บันทึกวันเวลาสร้าง/แก้ไขอัตโนมัติ' },
                { value: 'export-excel', icon: 'file_download', label: 'Export เป็น Excel/CSV' },
                { value: 'upload-file', icon: 'cloud_upload', label: 'อัปโหลดไฟล์ไป Google Drive' },
                { value: 'dropdown-from-sheet', icon: 'arrow_drop_down_circle', label: 'Dropdown ดึงข้อมูลจากชีทอื่น' },
                { value: 'email-notify', icon: 'email', label: 'แจ้งเตือนทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
            ]);
            break;

        case 'report':
            html += `<h3 class="sub-heading">รูปแบบรายงาน</h3>`;
            html += featureGridHtml([
                { value: 'group-by', icon: 'workspaces', label: 'จัดกลุ่มข้อมูล (Group By)' },
                { value: 'summary-row', icon: 'functions', label: 'แถวสรุป (ผลรวม, เฉลี่ย, จำนวน)' },
                { value: 'date-filter', icon: 'date_range', label: 'กรองตามช่วงวันที่' },
                { value: 'filter', icon: 'filter_list', label: 'กรองข้อมูลตามเงื่อนไข' },
                { value: 'compare-period', icon: 'compare_arrows', label: 'เปรียบเทียบข้อมูลระหว่างช่วงเวลา' },
            ]);
            html += `
                <div class="form-group" style="margin-top:1rem">
                    <label class="form-label">รายละเอียดรายงาน</label>
                    <textarea id="reportDetail" class="form-input textarea" rows="3" placeholder="เช่น รายงานยอดขายรายเดือน จัดกลุ่มตามประเภทสินค้า แสดงผลรวมแต่ละกลุ่ม"></textarea>
                </div>
            `;
            html += `<h3 class="sub-heading">กราฟในรายงาน</h3>`;
            html += featureGridHtml([
                { value: 'chart-bar', icon: 'bar_chart', label: 'กราฟแท่ง' },
                { value: 'chart-line', icon: 'show_chart', label: 'กราฟเส้น' },
                { value: 'chart-pie', icon: 'pie_chart', label: 'กราฟวงกลม' },
            ]);
            html += `<h3 class="sub-heading">Export & พิมพ์</h3>`;
            html += featureGridHtml([
                { value: 'export-excel', icon: 'file_download', label: 'Export เป็น Excel/CSV' },
                { value: 'export-pdf', icon: 'picture_as_pdf', label: 'Export เป็น PDF' },
                { value: 'print', icon: 'print', label: 'พิมพ์ (Print)' },
                { value: 'schedule-report', icon: 'schedule_send', label: 'ส่งรายงานอัตโนมัติทาง Email' },
            ]);
            break;

        case 'approval':
            html += `<h3 class="sub-heading">การทำงานของ Workflow</h3>`;
            html += featureGridHtml([
                { value: 'status-track', icon: 'timeline', label: 'แสดงสถานะคำขอแบบ Timeline' },
                { value: 'comment', icon: 'comment', label: 'ผู้อนุมัติแสดงความเห็นได้' },
                { value: 'reject-reason', icon: 'feedback', label: 'ระบุเหตุผลเมื่อไม่อนุมัติ' },
                { value: 'attachment', icon: 'attach_file', label: 'แนบไฟล์ในคำขอ' },
                { value: 'revision', icon: 'replay', label: 'ส่งกลับแก้ไขได้' },
                { value: 'auto-expire', icon: 'timer_off', label: 'หมดอายุอัตโนมัติหากไม่ดำเนินการ' },
            ]);
            html += `<h3 class="sub-heading">การแจ้งเตือน</h3>`;
            html += featureGridHtml([
                { value: 'email-notify', icon: 'email', label: 'แจ้งเตือนทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
                { value: 'notify-requester', icon: 'notifications', label: 'แจ้งผู้ขอเมื่อสถานะเปลี่ยน' },
                { value: 'notify-approver', icon: 'mark_email_unread', label: 'แจ้งผู้อนุมัติเมื่อมีคำขอใหม่' },
            ]);
            html += `<h3 class="sub-heading">การแสดงผล</h3>`;
            html += featureGridHtml([
                { value: 'my-requests', icon: 'list_alt', label: 'หน้ารายการคำขอของฉัน' },
                { value: 'pending-list', icon: 'pending_actions', label: 'หน้ารายการรออนุมัติ' },
                { value: 'search', icon: 'search', label: 'ค้นหาคำขอ' },
                { value: 'export-excel', icon: 'file_download', label: 'Export รายงาน' },
            ]);
            break;

        case 'inventory':
            html += `<h3 class="sub-heading">การเบิก-จ่ายสต็อก</h3>`;
            html += featureGridHtml([
                { value: 'stock-in', icon: 'add_box', label: 'รับเข้าสต็อก (Stock In)' },
                { value: 'stock-out', icon: 'indeterminate_check_box', label: 'เบิกออกจากสต็อก (Stock Out)' },
                { value: 'transfer', icon: 'swap_horiz', label: 'โอนสต็อกระหว่างคลัง' },
                { value: 'adjust', icon: 'tune', label: 'ปรับปรุงยอดสต็อก (Adjust)' },
            ]);
            html += `<h3 class="sub-heading">การแจ้งเตือนและรายงาน</h3>`;
            html += featureGridHtml([
                { value: 'min-stock-alert', icon: 'warning', label: 'แจ้งเตือนสต็อกต่ำกว่ากำหนด' },
                { value: 'transaction-log', icon: 'history', label: 'บันทึกประวัติการเคลื่อนไหว' },
                { value: 'stock-report', icon: 'summarize', label: 'รายงานสต็อกคงเหลือ' },
                { value: 'email-notify', icon: 'email', label: 'แจ้งเตือนทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
            ]);
            html += `<h3 class="sub-heading">การค้นหาและแสดงผล</h3>`;
            html += featureGridHtml([
                { value: 'search', icon: 'search', label: 'ค้นหาสินค้า' },
                { value: 'filter', icon: 'filter_list', label: 'กรองตามหมวดหมู่' },
                { value: 'barcode', icon: 'qr_code_scanner', label: 'สแกน Barcode / QR Code' },
                { value: 'export-excel', icon: 'file_download', label: 'Export เป็น Excel' },
                { value: 'image-preview', icon: 'image', label: 'แสดงรูปสินค้า' },
            ]);
            break;

        case 'booking':
            html += `<h3 class="sub-heading">มุมมองและการแสดงผล</h3>`;
            html += featureGridHtml([
                { value: 'calendar-view', icon: 'calendar_month', label: 'มุมมองปฏิทิน (Calendar View)' },
                { value: 'list-view', icon: 'view_list', label: 'มุมมองรายการ (List View)' },
                { value: 'timeline-view', icon: 'view_timeline', label: 'มุมมอง Timeline' },
                { value: 'availability', icon: 'event_available', label: 'แสดงสถานะว่าง/ไม่ว่าง' },
            ]);
            html += `<h3 class="sub-heading">กฎการจอง</h3>`;
            html += featureGridHtml([
                { value: 'conflict-check', icon: 'block', label: 'ตรวจสอบการจองซ้ำซ้อน' },
                { value: 'max-duration', icon: 'timelapse', label: 'จำกัดระยะเวลาจองสูงสุด' },
                { value: 'advance-limit', icon: 'event_upcoming', label: 'จำกัดการจองล่วงหน้า' },
                { value: 'cancel-policy', icon: 'event_busy', label: 'ยกเลิกการจองได้' },
                { value: 'recurring', icon: 'repeat', label: 'จองแบบซ้ำ (Recurring)' },
            ]);
            html += `<h3 class="sub-heading">การแจ้งเตือน</h3>`;
            html += featureGridHtml([
                { value: 'email-notify', icon: 'email', label: 'ยืนยันการจองทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
                { value: 'reminder', icon: 'alarm', label: 'เตือนก่อนถึงเวลาจอง' },
            ]);
            html += `<h3 class="sub-heading">อื่นๆ</h3>`;
            html += featureGridHtml([
                { value: 'search', icon: 'search', label: 'ค้นหาการจอง' },
                { value: 'my-bookings', icon: 'list_alt', label: 'หน้ารายการจองของฉัน' },
                { value: 'export-excel', icon: 'file_download', label: 'Export รายงานการจอง' },
                { value: 'approval-required', icon: 'fact_check', label: 'ต้องได้รับอนุมัติก่อนจอง' },
            ]);
            break;

        case 'attendance':
            html += `<h3 class="sub-heading">การตรวจจับและคำนวณ</h3>`;
            html += featureGridHtml([
                { value: 'late-detect', icon: 'running_with_errors', label: 'ตรวจจับการมาสาย (flag ใน Sheets)' },
                { value: 'early-leave', icon: 'exit_to_app', label: 'ตรวจจับการกลับก่อนเวลา (flag ใน Sheets)' },
            ]);
            html += `<h3 class="sub-heading">การลาและวันหยุด</h3>`;
            html += featureGridHtml([
                { value: 'leave-request', icon: 'event_busy', label: 'ระบบขอลา (ลาป่วย/ลาพักร้อน)' },
                { value: 'leave-balance', icon: 'account_balance', label: 'แสดงวันลาคงเหลือ' },
                { value: 'holiday-calendar', icon: 'calendar_month', label: 'ปฏิทินวันหยุดราชการ' },
            ]);
            html += `<h3 class="sub-heading">รายงานและสรุป</h3>`;
            html += featureGridHtml([
                { value: 'daily-summary', icon: 'today', label: 'สรุปรายวัน' },
                { value: 'monthly-summary', icon: 'date_range', label: 'สรุปรายเดือน' },
                { value: 'export-excel', icon: 'file_download', label: 'Export รายงานเป็น Excel' },
                { value: 'export-pdf', icon: 'picture_as_pdf', label: 'Export รายงานเป็น PDF' },
            ]);
            html += `<h3 class="sub-heading">การแจ้งเตือน</h3>`;
            html += featureGridHtml([
                { value: 'email-notify', icon: 'email', label: 'แจ้งเตือนทาง Email' },
                { value: 'line-messaging', icon: 'chat', label: 'แจ้งเตือนทาง LINE Messaging API' },
                { value: 'notify-late', icon: 'notification_important', label: 'แจ้งหัวหน้าเมื่อพนักงานมาสาย' },
            ]);
            html += `<h3 class="sub-heading">มุมมองและอื่นๆ</h3>`;
            html += featureGridHtml([
                { value: 'calendar-view', icon: 'calendar_month', label: 'มุมมองปฏิทิน' },
                { value: 'search', icon: 'search', label: 'ค้นหาพนักงาน' },
                { value: 'dashboard-summary', icon: 'dashboard', label: 'Dashboard สรุปภาพรวม' },
            ]);
            break;
    }

    document.getElementById('step-3-content').innerHTML = html;
}

// ========== DYNAMIC LIST MANAGEMENT ==========

let fieldCount = 0;
let levelCount = 0;
let sheetCount = 0;

function addField() {
    const container = document.getElementById('fields-container');
    if (!container) return;
    container.insertAdjacentHTML('beforeend', fieldEntryHtml(fieldCount));
    fieldCount++;
    renumberEntries('.field-entry', 'ฟิลด์ที่', 'input');
}

function removeField(btn) {
    btn.closest('.field-entry').remove();
    fieldCount--;
    renumberEntries('.field-entry', 'ฟิลด์ที่', 'input');
}

function toggleFieldOptions(select) {
    const entry = select.closest('.field-entry');
    const optionsRow = entry.querySelector('.field-options-row');
    const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(select.value);
    optionsRow.classList.toggle('visible', needsOptions);
}

function addApprovalLevel() {
    const container = document.getElementById('levels-container');
    if (!container) return;
    const idx = levelCount;
    container.insertAdjacentHTML('beforeend', `
        <div class="level-entry" data-index="${idx}">
            <div class="level-entry-header">
                <h4><span class="material-icons-round">approval</span> ลำดับที่ ${idx + 1}</h4>
                ${idx > 0 ? `<button type="button" class="btn-icon" onclick="removeLevel(this)"><span class="material-icons-round">close</span></button>` : ''}
            </div>
            <div class="form-row">
                <div class="form-group flex-1">
                    <label class="form-label">ตำแหน่ง/ชื่อผู้อนุมัติ</label>
                    <input type="text" class="form-input level-name" placeholder="เช่น หัวหน้าแผนก, ผู้จัดการ, ผอ.">
                </div>
                <div class="form-group flex-1">
                    <label class="form-label">Email ผู้อนุมัติ (Optional)</label>
                    <input type="text" class="form-input level-email" placeholder="เช่น manager@company.com">
                </div>
            </div>
        </div>
    `);
    levelCount++;
}

function removeLevel(btn) {
    btn.closest('.level-entry').remove();
    levelCount--;
    renumberEntries('.level-entry', 'ลำดับที่', 'approval');
}

function addSheet() {
    const container = document.getElementById('sheets-container');
    if (!container) return;
    sheetCount++;
    container.insertAdjacentHTML('beforeend', `
        <div class="sheet-entry" data-index="${sheetCount - 1}">
            <div class="sheet-header">
                <h3><span class="material-icons-round">table_chart</span> ชีทที่ ${sheetCount}</h3>
                <button type="button" class="btn-icon" onclick="removeSheet(this)"><span class="material-icons-round">close</span></button>
            </div>
            <div class="form-row">
                <div class="form-group flex-1">
                    <label class="form-label">ชื่อชีท</label>
                    <input type="text" class="form-input sheet-name" placeholder="เช่น Sheet1, รายชื่อพนักงาน">
                </div>
                <div class="form-group flex-1">
                    <label class="form-label">วัตถุประสงค์</label>
                    <input type="text" class="form-input sheet-purpose" placeholder="เช่น เก็บข้อมูลพนักงาน">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">คอลัมน์ (Column Headers)</label>
                <input type="text" class="form-input sheet-columns" placeholder="เช่น ID, ชื่อ, นามสกุล (คั่นด้วย comma)">
            </div>
        </div>
    `);
}

function removeSheet(btn) {
    btn.closest('.sheet-entry').remove();
    sheetCount--;
    let i = 1;
    document.querySelectorAll('.sheet-entry').forEach(el => {
        el.querySelector('h3').innerHTML = `<span class="material-icons-round">table_chart</span> ชีทที่ ${i}`;
        i++;
    });
}

function renumberEntries(selector, label, iconName) {
    let i = 1;
    document.querySelectorAll(selector).forEach(el => {
        const h = el.querySelector('h4') || el.querySelector('h3');
        if (h) {
            const icon = iconName === 'input' ? 'input' : 'approval';
            h.innerHTML = `<span class="material-icons-round">${icon}</span> ${label} ${i}`;
        }
        i++;
    });
}

// ========== NAVIGATION ==========

function getSelectedType() {
    const el = document.querySelector('[name="appType"]:checked');
    return el ? el.value : null;
}

function goToStep(step) {
    if (step === 1) lastRenderedType = null;
    currentStep = step;
    updateStepUI();
}

function nextStep() {
    if (currentStep === 1) {
        const type = getSelectedType();
        if (!type) {
            alert('กรุณาเลือกประเภท Web App ก่อน');
            return;
        }
        if (type !== lastRenderedType) {
            fieldCount = 0;
            levelCount = 0;
            sheetCount = 1;
            renderStep2(type);
            renderStep3(type);
            lastRenderedType = type;
        }
    }
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepUI();
    }
}

function updateStepUI() {
    const type = getSelectedType();

    // Update step labels
    if (type && TYPE_CONFIG[type]) {
        const labels = TYPE_CONFIG[type].labels;
        document.querySelectorAll('.steps-indicator .step').forEach(el => {
            const s = parseInt(el.dataset.step);
            el.querySelector('.step-label').textContent = labels[s - 1];
        });
    }

    // Update step indicators
    document.querySelectorAll('.steps-indicator .step').forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (s === currentStep) el.classList.add('active');
        else if (s < currentStep) el.classList.add('completed');
    });

    // Show/hide step content
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Nav buttons
    document.getElementById('btn-prev').style.display = currentStep > 1 ? 'inline-flex' : 'none';
    if (currentStep === totalSteps) {
        document.getElementById('btn-next').style.display = 'none';
        document.getElementById('btn-generate').style.display = 'none';
    } else if (currentStep === totalSteps - 1) {
        document.getElementById('btn-next').style.display = 'none';
        document.getElementById('btn-generate').style.display = 'inline-flex';
    } else {
        document.getElementById('btn-next').style.display = 'inline-flex';
        document.getElementById('btn-generate').style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== DATA COLLECTION ==========

function getVal(name) {
    const el = document.querySelector(`[name="${name}"]:checked`);
    return el ? el.value : '';
}

function getChecked(name) {
    return Array.from(document.querySelectorAll(`[name="${name}"]:checked`)).map(el => el.value);
}

function getInputVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function getSheets() {
    const sheets = [];
    document.querySelectorAll('.sheet-entry').forEach(entry => {
        const name = entry.querySelector('.sheet-name')?.value.trim() || '';
        const purpose = entry.querySelector('.sheet-purpose')?.value.trim() || '';
        const columns = entry.querySelector('.sheet-columns')?.value.trim() || '';
        if (name || purpose || columns) sheets.push({ name, purpose, columns });
    });
    return sheets;
}

function getFields() {
    const fields = [];
    document.querySelectorAll('.field-entry').forEach(entry => {
        const name = entry.querySelector('.field-name')?.value.trim() || '';
        const type = entry.querySelector('.field-type')?.value || 'text';
        const required = entry.querySelector('.field-required')?.checked || false;
        const options = entry.querySelector('.field-options')?.value.trim() || '';
        if (name) fields.push({ name, type, required, options });
    });
    return fields;
}

function getApprovalLevels() {
    const levels = [];
    document.querySelectorAll('.level-entry').forEach(entry => {
        const name = entry.querySelector('.level-name')?.value.trim() || '';
        const email = entry.querySelector('.level-email')?.value.trim() || '';
        if (name) levels.push({ name, email });
    });
    return levels;
}

function getFieldTypeLabel(value) {
    const found = FIELD_TYPES.find(t => t.value === value);
    return found ? found.label : value;
}

// ========== PROMPT GENERATION ==========

const APP_TYPE_LABELS = {
    dashboard: 'Dashboard (แดชบอร์ดแสดงข้อมูลสรุป กราฟ สถิติ)',
    form: 'Form บันทึกข้อมูล',
    display: 'แสดงข้อมูล Read Only',
    crud: 'CRUD จัดการข้อมูลเต็มรูปแบบ',
    report: 'รายงาน / Report',
    approval: 'ระบบอนุมัติ / Approval',
    inventory: 'ระบบสต็อก / Inventory',
    booking: 'ระบบจอง / Booking',
    attendance: 'ระบบลงเวลา / Attendance & Check-in',
};

const FEATURE_LABELS = {
    'search': 'ค้นหาข้อมูล', 'filter': 'กรองข้อมูล', 'sort': 'เรียงลำดับ',
    'pagination': 'แบ่งหน้า (Pagination)', 'date-filter': 'กรองตามช่วงวันที่',
    'export-excel': 'Export Excel/CSV', 'export-pdf': 'Export PDF', 'print': 'พิมพ์',
    'chart-bar': 'กราฟแท่ง (Bar Chart)', 'chart-line': 'กราฟเส้น (Line Chart)',
    'chart-pie': 'กราฟวงกลม (Pie Chart)', 'chart-donut': 'กราฟโดนัท (Donut Chart)',
    'auto-refresh': 'รีเฟรชข้อมูลอัตโนมัติ', 'data-table': 'แสดงตารางข้อมูล',
    'clear-form': 'ล้างฟอร์มหลังบันทึก', 'success-msg': 'แสดงข้อความบันทึกสำเร็จ',
    'show-summary': 'แสดงสรุปข้อมูลที่บันทึก',
    'validation': 'ตรวจสอบข้อมูลก่อนบันทึก', 'duplicate-check': 'ตรวจสอบข้อมูลซ้ำ',
    'auto-id': 'สร้าง Running Number อัตโนมัติ', 'auto-timestamp': 'บันทึกวันเวลาอัตโนมัติ',
    'email-notify': 'แจ้งเตือนทาง Email (GmailApp)', 'line-messaging': 'แจ้งเตือนทาง LINE Messaging API (UrlFetchApp)',
    'upload-file': 'อัปโหลดไฟล์ไป Google Drive (DriveApp)', 'multi-step': 'ฟอร์มหลายขั้นตอน (Multi-step)',
    'edit-after': 'แก้ไขข้อมูลหลังบันทึกได้',
    'row-detail': 'คลิกดูรายละเอียดแต่ละแถว', 'highlight': 'ไฮไลท์แถวตามเงื่อนไข',
    'image-preview': 'แสดงรูปภาพจาก Google Drive',
    'modal-form': 'เปิดฟอร์มแบบ Modal/Popup', 'inline-edit': 'แก้ไขข้อมูลในตาราง (Inline Edit)',
    'confirm-delete': 'ยืนยันก่อนลบข้อมูล', 'soft-delete': 'Soft Delete (กู้คืนได้)',
    'bulk-action': 'เลือกหลายแถว & ดำเนินการพร้อมกัน',
    'group-by': 'จัดกลุ่มข้อมูล (Group By)', 'summary-row': 'แถวสรุป (ผลรวม เฉลี่ย จำนวน)',
    'schedule-report': 'ส่งรายงานอัตโนมัติทาง Email',
    'status-track': 'แสดงสถานะคำขอแบบ Timeline', 'comment': 'ผู้อนุมัติแสดงความเห็นได้',
    'reject-reason': 'ระบุเหตุผลเมื่อไม่อนุมัติ', 'attachment': 'แนบไฟล์ในคำขอ',
    'revision': 'ส่งกลับแก้ไขได้', 'auto-expire': 'หมดอายุอัตโนมัติ',
    'notify-requester': 'แจ้งผู้ขอเมื่อสถานะเปลี่ยน', 'notify-approver': 'แจ้งผู้อนุมัติเมื่อมีคำขอใหม่',
    'my-requests': 'หน้ารายการคำขอของฉัน', 'pending-list': 'หน้ารายการรออนุมัติ',
    'stock-in': 'รับเข้าสต็อก (Stock In)', 'stock-out': 'เบิกออกจากสต็อก (Stock Out)',
    'transfer': 'โอนสต็อกระหว่างคลัง', 'adjust': 'ปรับปรุงยอดสต็อก',
    'min-stock-alert': 'แจ้งเตือนสต็อกต่ำกว่ากำหนด', 'transaction-log': 'บันทึกประวัติการเคลื่อนไหว',
    'stock-report': 'รายงานสต็อกคงเหลือ', 'barcode': 'สแกน Barcode / QR Code',
    'calendar-view': 'มุมมองปฏิทิน', 'list-view': 'มุมมองรายการ', 'timeline-view': 'มุมมอง Timeline',
    'availability': 'แสดงสถานะว่าง/ไม่ว่าง',
    'conflict-check': 'ตรวจสอบการจองซ้ำซ้อน', 'max-duration': 'จำกัดระยะเวลาจองสูงสุด',
    'advance-limit': 'จำกัดการจองล่วงหน้า', 'cancel-policy': 'ยกเลิกการจองได้',
    'recurring': 'จองแบบซ้ำ (Recurring)', 'reminder': 'เตือนก่อนถึงเวลาจอง',
    'my-bookings': 'หน้ารายการจองของฉัน', 'approval-required': 'ต้องได้รับอนุมัติก่อนจอง',
    'manual-checkin': 'กดปุ่ม Check-in/Check-out', 'qr-checkin': 'สแกน QR Code',
    'gps-checkin': 'บันทึกตำแหน่ง GPS', 'photo-checkin': 'ถ่ายรูปยืนยันตัวตน',
    'late-detect': 'ตรวจจับการมาสาย', 'early-leave': 'ตรวจจับการกลับก่อนเวลา',
    'overtime-calc': 'คำนวณ OT (ล่วงเวลา)', 'work-hours-calc': 'คำนวณชั่วโมงทำงาน',
    'leave-request': 'ระบบขอลา (ลาป่วย/ลาพักร้อน)', 'leave-balance': 'แสดงวันลาคงเหลือ',
    'holiday-calendar': 'ปฏิทินวันหยุดราชการ',
    'daily-summary': 'สรุปรายวัน', 'monthly-summary': 'สรุปรายเดือน',
    'notify-late': 'แจ้งหัวหน้าเมื่อพนักงานมาสาย', 'dashboard-summary': 'Dashboard สรุปภาพรวม',
    'card-view': 'มุมมอง Card View', 'dropdown-from-sheet': 'Dropdown ดึงข้อมูลจากชีทอื่น',
    'compare-period': 'เปรียบเทียบข้อมูลระหว่างช่วงเวลา',
};

const DESIGN_LABELS = {
    minimal: 'Minimal (เรียบง่าย เน้นเนื้อหา)', modern: 'Modern (ทันสมัย Shadow/Gradient)',
    corporate: 'Corporate (เป็นทางการ)', playful: 'Playful (สนุกสนาน สีสันสดใส)',
    glassmorphism: 'Glassmorphism (กระจกฝ้า)', flat: 'Flat Design (แบนราบ สีทึบ)',
};

const CSS_LABELS = { bootstrap: 'Bootstrap 5 (CDN)', materialize: 'Materialize CSS (CDN)', tailwind: 'Tailwind CSS (CDN)', custom: 'Custom CSS' };
const COLOR_LABELS = { blue: 'โทนน้ำเงิน', green: 'โทนเขียว', purple: 'โทนม่วง', orange: 'โทนส้ม', red: 'โทนแดง', teal: 'โทนเขียวอมฟ้า', dark: 'Dark Mode' };
const LAYOUT_LABELS = { sidebar: 'Sidebar Navigation', topnav: 'Top Navigation', single: 'Single Page' };
const LANG_LABELS = { th: 'ภาษาไทย', en: 'English', both: 'สองภาษา (ไทย/อังกฤษ)' };

function generatePrompt() {
    const type = getSelectedType();
    const features = getChecked('features');
    const sheetsId = getInputVal('sheetsId');
    const appName = getInputVal('appName');
    const appDescription = getInputVal('appDescription');
    const language = getVal('language');
    const cssFramework = getVal('cssFramework');
    const designStyle = getVal('designStyle');
    const colorTheme = getVal('colorTheme');
    const layout = getVal('layout');
    const responsive = getChecked('responsive');
    const additionalNotes = getInputVal('additionalNotes');

    let p = `สร้าง Web Application ด้วย Google Apps Script (GAS) ตามรายละเอียดดังนี้:\n\n`;

    // --- General Info ---
    p += `## ข้อมูลทั่วไป\n`;
    if (appName) p += `- ชื่อ Web App: ${appName}\n`;
    if (appDescription) p += `- คำอธิบาย: ${appDescription}\n`;
    p += `- ประเภท: ${APP_TYPE_LABELS[type] || type}\n`;
    p += `- ภาษาที่แสดงผล: ${LANG_LABELS[language] || language}\n\n`;

    // --- Type-specific Data ---
    switch (type) {
        case 'form': {
            const fields = getFields();
            const targetSheet = getInputVal('targetSheet');
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            p += `- ชีทที่บันทึก: ${targetSheet || '[ให้ user กำหนด]'}\n\n`;
            if (fields.length > 0) {
                p += `## ฟิลด์ในฟอร์ม\n`;
                p += `| ลำดับ | ชื่อฟิลด์ | ประเภท | จำเป็น | ตัวเลือก |\n`;
                p += `|-------|----------|--------|--------|----------|\n`;
                fields.forEach((f, i) => {
                    p += `| ${i+1} | ${f.name} | ${getFieldTypeLabel(f.type)} | ${f.required ? 'ใช่' : 'ไม่'} | ${f.options || '-'} |\n`;
                });
                p += `\n`;
            }
            break;
        }
        case 'crud': {
            const fields = getFields();
            const targetSheet = getInputVal('targetSheet');
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            p += `- ชีท: ${targetSheet || '[ให้ user กำหนด]'}\n\n`;
            if (fields.length > 0) {
                p += `## โครงสร้างข้อมูล (ใช้ทั้งในฟอร์มและตาราง)\n`;
                p += `| ลำดับ | ชื่อฟิลด์ | ประเภท | จำเป็น | ตัวเลือก |\n`;
                p += `|-------|----------|--------|--------|----------|\n`;
                fields.forEach((f, i) => {
                    p += `| ${i+1} | ${f.name} | ${getFieldTypeLabel(f.type)} | ${f.required ? 'ใช่' : 'ไม่'} | ${f.options || '-'} |\n`;
                });
                p += `\n`;
            }
            break;
        }
        case 'approval': {
            const fields = getFields();
            const levels = getApprovalLevels();
            const targetSheet = getInputVal('targetSheet');
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            p += `- ชีท: ${targetSheet || '[ให้ user กำหนด]'}\n\n`;
            if (fields.length > 0) {
                p += `## ฟิลด์ในแบบฟอร์มคำขอ\n`;
                p += `| ลำดับ | ชื่อฟิลด์ | ประเภท | จำเป็น | ตัวเลือก |\n`;
                p += `|-------|----------|--------|--------|----------|\n`;
                fields.forEach((f, i) => {
                    p += `| ${i+1} | ${f.name} | ${getFieldTypeLabel(f.type)} | ${f.required ? 'ใช่' : 'ไม่'} | ${f.options || '-'} |\n`;
                });
                p += `\n`;
            }
            if (levels.length > 0) {
                p += `## ลำดับขั้นการอนุมัติ\n`;
                levels.forEach((l, i) => {
                    p += `${i+1}. ${l.name}${l.email ? ` (${l.email})` : ''}\n`;
                });
                p += `\n`;
            }
            break;
        }
        case 'inventory': {
            const fields = getFields();
            const targetSheet = getInputVal('targetSheet');
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            p += `- ชีท: ${targetSheet || '[ให้ user กำหนด]'}\n\n`;
            if (fields.length > 0) {
                p += `## ฟิลด์ข้อมูลสินค้า\n`;
                p += `| ลำดับ | ชื่อฟิลด์ | ประเภท | จำเป็น | ตัวเลือก |\n`;
                p += `|-------|----------|--------|--------|----------|\n`;
                fields.forEach((f, i) => {
                    p += `| ${i+1} | ${f.name} | ${getFieldTypeLabel(f.type)} | ${f.required ? 'ใช่' : 'ไม่'} | ${f.options || '-'} |\n`;
                });
                p += `- (ฟิลด์ "จำนวนคงเหลือ" และ "ประวัติเคลื่อนไหว" จะถูกเพิ่มอัตโนมัติ)\n`;
                p += `\n`;
            }
            const invCategories = getInputVal('inventoryCategories');
            const invUnits = getInputVal('inventoryUnits');
            if (invCategories || invUnits) {
                p += `## หมวดหมู่และหน่วยนับ\n`;
                if (invCategories) p += `- หมวดหมู่: ${invCategories}\n`;
                if (invUnits) p += `- หน่วยนับ: ${invUnits}\n`;
                p += `\n`;
            }
            break;
        }
        case 'booking': {
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n\n`;
            const resType = getInputVal('resourceType');
            const resList = getInputVal('resourceList');
            const hours = getInputVal('bookingHours');
            const unit = document.getElementById('bookingUnit')?.value || '1hour';
            const bFields = getInputVal('bookingFields');
            p += `## ทรัพยากรและการตั้งค่า\n`;
            if (resType) p += `- ประเภททรัพยากร: ${resType}\n`;
            if (resList) p += `- รายการ: ${resList}\n`;
            if (hours) p += `- ช่วงเวลาเปิดจอง: ${hours}\n`;
            const unitLabels = { '30min': 'ทุก 30 นาที', '1hour': 'ทุก 1 ชั่วโมง', 'halfday': 'ครึ่งวัน', 'fullday': 'เต็มวัน' };
            p += `- หน่วยเวลาจอง: ${unitLabels[unit] || unit}\n`;
            if (bFields) p += `- ข้อมูลที่ต้องกรอกตอนจอง: ${bFields}\n`;
            p += `\n`;
            break;
        }
        case 'attendance': {
            p += `## แหล่งข้อมูล\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            const targetSheetAtt = getInputVal('targetSheet');
            const employeeSheet = getInputVal('employeeSheet');
            if (targetSheetAtt) p += `- ชีทบันทึกเวลา: ${targetSheetAtt}\n`;
            if (employeeSheet) p += `- ชีทข้อมูลพนักงาน: ${employeeSheet}\n`;
            p += `\n`;

            p += `> หมายเหตุ: สูตรคำนวณเวลาทำงาน เช่น ชั่วโมงทำงาน, OT ให้ใส่สูตรตรงใน Google Sheets\n\n`;

            const checkinMethods = getChecked('features').filter(f => f.endsWith('-checkin'));
            if (checkinMethods.length > 0) {
                const methodLabels = {
                    'manual-checkin': 'กดปุ่ม Check-in/Check-out',
                    'qr-checkin': 'สแกน QR Code',
                    'gps-checkin': 'บันทึกตำแหน่ง GPS',
                    'photo-checkin': 'ถ่ายรูปยืนยันตัวตน',
                };
                p += `## วิธีลงเวลา\n`;
                checkinMethods.forEach(m => { p += `- ${methodLabels[m] || m}\n`; });
                p += `\n`;
            }

            const empFields = getInputVal('employeeFields');
            if (empFields) {
                p += `## ข้อมูลพนักงาน\n`;
                p += `- ฟิลด์: ${empFields}\n\n`;
            }
            break;
        }
        default: { // dashboard, display, report
            const sheets = getSheets();
            p += `## แหล่งข้อมูล (Google Sheets)\n`;
            p += `- Google Sheets ID: ${sheetsId || '[placeholder]'}\n`;
            if (sheets.length > 0) {
                sheets.forEach((s, i) => {
                    p += `\n### ชีทที่ ${i+1}${s.name ? `: "${s.name}"` : ''}\n`;
                    if (s.purpose) p += `- วัตถุประสงค์: ${s.purpose}\n`;
                    if (s.columns) p += `- คอลัมน์: ${s.columns}\n`;
                });
            }
            p += `\n`;
            break;
        }
    }

    // --- Dashboard specific ---
    if (type === 'dashboard') {
        const cards = getInputVal('dashCards');
        const chartDetail = getInputVal('chartDetail');
        if (cards) p += `## Summary Cards\n- ${cards.split(',').map(c => c.trim()).join('\n- ')}\n\n`;
        if (chartDetail) p += `## รายละเอียดกราฟ\n${chartDetail}\n\n`;
    }

    // --- Report specific ---
    if (type === 'report') {
        const reportDetail = getInputVal('reportDetail');
        if (reportDetail) p += `## รายละเอียดรายงาน\n${reportDetail}\n\n`;
    }

    // --- Features ---
    if (features.length > 0) {
        p += `## ฟีเจอร์ที่ต้องการ\n`;
        features.forEach(f => { p += `- ${FEATURE_LABELS[f] || f}\n`; });
        p += `\n`;
    }

    // --- UI ---
    p += `## หน้าตาและ UI\n`;
    p += `- CSS Framework: ${CSS_LABELS[cssFramework] || cssFramework}\n`;
    p += `- สไตล์ดีไซน์: ${DESIGN_LABELS[designStyle] || designStyle}\n`;
    if (colorTheme === 'custom') {
        p += `- โทนสี: กำหนดเอง\n`;
        p += `  - สีหลัก: ${getInputVal('customPrimaryHex')}\n`;
        p += `  - สีรอง: ${getInputVal('customSecondaryHex')}\n`;
        p += `  - สีพื้นหลัง: ${getInputVal('customBgHex')}\n`;
    } else {
        p += `- โทนสี: ${COLOR_LABELS[colorTheme] || colorTheme}\n`;
    }
    p += `- Layout: ${LAYOUT_LABELS[layout] || layout}\n`;
    if (responsive.length > 0) {
        p += `- Responsive: รองรับ ${responsive.map(r => r === 'mobile' ? 'มือถือ' : 'แท็บเล็ต').join(', ')}\n`;
    }
    p += `\n`;

    // --- Technical Requirements ---
    p += `## ข้อกำหนดทางเทคนิค\n`;
    p += `- ใช้ Google Apps Script เท่านั้น\n`;
    p += `- โครงสร้างไฟล์: Code.gs (server-side) และ Index.html (client-side)\n`;
    p += `- ใช้ google.script.run สำหรับเรียก server-side functions จาก client\n`;
    p += `- ใช้ HtmlService.createHtmlOutputFromFile() สำหรับ serve HTML\n`;
    p += `- ใส่ CSS และ JavaScript ไว้ใน Index.html\n`;
    p += `- จัดการ Loading state และ Error handling อย่างเหมาะสม\n`;
    p += `- ใช้ SpreadsheetApp สำหรับอ่าน/เขียนข้อมูล Google Sheets\n`;
    if (features.includes('line-messaging')) p += `- ใช้ UrlFetchApp สำหรับส่งข้อความผ่าน LINE Messaging API\n`;
    if (features.includes('email-notify')) p += `- ใช้ GmailApp.sendEmail() สำหรับส่ง Email\n`;
    if (features.includes('upload-file') || features.includes('attachment')) p += `- ใช้ DriveApp สำหรับจัดการไฟล์ใน Google Drive\n`;
    if (features.some(f => f.startsWith('chart-'))) p += `- ใช้ Chart.js (CDN) สำหรับสร้างกราฟ\n`;
    p += `\n`;

    // --- Additional Notes ---
    if (additionalNotes) {
        p += `## รายละเอียดเพิ่มเติม\n${additionalNotes}\n\n`;
    }

    // --- Output Format ---
    p += `## รูปแบบ Output ที่ต้องการ\n`;
    p += `⚠️ **ข้อกำหนดสำคัญ**: ให้เขียนโค้ดออกมาเป็น **2 ไฟล์เท่านั้น** คือ:\n\n`;
    p += `### 1. Code.gs\n`;
    p += `\`\`\`javascript\n// วาง Code.gs ทั้งหมดที่นี่\n\`\`\`\n`;
    p += `- ใส่ server-side functions ทั้งหมดในไฟล์เดียว\n`;
    p += `- รวม doGet(), functions สำหรับอ่าน/เขียน Sheets, และ utility functions ไว้ที่นี่\n\n`;
    p += `### 2. Index.html\n`;
    p += `\`\`\`html\n<!-- วาง Index.html ทั้งหมดที่นี่ -->\n\`\`\`\n`;
    p += `- รวม HTML, CSS (<style>) และ JavaScript (<script>) ทั้งหมดไว้ในไฟล์เดียว\n`;
    p += `- ห้ามแยก CSS หรือ JS ออกเป็นไฟล์ภายนอก\n\n`;
    p += `> **เหตุผล**: GAS Web App deploy ได้ง่ายที่สุดด้วย 2 ไฟล์นี้ — ผู้ใช้เพียงสร้าง Apps Script project ใหม่, วางโค้ด Code.gs และสร้าง Index.html แล้ว Deploy as Web App ได้ทันที\n\n`;
    p += `พร้อมทั้ง:\n`;
    p += `- อธิบายวิธีการ Deploy เป็น Web App ทีละขั้นตอน\n`;
    p += `- อธิบายวิธีตั้งค่า Google Sheets ที่จำเป็น\n`;
    p += `- ระบุ Permissions/Scopes ที่ต้องอนุญาต\n`;

    document.getElementById('prompt-output').textContent = p;
    goToStep(totalSteps);
}

// ========== UTILITIES ==========

function copyPrompt() {
    const text = document.getElementById('prompt-output').textContent;
    navigator.clipboard.writeText(text).then(showToast).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast();
    });
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Custom color panel toggle
document.querySelectorAll('[name="colorTheme"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('custom-color-panel').style.display =
            radio.value === 'custom' && radio.checked ? 'block' : 'none';
    });
});

// Sync color picker <-> hex
['Primary', 'Secondary', 'Bg'].forEach(name => {
    const picker = document.getElementById(`custom${name}`);
    const hex = document.getElementById(`custom${name}Hex`);
    if (picker && hex) {
        picker.addEventListener('input', () => { hex.value = picker.value.toUpperCase(); });
        hex.addEventListener('input', () => {
            if (/^#[0-9A-Fa-f]{6}$/.test(hex.value.trim())) picker.value = hex.value.trim();
        });
    }
});

// Step click navigation (go back only)
document.querySelectorAll('.steps-indicator .step').forEach(el => {
    el.addEventListener('click', () => {
        const step = parseInt(el.dataset.step);
        if (step < currentStep) goToStep(step);
    });
});

// Init
updateStepUI();
