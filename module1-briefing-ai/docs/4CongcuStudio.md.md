# Bản Thiết Kế Khai Triển: Hệ Sinh Thái AI Studio Kiến Trúc

Tài liệu này cung cấp khung kỹ thuật chuyên sâu và kịch bản vận hành chi tiết cho 4 Module cốt lõi thuộc ứng dụng Trợ lý toàn năng hỗ trợ Kiến trúc sư (KTS) và Studio Kiến trúc.

> **Mục tiêu cốt lõi:** Giải phóng 70% các tác vụ phi sáng tạo, chuẩn hóa quy trình tiếp xúc khách hàng, tự động kiểm soát lỗi kỹ thuật/pháp lý, và tối ưu hóa chi phí vận hành từ giai đoạn phác thảo đến khi bàn giao công trình.

---

## 🏛️ Tổng Quan Kiến Trúc Hệ Thống
[ AI STUDIO ECOSYSTEM ]
├── Module 1: CRM & Briefing AI (Giai đoạn Tiếp xúc & Thấu hiểu)
├── Module 2: Regulatory & Tech AI (Giai đoạn Khảo sát & Kỹ thuật)
├── Module 3: Design & Material Copilot (Giai đoạn Sáng tạo & Bản vẽ)
└── Module 4: Project & Cost Manager (Giai đoạn Quản lý & Thi công)
---

## 1. Module 1: CRM & Phân Tích Ý Tưởng Khách Hàng (Client Briefing AI)
Giải quyết bài toán bất đồng ngôn ngữ thiết kế giữa KTS và khách hàng phổ thông bằng hệ thống chuyển đổi trực quan.

### 1.1. Luồng Vận Hành (Workflow)
1. **Khởi tạo:** KTS gửi link định danh dự án trên webapp cho khách hàng trước buổi gặp đầu tiên.
2. **Trải nghiệm thị giác (Gamified Quiz):** Khách hàng tham gia tương tác chọn không gian mẫu (ví dụ: phòng khách thoáng đãng kiểu Bắc Âu vs phòng khách ấm cúng kiểu Đông Dương). AI theo dõi tần suất chọn, thời gian dừng lại ở mỗi ảnh.
3. **Thu thập dữ liệu định lượng:** Nhập thông tin cơ bản: số lượng thành viên, thói quen sinh hoạt (ví dụ: thích nấu ăn, nuôi thú cưng, làm việc từ xa), ngân sách dự kiến.
4. **Xuất báo cáo tự động:** Hệ thống tổng hợp, phân tích tâm lý không gian và gửi "Design Brief" chuẩn hóa về tài khoản của KTS.

### 1.2. Công Nghệ Triển Khai
* `Fine-tuned LLM (GPT-4o/Claude 3.5)`
* `Vector Database (Pinecone)`
* `ResNet/ViT (Computer Vision)`

* **Computer Vision:** Phân tích các thẻ tag (nhãn) của hình ảnh khách hàng lựa chọn (Chất liệu, Ánh sáng, Tông màu) để định vị phong cách chủ đạo.
* **LLM (Large Language Model):** Xử lý ngôn ngữ tự nhiên từ các câu trả lời tự do để bóc tách các "Ràng buộc ẩn" (Ví dụ: "Nhà có người lớn tuổi" -> Tự động đưa vào điều kiện thiết kế: không bậc thềm dốc, phòng ngủ tầng trệt).

---

## 2. Module 2: Quét Luật Quy Hoạch & Check Lỗi Kỹ Thuật (Regulatory & CAD Redline)
Đóng vai trò là một chuyên gia pháp lý và kỹ thuật kiểm tra bản vẽ 2D/3D theo thời gian thực.

### 2.1. Luồng Vận Hành (Workflow)
1. **Tích hợp:** KTS cài đặt Plugin của ứng dụng trên phần mềm chuyên ngành (AutoCAD/Revit) hoặc upload file trực tiếp lên Webapp.
2. **Định vị vị trí:** Nhập số thửa, số tờ hoặc tọa độ GPS của khu đất. AI tự động truy vấn bản đồ quy hoạch số của địa phương.
3. **Quét và phân tích:** AI đối chiếu mô hình ranh giới đất, lưới cột, và sơ đồ bố trí công năng với kho dữ liệu Tiêu chuẩn Xây dựng (TCVN) và Quy chuẩn Phòng cháy chữa cháy (PCCC).
4. **Xuất Redline:** Trả về các lớp bản vẽ (Layer) cảnh báo màu đỏ trực tiếp trong phần mềm thiết kế kèm ghi chú điều chỉnh cụ thể.

### 2.2. Chi Tiết Kiểm Tra của AI
| Hạng mục kiểm tra | Hành động của AI | Tiêu chuẩn đối chiếu (Ví dụ) |
| :--- | :--- | :--- |
| **Chỉ giới & Khoảng lùi** | Quét ranh giới lô đất trên CAD, đo khoảng cách đến mặt tiền và các cạnh hông. | QCXDVN 01:2021/BXD (Mật độ và khoảng lùi theo chiều cao công trình). |
| **Thoát nạn PCCC** | Tính toán chiều rộng lối đi, khoảng cách từ phòng xa nhất đến cửa thoát hiểm, hướng mở cửa. | QCVN 06:2022/BXD (An toàn cháy cho nhà và công trình). |
| **Thông gió & Chiếu sáng** | Tính toán tỷ lệ diện tích cửa sổ so với diện tích sàn của từng phòng chức năng. | TCVN 4474 (Tiêu chuẩn chiếu sáng tự nhiên). |

---

## 3. Module 3: Đồng Sáng Tạo Mặt Bằng & Tra Cứu Vật Liệu (Layout & Material Intelligence)
Tăng tốc giai đoạn tìm kiếm giải pháp không gian và kết nối chuỗi cung ứng vật liệu thông minh.

### 3.1. Luồng Vận Hành (Workflow)
1. **Sinh mặt bằng (Generative Layout):** KTS vẽ khung tường biên thô. Chọn các phòng chức năng cần có. AI đề xuất 3-5 phương án phân chia vách ngăn, vị trí cửa, luồng giao thông (Circulation) tối ưu.
2. **Chỉ định vật liệu (Smart Spec):** KTS gắn thẻ vật liệu cho cấu kiện (ví dụ: Sàn gỗ công nghiệp). AI tự động mở bảng thuộc tính kỹ thuật.
3. **Liên kết nhà cung ứng:** AI hiển thị báo giá thực tế, kho hàng khả dụng tại địa phương, và các thông số bền vững (độ phát thải VOC, chứng chỉ xanh).

### 3.2. Công Nghệ Triển Khai
* `Graph Neural Networks (GNN)`
* `BIM API Integration`
* `RAG (Retrieval-Augmented Generation)`

* **GNN:** Đại diện các phòng như một đồ thị mạng lưới (Nút = Phòng, Cạnh = Cửa đi lại). AI học hỏi từ hàng triệu mặt bằng tiêu chuẩn để tối ưu hóa khoảng cách di chuyển giữa các phòng (ví dụ: từ Bếp ra bàn ăn phải ngắn nhất).
* **RAG:** Kết nối trực tiếp cơ sở dữ liệu của ứng dụng với catalog điện tử của các hãng vật liệu lớn tại Việt Nam (An Cường, Viglacera, Hòa Phát...) giúp cập nhật giá và mẫu mã theo thời gian thực.

---

## 4. Module 4: Tự Động Bóc Khối Lượng & Giám Sát Tiến Độ (BoQ & Site Manager)
Thu hẹp khoảng cách giữa bản vẽ lý thuyết và thực tế thi công ngoài công trường.

### 4.1. Luồng Vận Hành (Workflow)
1. **Tự động xuất BoQ:** Ngay khi bản vẽ thiết kế được duyệt, AI bóc tách khối lượng vật tư chi tiết đến từng m2 sơn, m3 bê tông, số lượng công tắc điện, xuất thẳng ra file Excel kèm mã định danh chi phí.
2. **Lập tiến độ thông minh:** Dựa trên khối lượng vật tư và quy mô công trình, AI tự động lập biểu đồ tiến độ thi công (Gantt Chart) dự kiến.
3. **Giám sát thực tế (Computer Vision):** KTS hoặc kỹ sư công trường dùng ứng dụng di động chụp ảnh hoặc quay video các khu vực đang thi công định kỳ.
4. **Phát hiện sai lệch:** AI phân tích hình ảnh, so sánh với mô hình thiết kế và tiến độ mục tiêu để đưa ra báo cáo cảnh báo.

### 4.2. Khả năng phát hiện sai lệch của AI trên công trường
* **Sai lệch hình học:** Phát hiện tường xây lệch cốt, đặt sai vị trí hộp kỹ thuật (sai số > 2cm).
* **Sai lệch tiến độ:** Đánh giá tiến độ hoàn thiện (Ví dụ: *"Hiện tại đã trễ 5 ngày so với kế hoạch trát tường tầng 2"*).
* **Cảnh báo an toàn/rủi ro:** Nhận diện khu vực thiếu lưới an toàn, công nhân không đội mũ bảo hộ, vật liệu để sai nơi quy định gây ẩm mốc.

---