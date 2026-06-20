/**
 * Biểu giá theo Quyết định 1279/QĐ-BCT ngày 09/05/2025.
 * Đơn vị: đồng/kWh, chưa gồm VAT.
 * Chỉ cần sửa tệp này khi biểu giá thay đổi.
 */
(function (root, factory) {
  const data = factory();
  root.ELECTRICITY_TARIFFS = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return Object.freeze({
    meta: {
      decision: '1279/QĐ-BCT',
      effectiveDate: '10/05/2025',
      vatRate: 0.08,
      vatLabel: 'VAT 8%',
      vatValidUntil: '31/12/2026'
    },

    residential: {
      label: 'Điện sinh hoạt',
      tiers: [
        { label: 'Bậc 1 (0 - 50 kWh)', limit: 50, price: 1984 },
        { label: 'Bậc 2 (51 - 100 kWh)', limit: 50, price: 2050 },
        { label: 'Bậc 3 (101 - 200 kWh)', limit: 100, price: 2380 },
        { label: 'Bậc 4 (201 - 300 kWh)', limit: 100, price: 2998 },
        { label: 'Bậc 5 (301 - 400 kWh)', limit: 100, price: 3350 },
        { label: 'Bậc 6 (từ 401 kWh)', limit: Infinity, price: 3460 }
      ]
    },

    business: {
      label: 'Điện kinh doanh',
      voltages: {
        high: { label: 'Từ 22 kV trở lên', normal: 2887, offPeak: 1609, peak: 5025 },
        medium: { label: 'Từ 6 kV đến dưới 22 kV', normal: 3108, offPeak: 1829, peak: 5202 },
        low: { label: 'Dưới 6 kV', normal: 3152, offPeak: 1918, peak: 5422 }
      }
    },

    production: {
      label: 'Điện sản xuất',
      voltages: {
        v110: { label: 'Từ 110 kV trở lên', normal: 1811, offPeak: 1146, peak: 3266 },
        v22: { label: 'Từ 22 kV đến dưới 110 kV', normal: 1833, offPeak: 1190, peak: 3398 },
        v6: { label: 'Từ 6 kV đến dưới 22 kV', normal: 1899, offPeak: 1234, peak: 3508 },
        low: { label: 'Dưới 6 kV', normal: 1987, offPeak: 1300, peak: 3640 }
      }
    },

    administrative: {
      label: 'Chiếu sáng công cộng, đơn vị hành chính sự nghiệp',
      voltages: {
        high: { label: 'Từ 6 kV trở lên', price: 2138 },
        low: { label: 'Dưới 6 kV', price: 2226 }
      }
    },

    hospital: {
      label: 'Bệnh viện, nhà trẻ, mẫu giáo, trường phổ thông',
      voltages: {
        high: { label: 'Từ 6 kV trở lên', price: 1940 },
        low: { label: 'Dưới 6 kV', price: 2072 }
      }
    },

    wholesale: {
      label: 'Bán buôn điện sinh hoạt',
      options: {
        rural: {
          label: 'Nông thôn',
          tiers: [1658, 1724, 1876, 2327, 2635, 2744],
          otherPrice: 1735
        },
        citySeller: {
          label: 'Thành phố, thị xã - trạm biến áp do bên bán đầu tư',
          tiers: [1853, 1919, 2172, 2750, 3102, 3206],
          otherPrice: 1750
        },
        cityBuyer: {
          label: 'Thành phố, thị xã - trạm biến áp do bên mua đầu tư',
          tiers: [1826, 1892, 2109, 2667, 2999, 3134],
          otherPrice: 1750
        },
        townSeller: {
          label: 'Thị trấn, huyện lỵ - trạm biến áp do bên bán đầu tư',
          tiers: [1790, 1856, 2062, 2611, 2937, 3035],
          otherPrice: 1750
        },
        townBuyer: {
          label: 'Thị trấn, huyện lỵ - trạm biến áp do bên mua đầu tư',
          tiers: [1762, 1828, 2017, 2503, 2834, 2929],
          otherPrice: 1750
        }
      }
    },

    complex: {
      label: 'Bán buôn cho tổ hợp thương mại - dịch vụ - sinh hoạt',
      residentialTiers: [1947, 2011, 2334, 2941, 3286, 3393],
      commercial: { normal: 2989, offPeak: 1818, peak: 5140 }
    }
  });
});
