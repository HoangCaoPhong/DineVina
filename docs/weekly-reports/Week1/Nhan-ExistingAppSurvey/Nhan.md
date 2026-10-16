# Báo cáo Khảo sát và Phân tích Ứng dụng Hiện có: PasGo vs. KiotViet F&B

**Dự án:** DineVina  
**Hạng mục:** Báo cáo khảo sát ứng dụng tuần 1 (Existing App Survey - Week 1)  
**Người thực hiện:** Lương Thiện Nhân  
**Đối tượng khảo sát:** [PasGo](https://pasgo.vn/) và [KiotViet F&B](https://www.kiotviet.vn/bar-cafe-nha-hang)

---

## 1. Tổng quan và Phân loại Mô hình Phần mềm

### 1.1. Bối cảnh và Chuỗi giá trị mục tiêu
Dù cùng phục vụ ngành dịch vụ ăn uống (F&B) tại thị trường Việt Nam, [PasGo](https://pasgo.vn/tin-tuc/gioi-thieu-pasgo-101) và [KiotViet F&B](https://www.kiotviet.vn/bar-cafe-nha-hang) giải quyết hai bài toán khác biệt trong chuỗi giá trị vận hành nhà hàng:
- **PasGo** tập trung vào phân hệ tạo nhu cầu và thu hút khách hàng (Demand Generation / Front-end), kết nối thực khách từ bên ngoài vào bàn ăn.
- **KiotViet F&B** là hệ thống quản trị và xử lý vận hành nội bộ (Operations / Back-end), bao quát từ quy trình gọi món, điều phối chế biến đến quản lý tồn kho và đối soát doanh thu, kế toán.

### 1.2. Phân loại mô hình kiến trúc: E-Commerce Marketplace (O2O) vs. Cloud SaaS POS
Xét về cấu trúc sản phẩm và phương thức cung ứng dịch vụ, hai nền tảng đại diện cho hai mô hình giải pháp phần mềm riêng biệt nhưng có sự giao thoa:

- **PasGo – Sàn giao dịch Thương mại Điện tử O2O (Online-to-Offline Marketplace) kết hợp B2B SaaS:**
  - **Phân hệ B2C (Thương mại điện tử dịch vụ / O2O):** Hoạt động như sàn giao dịch trung gian kết nối [thực khách với hơn 2.000 nhà hàng đối tác](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786). Nền tảng cung cấp công cụ tìm kiếm địa điểm, áp dụng ưu đãi trực tiếp và đặt chỗ trước mà không yêu cầu khách hàng mua voucher trả trước ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)).
  - **Phân hệ B2B (SaaS quản lý đặt chỗ & Performance Marketing):** Cung cấp hệ thống quản trị nhà hàng [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo) thông qua [3 gói dịch vụ (Cơ Bản, Cốt Lõi, Cao Cấp)](https://pasgo.vn/blog/gioi-thieu-cac-goi-dich-vu-cua-nen-tang-dat-ban-nha-hang-pasgo-va-lua-chon-5711). Nguồn thu kết hợp giữa phí duy trì định kỳ và hoa hồng dựa trên kết quả tiếp thị thực tế (Performance Marketing từ 3%–7% doanh thu hoặc 10.000đ–35.000đ/lượt khách thực đến).
- **KiotViet – Hệ thống Cloud SaaS POS & Quản trị vận hành đa kênh (Omnichannel Operations):**
  - **Phân hệ B2B SaaS cốt lõi:** Phần mềm quản lý bán hàng vận hành trên nền tảng điện toán đám mây (Cloud POS/ERP tinh gọn) với hình thức thu phí thuê bao định kỳ theo chi nhánh ([270.000đ – 490.000đ/tháng](https://www.kiotviet.vn/phi-dich-vu)). Hệ thống chịu trách nhiệm toàn bộ quy trình vận hành nội bộ: tiếp nhận order, điều phối bếp/bar, trừ tồn kho nguyên vật liệu theo định lượng và hỗ trợ kế toán thuế ([Tổng quan F&B KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-chuyen-nganh/tong-quan-mo-hinh-fnb/)).
  - **Phân hệ mở rộng đa kênh (Web Builder & Omnichannel):** Cung cấp giải pháp [KiotViet Web](https://web.kiotviet.vn/) cho phép từng cơ sở tự xây dựng website gọi món/thực đơn điện tử QR riêng biệt, đồng thời đồng bộ đơn hàng tập trung từ các nền tảng giao thức ăn trực tuyến ([GrabFood, ShopeeFood](https://diendandoanhnghiep.vn/kiotviet-fnb-ra-mat-tinh-nang-quan-ly-ban-hang-da-kenh-10156150.html)).

---

## 2. So sánh Chi tiết các Nhóm Tính năng (Feature-by-Feature Comparison)

| Nhóm tính năng | PasGo (Web/App PasGo & MB PasGo) | KiotViet F&B (POS, Quản lý, Nhân viên, Bếp) |
| :--- | :--- | :--- |
| **Tìm kiếm & Thu hút khách (Acquisition)** | Cung cấp danh bạ hơn 2.000 nhà hàng, bộ lọc theo vị trí, khoảng giá, loại hình ẩm thực, tiện ích (phòng riêng, karaoke, chỗ đỗ xe), kèm [bản đồ chỉ đường theo thời gian thực](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786). | Không có sàn tìm kiếm tập trung; cung cấp công cụ cho chủ quán tự khởi tạo [website gọi món riêng](https://www.kiotviet.vn/tao-website-ban-hang-ngay-tren-phan-mem-quan-ly-kiotviet-nganh-fnb/) và liên kết qua Zalo OA/Facebook ([Phí dịch vụ KiotViet](https://www.kiotviet.vn/phi-dich-vu)). |
| **Đặt bàn & Sơ đồ phòng bàn (Booking & Table)** | Nhận đơn đặt bàn trực tuyến 24/7 từ thực khách (chọn khung giờ, số lượng khách, ghi chú yêu cầu tiệc) và hỗ trợ xử lý xác nhận hoặc từ chối đặt chỗ qua [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo). | Quản lý sơ đồ phòng bàn trực quan theo thời gian thực (trạng thái trống/đang phục vụ), hỗ trợ đặt bàn trước, gộp bàn, tách bàn và chuyển bàn linh hoạt ([KiotViet Bar-Cafe-Nhà hàng](https://www.kiotviet.vn/bar-cafe-nha-hang)). |
| **Gọi món & Xử lý Order (Ordering)** | Cho phép thực khách chọn trước gói combo/set menu ưu đãi khi đặt chỗ; không can thiệp vào quy trình gọi món chi tiết tại bàn ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)). | Hỗ trợ gọi món tại quầy, order tại bàn qua điện thoại/tablet, quét mã QR tự gọi món, ghi chú tùy chọn món (gia vị, thành phần) và quản lý mô hình buffet nhiều lượt ([Mô hình F&B KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-chuyen-nganh/tong-quan-mo-hinh-fnb/)). |
| **Điều phối Bếp / Bar (KDS & In chế biến)** | Không hỗ trợ nghiệp vụ điều phối khu vực chế biến bếp/bar nội bộ ([PasGo Dành cho nhà hàng](https://pasgo.vn/danh-cho-nha-hang)). | Tự động chuyển lệnh order xuống [màn hình hiển thị bếp (KDS) hoặc máy in bếp/bar](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-che-bien/thong-bao-che-bien/) phân chia theo từng trạm chế biến, gom món tự động và in tem nhãn dán ly cốc ([KiotViet Bar-Cafe-Nhà hàng](https://www.kiotviet.vn/bar-cafe-nha-hang)). |
| **Quản lý Kho & Định lượng nguyên liệu** | Không hỗ trợ quản lý kho hàng và nguyên vật liệu ([PasGo Dành cho nhà hàng](https://pasgo.vn/danh-cho-nha-hang)). | Tự động khấu trừ kho nguyên vật liệu theo công thức định lượng chi tiết ngay khi xuất bán món, cảnh báo ngưỡng tồn kho an toàn, kiểm kê kho và quản lý nhập/hủy nguyên liệu với nhà cung cấp ([Mô hình F&B KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-chuyen-nganh/tong-quan-mo-hinh-fnb/)). |
| **Giao đồ ăn (Delivery)** | Không hỗ trợ dịch vụ giao thức ăn; tập trung chuyên biệt vào mô hình **dùng bữa tại chỗ (Dine-in)** và đặt bàn trước ([Hợp tác PasGo](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786)). | Đồng bộ trực tiếp đơn hàng và thực đơn từ các đối tác giao hàng ([ShopeeFood, GrabFood](https://diendandoanhnghiep.vn/kiotviet-fnb-ra-mat-tinh-nang-quan-ly-ban-hang-da-kenh-10156150.html)) về chung màn hình POS của thu ngân. |
| **Thanh toán, Kế toán & Hóa đơn điện tử** | Không thực hiện thu hộ chi phí bữa ăn; áp dụng quy trình **đối soát lượt khách thực đến trong 48 giờ** và tự động khóa bảng kê đối soát phí dịch vụ định kỳ trên [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo). | Tính tiền theo món hoặc theo thời lượng sử dụng (Bida/Karaoke), hỗ trợ tạo mã VietQR động, kết ca bàn giao, tích hợp sẵn giải pháp [Hóa đơn điện tử khởi tạo từ máy tính tiền, Chữ ký số và Kế toán hộ kinh doanh](https://www.kiotviet.vn/phi-dich-vu). |
| **Marketing, CRM & Chăm sóc khách hàng** | Cung cấp dịch vụ truyền thông chuẩn SEO, gắn nhãn Top Bộ sưu tập theo chủ đề, vị trí Banner nổi bật và thiết lập chương trình ưu đãi theo khung giờ thấp điểm ([Hợp tác PasGo](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786)). | Quản lý tích điểm, phân hạng hội viên, phát hành voucher/mã giảm giá và gửi tin nhắn chăm sóc tự động qua kênh [Zalo ZNS/SMS](https://www.kiotviet.vn/phi-dich-vu). |
| **Quản lý Nhân sự (HRM)** | Chỉ lưu trữ thông tin nhân sự đầu mối để phối hợp tiếp nhận và xác thực đơn đặt chỗ ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)). | Tích hợp chấm công bằng vân tay/mã QR, xếp lịch ca làm việc, tự động tính lương, quản lý thưởng phạt chuyên cần và trích thưởng hoa hồng theo doanh số bán hàng ([Phí dịch vụ KiotViet](https://www.kiotviet.vn/phi-dich-vu)). |

---

## 3. Các Tính năng Tạo Lợi thế Cạnh tranh Cốt lõi (Core Differentiating Features)

### 3.1. Điểm nổi bật của PasGo
- **Đặt bàn giữ chỗ kèm ưu đãi trực tiếp (Không áp dụng hình thức voucher trả trước):** Loại bỏ rào cản thanh toán trước của mô hình deal/voucher truyền thống. Thực khách được đảm bảo giữ chỗ miễn phí và thanh toán trực tiếp tại nhà hàng với mức giảm trừ ưu đãi áp dụng ngay trên hóa đơn (từ 10% đến 50%) ([Hợp tác PasGo](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786)).
- **Mô hình tiếp thị theo kết quả (Performance-based Marketing) & SLA đối soát 48 giờ:** Nhà hàng giảm thiểu rủi ro từ chi phí quảng cáo cố định, chỉ chi trả phí dịch vụ (3%–7% doanh thu, thấp hơn đáng kể so với mức chiết khấu 20%–30% của các ứng dụng giao thức ăn) dựa trên số khách thực tế đến sử dụng dịch vụ; số liệu được kiểm soát minh bạch qua cơ chế đối soát 48 giờ và chốt bảng kê tự động trên [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo).
- **Hệ thống SEO chuyên sâu và Bộ sưu tập ẩm thực theo chủ đề:** Tận dụng thứ hạng cao trên các công cụ tìm kiếm nhằm phân phối lưu lượng truy cập trực tiếp đến các nhà hàng đối tác dựa trên nhu cầu tìm kiếm cụ thể (đặt tiệc liên hoan, hội họp công ty, không gian gia đình) ([Gói dịch vụ PasGo](https://pasgo.vn/blog/gioi-thieu-cac-goi-dich-vu-cua-nen-tang-dat-ban-nha-hang-pasgo-va-lua-chon-5711)).

### 3.2. Điểm nổi bật của KiotViet F&B
- **Cơ chế vận hành ngoại tuyến (Offline Mode) và in bếp qua mạng LAN (KiotViet Proxy):** Đảm bảo tính liên tục của chu trình phục vụ ngay cả khi mất kết nối Internet. Nhân viên phục vụ tiếp tục ghi nhận order tại bàn và truyền lệnh in trực tiếp đến bếp/bar thông qua mạng nội bộ nhờ ứng dụng [KiotViet Proxy](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-lam-quen-voi-kiotviet/huong-dan-chon-ung-dung-cho-kiotviet-fnb/), dữ liệu sau đó sẽ tự động đồng bộ lên đám mây khi kết nối mạng được tái lập ([KiotViet Bar-Cafe-Nhà hàng](https://www.kiotviet.vn/bar-cafe-nha-hang)).
- **Gói giải pháp pháp lý và tuân thủ thuế tích hợp:** Giải quyết bài toán tuân thủ quy định pháp luật và thuế cho cơ sở kinh doanh F&B bằng việc tích hợp sẵn giải pháp hóa đơn điện tử khởi tạo từ máy tính tiền, chứng thư số và phân hệ ghi chép sổ sách kế toán hộ kinh doanh trực tiếp trong hệ sinh thái phần mềm ([Phí dịch vụ KiotViet](https://www.kiotviet.vn/phi-dich-vu)).
- **Cơ chế tính giá dịch vụ linh hoạt theo khung giờ chuyển tiếp và quản lý định lượng chi tiết:** Tự động điều chỉnh biểu giá linh hoạt theo thời gian sử dụng dịch vụ (áp dụng cho các mô hình tính giờ như Billiards, Karaoke) và tự động trừ kho nguyên vật liệu theo công thức định lượng chi tiết cho từng đơn vị sản phẩm chế biến/pha chế ([Mô hình F&B KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-chuyen-nganh/tong-quan-mo-hinh-fnb/)).

---

## 4. Phân khúc Khách hàng Mục tiêu (Target Customers)

### 4.1. Phân khúc khách hàng của PasGo (Mô hình hai đầu B2B và B2C)
- **Khách hàng đối tác nhà hàng (B2B):** Hướng tới các **nhà hàng thuộc phân khúc trung và cao cấp** sở hữu không gian phục vụ tại chỗ quy mô vừa và lớn (Buffet, Lẩu & Nướng, Hải sản, Ẩm thực Á - Âu, nhà hàng khách sạn 4-5 sao, chuỗi ẩm thực lớn như Goldsun Food, Al Fresco's, Hoàng Yến) có nhu cầu tối ưu công suất bàn trống và thu hút các đoàn khách đặt tiệc ([Hợp tác PasGo](https://pasgo.vn/blog/pasgo-la-gi-cac-cach-thuc-hop-tac-voi-pasgo-5786)). Mô hình không hướng tới các quán ăn vỉa hè nhỏ lẻ hoặc quầy bán mang đi.
- **Khách hàng người dùng cuối (B2C):** Nhân viên văn phòng, người phụ trách tổ chức tiệc cơ quan, họp mặt gia đình hoặc tiếp khách đối tác có nhu cầu xác nhận giữ chỗ trước (yêu cầu phòng riêng, sức chứa lớn) và mong muốn tối ưu chi phí ([Giới thiệu PasGo](https://pasgo.vn/tin-tuc/gioi-thieu-pasgo-101)).

### 4.2. Phân khúc khách hàng của KiotViet F&B (Mô hình 100% B2B)
Hướng tới độ phủ diện rộng trên toàn bộ thị trường F&B, từ **hộ kinh doanh cá thể quy mô nhỏ đến các chuỗi nhà hàng quy mô vừa và lớn** (phục vụ hơn 50.000 cơ sở kinh doanh tại 34 tỉnh thành), được phân tách theo 3 nhóm mô hình nghiệp vụ ([Mô hình F&B KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-chuyen-nganh/tong-quan-mo-hinh-fnb/)):
- **Nhóm dịch vụ tiện lợi / phục vụ nhanh:** Quán ăn truyền thống (phở, bún, cơm văn phòng), quán Cafe, Trà sữa, mô hình bán mang đi (Take-away).
- **Nhóm dịch vụ tính phí theo thời gian:** Điểm kinh doanh Billiards (Bida), Karaoke, Bar/Pub/Club.
- **Nhóm dịch vụ phục vụ chuyên nghiệp:** Nhà hàng gọi món (A la carte), nhà hàng Buffet, Fine Dining, căng-tin và các trạm dừng nghỉ ẩm thực ([KiotViet Bar-Cafe-Nhà hàng](https://www.kiotviet.vn/bar-cafe-nha-hang)).

---

## 5. Phân chia Vai trò Người dùng và Cơ chế Phân quyền (User Roles & Access Control)

Cấu trúc vai trò người dùng phản ánh rõ nét sự khác biệt giữa mô hình Sàn giao dịch kết nối đa bên (Multi-sided Platform) của PasGo và Hệ thống quản trị vận hành nội bộ phân quyền theo vai trò (Role-Based Access Control - RBAC) của KiotViet:

### 5.1. Mô hình vai trò trong hệ sinh thái PasGo
- **Thực khách (Customer / Member):** Đăng nhập ứng dụng hoặc website PasGo để tìm kiếm địa điểm, lưu trữ mục yêu thích, gửi yêu cầu đặt chỗ, hủy đơn và thực hiện đánh giá chất lượng dịch vụ ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)).
- **Quản trị cơ sở / Bộ phận tiếp đón (Reception / Branch Manager trên MB PasGo):** Mỗi điểm kinh doanh được cấp tài khoản [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo) (giới hạn tối đa 3 thiết bị di động đồng thời trên ứng dụng di động, không giới hạn trên giao diện web) để tiếp nhận thông báo đặt chỗ, xử lý xác nhận hoặc từ chối yêu cầu, và cập nhật số lượng khách/giá trị hóa đơn thực tế trong vòng 48 giờ.
- **Quản lý chuỗi & Kế toán đối tác (Chain Manager / Partner Accountant trên MB PasGo):** Dành cho thương hiệu sở hữu nhiều chi nhánh nhằm theo dõi số liệu toàn chuỗi, rà soát dữ liệu đối soát và thực hiện phê duyệt nghiệm thu bảng kê phí dịch vụ định kỳ trước hạn cuối tháng ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)).
- **Quản trị nền tảng & Tổng đài viên (Platform Admin / Customer Support):** Đội ngũ vận hành của PasGo chịu trách nhiệm thẩm định tính hợp pháp của cơ sở nhà hàng, kiểm duyệt thông tin và đánh giá, điều phối đặt chỗ và hỗ trợ xử lý khiếu nại dịch vụ ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)).

### 5.2. Hệ thống phân quyền RBAC trong KiotViet F&B
- **Chủ gian hàng / Quản trị cấp cao (Super Admin):** Nắm toàn quyền thiết lập hệ thống, truy xuất hệ thống báo cáo kết quả kinh doanh (doanh thu, lợi nhuận gộp, giá vốn), cấu hình thuế, tích hợp hóa đơn điện tử và khai thác trợ lý phân tích dữ liệu AI ([Trợ lý KiCi](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-thiet-lap/tro-ly-kici/)).
- **Quản lý chi nhánh (Branch Manager):** Sử dụng ứng dụng [KiotViet Quản lý](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-lam-quen-voi-kiotviet/huong-dan-chon-ung-dung-cho-kiotviet-fnb/) để quản lý thực đơn, kiểm soát tồn kho, chấm công nhân sự và theo dõi báo cáo doanh thu trong phạm vi cơ sở được phân công ([Quản lý người dùng KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-thiet-lap/quan-ly-nguoi-dung/)).
- **Nhân viên Thu ngân (Cashier):** Sử dụng ứng dụng [KiotViet Thu ngân / Thiết bị POS](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-lam-quen-voi-kiotviet/huong-dan-chon-ung-dung-cho-kiotviet-fnb/) để sắp xếp bàn, tạo đơn tại quầy, tiếp nhận đơn từ các ứng dụng giao đồ ăn (GrabFood, ShopeeFood), in hóa đơn thanh toán, thu tiền và thực hiện bàn giao ca làm việc.
- **Nhân viên Phục vụ (Waitstaff / Order Taker):** Sử dụng ứng dụng [KiotViet Nhân viên](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-lam-quen-voi-kiotviet/huong-dan-chon-ung-dung-cho-kiotviet-fnb/) trên thiết bị di động để ghi nhận order tại bàn, hỗ trợ chuyển bàn/gộp bàn và chuyển lệnh chế biến xuống khu vực bếp/bar; không có quyền truy cập doanh thu tổng hoặc tự ý hủy hóa đơn đã tạo.
- **Bộ phận Bếp / Quầy pha chế (Kitchen / Bar Staff):** Tiếp nhận thông tin chế biến qua màn hình điều phối bếp (KDS) hoặc phiếu in từ [ứng dụng In Bar – Bếp](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/in-bar-bep-kvprinter/cai-dat-in-bar-bep/), cập nhật tiến độ chế biến và xác nhận hoàn tất món ([Thông báo chế biến KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/fnb-che-bien/thong-bao-che-bien/)).
- **Vai trò tùy biến bổ sung (Custom Roles):** Cho phép thiết lập các vai trò đặc thù (như Thủ kho, Kế toán cơ sở) với ma trận phân quyền chi tiết (ẩn giá vốn sản phẩm, giới hạn quyền theo nhóm hàng hóa, giới hạn khung giờ đăng nhập theo ca làm việc) ([Quản lý người dùng KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-thiet-lap/quan-ly-nguoi-dung/)).

---

## 6. Tính năng Trí tuệ Nhân tạo (AI): So sánh và Đánh giá Kỹ thuật

Mức độ ứng dụng công nghệ AI giữa hai nền tảng có sự phân hóa rõ rệt: **KiotViet đã triển khai nhiều tính năng AI tạo sinh (Generative AI) và AI phân tích chuyên sâu**, trong khi **PasGo chủ yếu khai thác các thuật toán gợi ý dựa trên quy tắc và hành vi (Rule-based & Recommendation Algorithms)**.

### 6.1. Phân hệ Trí tuệ Nhân tạo của KiotViet F&B
- **Trợ lý ảo AI KiCi (Conversational BI & Thị giác máy tính chẩn đoán lỗi):** Được tích hợp trên giao diện quản trị, cho phép chủ cơ sở truy vấn các chỉ số kinh doanh trọng yếu (doanh thu, biên lợi nhuận, nhóm mặt hàng đóng góp doanh thu cao, công nợ) bằng ngôn ngữ tự nhiên, tự động kết xuất biểu đồ trực quan, lập lịch gửi báo cáo và ứng dụng thị giác máy tính (**Computer Vision**) để nhận diện ảnh chụp màn hình nhằm hỗ trợ phát hiện lỗi thao tác trong ca làm việc ([Trợ lý KiCi](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/retail-thiet-lap/tro-ly-kici/)).
- **Phân tích kinh doanh dự đoán (Predictive Analytics):** Được cung cấp trong [Gói Cao Cấp (490.000đ/tháng)](https://www.kiotviet.vn/phi-dich-vu), sử dụng thuật toán phân cụm khách hàng (khách hàng trung thành, khách hàng tiềm năng, khách hàng có dấu hiệu rời bỏ), dự báo tỷ lệ rời bỏ (Churn Rate), ước tính mức doanh thu tiềm ẩn nguy cơ tổn thất, thiết lập biểu đồ nhiệt (Heatmap) khung giờ cao điểm và biểu đồ thác nước (Waterfall) bóc tách các yếu tố biến động doanh thu ([Phân tích KiotViet](https://www.kiotviet.vn/huong-dan-su-dung-kiotviet/salon-phan-tich/phan-tich/)).
- **Tạo đơn hàng bằng giọng nói qua AI (Voice-to-Order trên Knote):** Ứng dụng di động [Knote của KiotViet](https://tienphong.vn/len-don-bang-ai-pho-cap-cong-nghe-cho-ho-kinh-doanh-nho-va-sieu-nho-post1756764.tpo) tích hợp mô hình ngôn ngữ lớn được tinh chỉnh riêng cho ngữ cảnh tiếng Việt (có khả năng nhận dạng thuật ngữ khẩu ngữ, phương ngữ vùng miền và xử lý tạp âm môi trường quán F&B) nhằm tự động tạo đơn và tính tiền dựa trên câu lệnh thoại (ví dụ: *"Một cafe sữa đá 20.000 đồng"*).
- **Hỗ trợ sinh nội dung tự động trên KiotViet Web:** Tích hợp mô hình AI tạo sinh nhằm hỗ trợ tạo tự động bản mô tả sản phẩm và nội dung giới thiệu khi thiết lập website bán hàng ([KiotViet Web](https://web.kiotviet.vn/)).

### 6.2. Ứng dụng Thuật toán Thông minh của PasGo
- **Hiện trạng về Generative AI:** Chưa tích hợp các mô hình trợ lý ngôn ngữ lớn (LLM) hoặc chatbot AI hội thoại tự nhiên trên cả ứng dụng thực khách lẫn giao diện quản trị [MB PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo).
- **Hệ sinh thái gợi ý dựa trên định vị và hành vi người dùng (Recommendation & Location Intelligence):** Khai thác dữ liệu lịch sử đặt chỗ, tần suất xem địa điểm, sở thích ẩm thực và dữ liệu định vị địa lý theo thời gian thực để cá nhân hóa danh sách gợi ý nhà hàng ([Quy chế hoạt động PasGo](https://pasgo.vn/quy-che-hoat-dong-cua-nen-tang-pasgo)); đồng thời hỗ trợ phân tích hành vi khách hàng và tự động hóa quy trình đối soát số liệu tại [Gói Cốt Lõi và Gói Cao Cấp](https://pasgo.vn/blog/gioi-thieu-cac-goi-dich-vu-cua-nen-tang-dat-ban-nha-hang-pasgo-va-lua-chon-5711).

---

## 7. Tổng hợp Đánh giá và Định hướng Ứng dụng cho Dự án DineVina

### 7.1. Tính chất bổ trợ giữa hai mô hình
Phân tích chuỗi giá trị F&B cho thấy hai mô hình không loại trừ lẫn nhau mà đóng vai trò tương hỗ trong hệ sinh thái:
- **Hệ thống POS nội bộ (đại diện bởi KiotViet F&B):** Đóng vai trò là hệ thống vận hành cốt lõi (Core Operations System), chịu trách nhiệm duy trì tính chính xác trong xử lý order tại chỗ, giao tiếp giữa phục vụ và bếp, kiểm soát kho nguyên vật liệu và đáp ứng chuẩn mực pháp lý về hóa đơn thuế.
- **Nền tảng kết nối đặt bàn (đại diện bởi PasGo):** Đóng vai trò là kênh thu hút nhu cầu (Demand Generation Channel), vận hành như phễu tiếp thị từ bên ngoài nhằm tăng lượng thực khách mới, tiếp cận nhóm khách hàng đặt tiệc số lượng lớn và lấp đầy công suất bàn vào các khung giờ thấp điểm.

### 7.2. Định hướng và Bài học rút ra cho Dự án DineVina
Căn cứ vào phạm vi sản phẩm của DineVina (tập trung vào Discovery, Menus, Table Reservations, Event Booking và AI Assistance; không bao gồm quản lý toàn diện SME như kho hàng chuyên sâu hay kế toán thuế), việc khảo sát hai nền tảng mang lại các cơ sở thiết kế hệ thống quan trọng:
1. **Xác định ranh giới chức năng rõ ràng (Scope Boundaries):** DineVina cần tập trung tối ưu trải nghiệm khám phá nhà hàng, đặt bàn và hỗ trợ đặt tiệc/sự kiện (tương tự giá trị cốt lõi của PasGo), tránh sa đà vào các tính năng quản lý vận hành nội bộ phức tạp tại điểm bán (như điều phối bếp KDS chi tiết, trừ kho theo gram hay hóa đơn thuế kế toán) vốn thuộc về phạm vi của các phần mềm POS chuyên dụng.
2. **Thiết kế phân hệ phân quyền người dùng (Role-Based Access Control):** Kế thừa kinh nghiệm phân tách vai trò rõ ràng giữa Thực khách (Customer), Quản lý cơ sở (Restaurant Partner) và Quản trị nền tảng (Platform Admin) để đảm bảo luồng thông tin đặt chỗ và kiểm soát trạng thái bàn diễn ra thông suốt, an toàn.
3. **Ứng dụng AI có trọng tâm và giải quyết nhu cầu thực tế:** Thay vì phân tán nguồn lực, định hướng tích hợp AI của DineVina nên tập trung vào:
   - Hệ thống gợi ý nhà hàng cá nhân hóa (Personalized Recommendations) dựa trên ngữ cảnh và sở thích người dùng.
   - Trợ lý thông tin hỏi đáp (RAG Assistant) nhằm giải đáp thông tin món ăn, chính sách đặt bàn từ dữ liệu đã xác thực của nhà hàng.
   - Hỗ trợ trích xuất thực đơn tự động (Menu OCR) từ hình ảnh/tài liệu của đối tác nhà hàng nhằm tối ưu hóa quy trình đưa đối tác lên hệ thống (Onboarding).