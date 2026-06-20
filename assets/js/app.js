(function () {
  'use strict';

  const TARIFFS = window.ELECTRICITY_TARIFFS;
  const ENGINE = window.ElectricityCalculatorEngine;
  const form = document.getElementById('electricityForm');
  const dynamicFields = document.getElementById('dynamicFields');
  const formTitle = document.getElementById('form-title');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const resetButton = document.getElementById('resetButton');
  const errorBox = document.getElementById('errorBox');
  const emptyResult = document.getElementById('emptyResult');
  const resultContent = document.getElementById('resultContent');
  const resultStatus = document.getElementById('resultStatus');

  let activeCategory = 'residential';

  const categoryTitles = {
    residential: 'Điện sinh hoạt',
    business: 'Điện kinh doanh',
    production: 'Điện sản xuất',
    administrative: 'Hành chính sự nghiệp',
    hospital: 'Cơ quan, bệnh viện',
    wholesale: 'Bán buôn điện sinh hoạt',
    complex: 'Tổ hợp dịch vụ - thương mại - sinh hoạt'
  };

  const formatMoney = value => `${Math.round(value).toLocaleString('vi-VN')} đ`;
  const formatNumber = (value, maxDigits = 2) => Number(value).toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits
  });

  function dateToInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function setDefaultDates() {
    const today = new Date();
    const previous = new Date(today);
    previous.setDate(previous.getDate() - 30);
    document.getElementById('dateFrom').value = dateToInput(previous);
    document.getElementById('dateTo').value = dateToInput(today);
  }

  function buildVoltageOptions(voltages) {
    return Object.entries(voltages).map(([key, item]) =>
      `<option value="${key}">${item.label}</option>`
    ).join('');
  }

  function rateModeTemplate() {
    return `
      <fieldset class="choice-group">
        <legend>Cách nhập sản lượng</legend>
        <div class="segmented-control">
          <label><input type="radio" name="rateMode" value="one" checked><span>Một mức giá</span></label>
          <label><input type="radio" name="rateMode" value="three"><span>Ba khung giờ</span></label>
        </div>
      </fieldset>
      <div data-mode="one">
        <label class="field">
          <span>Tổng điện năng tiêu thụ (kWh)</span>
          <input type="number" name="normalKwh" min="0" step="0.01" value="0" inputmode="decimal">
        </label>
      </div>
      <div data-mode="three" hidden>
        <div class="field-grid field-grid--3">
          <label class="field"><span>Giờ bình thường (kWh)</span><input type="number" name="normalKwhThree" min="0" step="0.01" value="0" inputmode="decimal"></label>
          <label class="field"><span>Giờ thấp điểm (kWh)</span><input type="number" name="offPeakKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
          <label class="field"><span>Giờ cao điểm (kWh)</span><input type="number" name="peakKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
        </div>
      </div>`;
  }

  function renderFields(category) {
    formTitle.textContent = categoryTitles[category];

    if (category === 'residential') {
      dynamicFields.innerHTML = `
        <div class="field-grid field-grid--2">
          <label class="field">
            <span>Tổng điện năng tiêu thụ (kWh)</span>
            <input type="number" name="kwh" min="0" step="0.01" value="0" inputmode="decimal">
          </label>
          <label class="field">
            <span>Số hộ dùng chung công tơ</span>
            <input type="number" name="households" min="1" step="1" value="1" inputmode="numeric">
          </label>
        </div>
        <p class="field-note">Mỗi hộ được nhân thêm một định mức bậc thang. Trường hợp một hộ dùng điện, giữ giá trị là 1.</p>`;
    }

    if (category === 'business' || category === 'production') {
      dynamicFields.innerHTML = `
        <label class="field">
          <span>Cấp điện áp</span>
          <select name="voltage">${buildVoltageOptions(TARIFFS[category].voltages)}</select>
        </label>
        ${rateModeTemplate()}
        <p class="field-note">Khi chọn “Một mức giá”, công cụ dùng đơn giá giờ bình thường của cấp điện áp đã chọn.</p>`;
    }

    if (category === 'administrative' || category === 'hospital') {
      dynamicFields.innerHTML = `
        <div class="field-grid field-grid--2">
          <label class="field">
            <span>Cấp điện áp</span>
            <select name="voltage">${buildVoltageOptions(TARIFFS[category].voltages)}</select>
          </label>
          <label class="field">
            <span>Tổng điện năng tiêu thụ (kWh)</span>
            <input type="number" name="kwh" min="0" step="0.01" value="0" inputmode="decimal">
          </label>
        </div>`;
    }

    if (category === 'wholesale') {
      dynamicFields.innerHTML = `
        <label class="field">
          <span>Trường hợp bán buôn</span>
          <select name="wholesaleOption">
            ${Object.entries(TARIFFS.wholesale.options).map(([key, item]) => `<option value="${key}">${item.label}</option>`).join('')}
          </select>
        </label>
        <div class="field-grid field-grid--3">
          <label class="field"><span>Điện sinh hoạt (kWh)</span><input type="number" name="residentialKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
          <label class="field"><span>Số hộ có phát sinh</span><input type="number" name="households" min="1" step="1" value="1" inputmode="numeric"></label>
          <label class="field"><span>Điện mục đích khác (kWh)</span><input type="number" name="otherKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
        </div>
        <p class="field-note">Bản rút gọn chưa xử lý hệ số tổn thất hoặc sản lượng qua nhiều công tơ thành phần.</p>`;
    }

    if (category === 'complex') {
      dynamicFields.innerHTML = `
        <div class="field-grid field-grid--2">
          <label class="field"><span>Điện sinh hoạt (kWh)</span><input type="number" name="residentialKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
          <label class="field"><span>Số hộ có phát sinh</span><input type="number" name="households" min="1" step="1" value="1" inputmode="numeric"></label>
        </div>
        <fieldset class="choice-group">
          <legend>Điện thương mại - dịch vụ</legend>
          <div class="segmented-control">
            <label><input type="radio" name="rateMode" value="one" checked><span>Một mức giá</span></label>
            <label><input type="radio" name="rateMode" value="three"><span>Ba khung giờ</span></label>
          </div>
        </fieldset>
        <div data-mode="one">
          <label class="field"><span>Điện thương mại - dịch vụ (kWh)</span><input type="number" name="normalKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
        </div>
        <div data-mode="three" hidden>
          <div class="field-grid field-grid--3">
            <label class="field"><span>Giờ bình thường (kWh)</span><input type="number" name="normalKwhThree" min="0" step="0.01" value="0" inputmode="decimal"></label>
            <label class="field"><span>Giờ thấp điểm (kWh)</span><input type="number" name="offPeakKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
            <label class="field"><span>Giờ cao điểm (kWh)</span><input type="number" name="peakKwh" min="0" step="0.01" value="0" inputmode="decimal"></label>
          </div>
        </div>`;
    }

    bindDynamicEvents();
  }

  function bindDynamicEvents() {
    dynamicFields.querySelectorAll('input[name="rateMode"]').forEach(input => {
      input.addEventListener('change', toggleRateMode);
    });
    dynamicFields.querySelectorAll('input, select').forEach(element => {
      element.addEventListener('input', clearResult);
      element.addEventListener('change', clearResult);
    });
    toggleRateMode();
  }

  function toggleRateMode() {
    const checked = dynamicFields.querySelector('input[name="rateMode"]:checked');
    if (!checked) return;
    dynamicFields.querySelectorAll('[data-mode]').forEach(block => {
      block.hidden = block.dataset.mode !== checked.value;
    });
  }

  function renderResult(result) {
    document.getElementById('grandTotal').textContent = formatMoney(result.total);
    document.getElementById('totalKwh').textContent = `${formatNumber(result.totalKwh)} kWh`;
    document.getElementById('subtotal').textContent = formatMoney(result.subtotal);
    document.getElementById('vat').textContent = formatMoney(result.vat);
    document.getElementById('vatLabel').textContent = result.vatLabel;
    document.getElementById('averagePrice').textContent = `${formatNumber(result.averagePrice, 0)} đ/kWh`;
    document.getElementById('resultPeriod').textContent = `Kỳ ${result.dateRange.from.toLocaleDateString('vi-VN')} - ${result.dateRange.to.toLocaleDateString('vi-VN')}`;
    document.getElementById('resultNote').textContent = `${result.note} Kết quả dùng ${result.vatLabel} và làm tròn đến đồng.`;

    document.getElementById('resultRows').innerHTML = result.rows.map(row => `
      <tr>
        <td data-label="Khoản tính"><strong>${escapeHtml(row.label)}</strong></td>
        <td data-label="Đơn giá">${formatNumber(row.price, 0)} đ/kWh</td>
        <td data-label="Sản lượng">${formatNumber(row.kwh)} kWh</td>
        <td data-label="Thành tiền">${formatMoney(row.amount)}</td>
      </tr>`).join('');

    emptyResult.hidden = true;
    resultContent.hidden = false;
    resultStatus.textContent = 'Đã tính';
    resultStatus.classList.add('is-ready');
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.textContent = '';
    errorBox.hidden = true;
  }

  function clearResult() {
    hideError();
    emptyResult.hidden = false;
    resultContent.hidden = true;
    resultStatus.textContent = 'Chưa tính';
    resultStatus.classList.remove('is-ready');
  }

  function switchCategory(category) {
    activeCategory = category;
    tabs.forEach(tab => {
      const active = tab.dataset.category === category;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    renderFields(category);
    clearResult();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchCategory(tab.dataset.category));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const currentIndex = tabs.indexOf(tab);
      const nextIndex = event.key === 'ArrowRight'
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      switchCategory(tabs[nextIndex].dataset.category);
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    hideError();
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const result = ENGINE.calculate(activeCategory, data);
      renderResult(result);
      if (window.matchMedia('(max-width: 900px)').matches) {
        document.querySelector('.result-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      clearResult();
      showError(error.message || 'Không thể tính với dữ liệu đã nhập.');
    }
  });

  resetButton.addEventListener('click', () => {
    setDefaultDates();
    renderFields(activeCategory);
    clearResult();
  });

  document.getElementById('dateFrom').addEventListener('change', clearResult);
  document.getElementById('dateTo').addEventListener('change', clearResult);
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  setDefaultDates();
  renderFields(activeCategory);
})();
