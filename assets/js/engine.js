(function (root, factory) {
  const api = factory(root.ELECTRICITY_TARIFFS || (typeof require === 'function' ? require('./tariffs.js') : null));
  root.ElectricityCalculatorEngine = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (TARIFFS) {
  'use strict';

  if (!TARIFFS) throw new Error('Thiếu dữ liệu biểu giá điện.');

  function parseNonNegative(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) throw new Error(`${label} phải là số không âm.`);
    return number;
  }

  function parsePositive(value, label) {
    const number = parseNonNegative(value, label);
    if (number <= 0) throw new Error(`${label} phải lớn hơn 0.`);
    return number;
  }

  function parseHouseholds(value) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 100000) {
      throw new Error('Số hộ dùng điện phải là số nguyên từ 1 trở lên.');
    }
    return number;
  }

  function validateDates(data) {
    const from = new Date(`${data.dateFrom}T00:00:00`);
    const to = new Date(`${data.dateTo}T00:00:00`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new Error('Vui lòng nhập đủ ngày bắt đầu và ngày kết thúc.');
    }
    if (to < from) throw new Error('Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.');
    return { from, to };
  }

  function allocateTiers(kwh, tiers, households, labelPrefix = 'Bậc') {
    let remaining = kwh;
    const rows = [];
    const baseLimits = [50, 50, 100, 100, 100, Infinity];

    tiers.forEach((tier, index) => {
      const price = typeof tier === 'number' ? tier : tier.price;
      const baseLimit = typeof tier === 'number' ? baseLimits[index] : tier.limit;
      const limit = Number.isFinite(baseLimit) ? baseLimit * households : Infinity;
      const used = Math.max(0, Math.min(remaining, limit));
      if (used <= 0) return;

      const label = typeof tier === 'number'
        ? `${labelPrefix} ${index + 1}`
        : `${tier.label}${households > 1 ? ` × ${households} hộ` : ''}`;
      rows.push({ label, price, kwh: used, amount: Math.round(used * price) });
      remaining -= used;
    });

    return rows;
  }

  function rowsForTimeOfUse(data, rates, prefix = '') {
    const mode = data.rateMode || 'one';
    if (mode === 'one') {
      const kwh = parsePositive(data.normalKwh, 'Tổng điện năng tiêu thụ');
      return [{ label: `${prefix}Một mức giá`, price: rates.normal, kwh, amount: Math.round(kwh * rates.normal) }];
    }

    const normal = parseNonNegative(data.normalKwhThree, 'Điện giờ bình thường');
    const offPeak = parseNonNegative(data.offPeakKwh, 'Điện giờ thấp điểm');
    const peak = parseNonNegative(data.peakKwh, 'Điện giờ cao điểm');
    if (normal + offPeak + peak <= 0) throw new Error('Tổng sản lượng của ba khung giờ phải lớn hơn 0.');

    return [
      { label: `${prefix}Giờ bình thường`, price: rates.normal, kwh: normal, amount: Math.round(normal * rates.normal) },
      { label: `${prefix}Giờ thấp điểm`, price: rates.offPeak, kwh: offPeak, amount: Math.round(offPeak * rates.offPeak) },
      { label: `${prefix}Giờ cao điểm`, price: rates.peak, kwh: peak, amount: Math.round(peak * rates.peak) }
    ].filter(row => row.kwh > 0);
  }

  function calculate(category, data) {
    const dateRange = validateDates(data);
    let rows = [];
    let note = '';

    if (category === 'residential') {
      const kwh = parsePositive(data.kwh, 'Tổng điện năng tiêu thụ');
      const households = parseHouseholds(data.households);
      rows = allocateTiers(kwh, TARIFFS.residential.tiers, households);
      note = households > 1
        ? `Định mức mỗi bậc đã được nhân theo ${households} hộ dùng chung công tơ.`
        : 'Điện sinh hoạt được phân bổ lần lượt qua 6 bậc giá.';
    }

    if (category === 'business' || category === 'production') {
      const tariff = TARIFFS[category];
      const rates = tariff.voltages[data.voltage];
      if (!rates) throw new Error('Cấp điện áp không hợp lệ.');
      rows = rowsForTimeOfUse(data, rates);
      note = `${tariff.label} · ${rates.label}.`;
    }

    if (category === 'administrative' || category === 'hospital') {
      const tariff = TARIFFS[category];
      const rate = tariff.voltages[data.voltage];
      if (!rate) throw new Error('Cấp điện áp không hợp lệ.');
      const kwh = parsePositive(data.kwh, 'Tổng điện năng tiêu thụ');
      rows = [{ label: rate.label, price: rate.price, kwh, amount: Math.round(kwh * rate.price) }];
      note = tariff.label;
    }

    if (category === 'wholesale') {
      const option = TARIFFS.wholesale.options[data.wholesaleOption];
      if (!option) throw new Error('Trường hợp bán buôn không hợp lệ.');
      const residentialKwh = parseNonNegative(data.residentialKwh, 'Điện sinh hoạt');
      const otherKwh = parseNonNegative(data.otherKwh, 'Điện mục đích khác');
      const households = parseHouseholds(data.households);
      if (residentialKwh + otherKwh <= 0) throw new Error('Tổng điện năng phải lớn hơn 0.');
      rows = residentialKwh > 0 ? allocateTiers(residentialKwh, option.tiers, households, 'Sinh hoạt bậc') : [];
      if (otherKwh > 0) {
        rows.push({ label: 'Mục đích khác', price: option.otherPrice, kwh: otherKwh, amount: Math.round(otherKwh * option.otherPrice) });
      }
      note = option.label;
    }

    if (category === 'complex') {
      const residentialKwh = parseNonNegative(data.residentialKwh, 'Điện sinh hoạt');
      const households = parseHouseholds(data.households);
      const residentialRows = residentialKwh > 0
        ? allocateTiers(residentialKwh, TARIFFS.complex.residentialTiers, households, 'Sinh hoạt bậc')
        : [];
      const commercialTotal = data.rateMode === 'three'
        ? parseNonNegative(data.normalKwhThree, 'Điện giờ bình thường') + parseNonNegative(data.offPeakKwh, 'Điện giờ thấp điểm') + parseNonNegative(data.peakKwh, 'Điện giờ cao điểm')
        : parseNonNegative(data.normalKwh, 'Điện thương mại - dịch vụ');
      const commercialRows = commercialTotal > 0
        ? rowsForTimeOfUse(data, TARIFFS.complex.commercial, 'TM-DV · ')
        : [];
      if (residentialKwh + commercialTotal <= 0) throw new Error('Tổng điện năng phải lớn hơn 0.');
      rows = residentialRows.concat(commercialRows);
      note = 'Bán buôn cho tổ hợp thương mại - dịch vụ - sinh hoạt.';
    }

    const totalKwh = rows.reduce((sum, row) => sum + row.kwh, 0);
    const subtotal = rows.reduce((sum, row) => sum + row.amount, 0);
    const vatRate = Number(TARIFFS.meta.vatRate);
    const vat = Math.round(subtotal * vatRate);
    const total = subtotal + vat;

    return {
      rows,
      totalKwh,
      subtotal,
      vat,
      vatRate,
      vatLabel: TARIFFS.meta.vatLabel,
      total,
      averagePrice: totalKwh > 0 ? Math.round(total / totalKwh) : 0,
      note,
      dateRange
    };
  }

  return { calculate, allocateTiers };
});
