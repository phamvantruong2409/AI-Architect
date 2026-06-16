// ===== Enums & Union Types =====

export type BuildingType =
  | 'nha_o_rieng_le'   // Nhà ở riêng lẻ
  | 'nha_lien_ke'      // Nhà liên kế (phố)
  | 'biet_thu'         // Biệt thự
  | 'chung_cu'         // Chung cư
  | 'van_phong'        // Văn phòng
  | 'thuong_mai'       // Thương mại / dịch vụ
  | 'cong_nghiep'      // Công nghiệp

export type ZoningType =
  | 'dan_cu_hien_huu'  // Khu dân cư hiện hữu
  | 'dan_cu_moi'       // Khu dân cư mới
  | 'thuong_mai_dv'    // Thương mại - dịch vụ
  | 'cong_nghiep'      // Công nghiệp
  | 'hanh_chinh'       // Hành chính - công cộng

export type CheckStatus = 'pending' | 'analyzing' | 'completed' | 'error'

export type ViolationSeverity = 'error' | 'warning' | 'info'

export type ViolationCategory =
  | 'khoang_lui'    // Khoảng lùi
  | 'mat_do'        // Mật độ xây dựng
  | 'far'           // Hệ số sử dụng đất
  | 'chieu_cao'     // Chiều cao công trình
  | 'pccc'          // Phòng cháy chữa cháy
  | 'thong_gio'     // Thông gió & chiếu sáng
  | 'khac'          // Khác

// ===== Check Project =====

export interface RegCheck {
  id: string
  project_name: string
  project_address: string
  building_type: BuildingType
  zoning_type: ZoningType
  // Thông số lô đất
  land_area: number            // Diện tích lô đất (m²)
  land_width: number           // Chiều rộng mặt tiền (m)
  land_depth: number           // Chiều sâu lô đất (m)
  // Thông số công trình dự kiến
  floors: number               // Số tầng
  total_height: number         // Chiều cao tổng công trình (m)
  building_area: number        // Diện tích xây dựng - footprint (m²)
  total_floor_area: number     // Tổng diện tích sàn (m²)
  // Khoảng lùi (m)
  setback_front: number
  setback_rear: number
  setback_left: number
  setback_right: number
  // Thông số PCCC & thông gió
  corridor_width: number       // Chiều rộng hành lang/lối thoát (m)
  window_ratio: number         // Tỷ lệ cửa sổ / diện tích sàn (%)
  // Ghi chú thêm
  extra_notes: string
  // Ảnh mặt bằng (base64 hoặc URL)
  floorplan_image_url?: string
  // Metadata
  status: CheckStatus
  created_at: string
  updated_at: string
}

// ===== Violation =====

export interface Violation {
  category: ViolationCategory
  severity: ViolationSeverity
  title: string
  description: string
  standard_ref: string        // Ví dụ: "QCXDVN 01:2021/BXD, Điều 5.3"
  current_value?: string      // Giá trị hiện tại của KTS nhập
  required_value?: string     // Giá trị tiêu chuẩn yêu cầu
  recommendation: string      // Hướng dẫn điều chỉnh cụ thể
}

// ===== Report =====

export interface RegReport {
  id: string
  check_id: string
  overall_score: number        // 0-100: điểm tuân thủ tổng thể
  compliance_summary: string   // Tóm tắt ngắn cho KTS
  violations: Violation[]
  passed_checks: string[]      // Danh sách hạng mục đã đạt
  kts_notes?: string           // Ghi chú của KTS
  generated_at: string
  gemini_model: string
}

// ===== Form Input =====

export interface CheckFormData {
  // Bước 1: Thông tin dự án
  project_name: string
  project_address: string
  building_type: BuildingType
  zoning_type: ZoningType
  // Bước 2: Thông số lô đất
  land_area: number
  land_width: number
  land_depth: number
  // Bước 3: Thông số công trình
  floors: number
  total_height: number
  building_area: number
  total_floor_area: number
  setback_front: number
  setback_rear: number
  setback_left: number
  setback_right: number
  corridor_width: number
  window_ratio: number
  extra_notes: string
  // Bước 4: Upload ảnh (optional)
  floorplan_image?: File | null
}
