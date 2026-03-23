const ALL_QUESTIONS = [
  // ── Đại hội VI & Đường lối Đổi mới ──────────────────────────────────────
  { q: "Trước Đại hội VI, lạm phát của Việt Nam năm 1986 ở mức nào?", opts: ["Khoảng 200%", "Khoảng 400%", "Khoảng 774%", "Khoảng 1000%"], ans: 2 },
  { q: "Tinh thần cốt lõi của Đại hội VI (1986) là gì?", opts: ["Tiến nhanh, tiến mạnh lên CNXH", "Nhìn thẳng vào sự thật", "Ưu tiên công nghiệp nặng", "Đóng cửa bảo vệ nền kinh tế"], ans: 1 },
  { q: "Đại hội VI rút ra bao nhiêu bài học kinh nghiệm lớn?", opts: ["Hai bài học", "Ba bài học", "Bốn bài học", "Năm bài học"], ans: 2 },
  { q: "Bài học đầu tiên Đại hội VI rút ra là gì?", opts: ["Tôn trọng quy luật khách quan", "Lấy dân làm gốc", "Xây dựng Đảng ngang tầm nhiệm vụ", "Kết hợp sức mạnh dân tộc và thời đại"], ans: 1 },
  { q: "Ba chương trình kinh tế lớn Đại hội VI đề ra gồm những gì?", opts: ["Công nghiệp – Nông nghiệp – Dịch vụ", "Lương thực-thực phẩm – Hàng tiêu dùng – Hàng xuất khẩu", "Điện – Đường – Trường – Trạm", "Dầu khí – Lúa gạo – Dệt may"], ans: 1 },
  { q: "Cơ chế kinh tế bị xóa bỏ sau Đổi mới 1986 là gì?", opts: ["Kinh tế thị trường tự do", "Kinh tế tư nhân chủ đạo", "Tập trung quan liêu bao cấp", "Kinh tế hỗn hợp"], ans: 2 },
  { q: "Luật Đầu tư nước ngoài đầu tiên của Việt Nam được ban hành năm nào?", opts: ["1986", "1987", "1990", "1992"], ans: 1 },
 
  // ── Khoán 10 & Đột phá 1987-1990 ─────────────────────────────────────────
  { q: "Nghị quyết 10 (Khoán 10) được ban hành tháng mấy năm nào?", opts: ["Tháng 1/1987", "Tháng 4/1988", "Tháng 6/1989", "Tháng 12/1990"], ans: 1 },
  { q: "Khoán 10 công nhận điều gì trong nông nghiệp?", opts: ["Hợp tác xã là đơn vị kinh tế chủ đạo", "Nhà nước trực tiếp quản lý ruộng đất", "Hộ nông dân là đơn vị kinh tế tự chủ", "Tập đoàn nông nghiệp nhà nước"], ans: 2 },
  { q: "Nhờ Khoán 10 và Đổi mới, Việt Nam từ nước thiếu đói trở thành nước xuất khẩu gạo lớn thứ mấy thế giới?", opts: ["Thứ nhất", "Thứ hai", "Thứ ba", "Thứ tư"], ans: 1 },
  { q: "Chương trình 'Bốn giảm' nhằm mục tiêu gì?", opts: ["Giảm dân số, giảm nghèo, giảm thất nghiệp, giảm tội phạm", "Giảm bội chi, giảm tốc độ tăng giá, giảm lạm phát, giảm khó khăn đời sống", "Giảm thuế, giảm phí, giảm thủ tục, giảm biên chế", "Giảm nhập khẩu, giảm nợ, giảm thâm hụt, giảm lãi suất"], ans: 1 },
  { q: "Lạm phát Việt Nam được kiềm chế xuống còn bao nhiêu % vào năm 1995?", opts: ["5,7%", "8,4%", "12,7%", "20,1%"], ans: 2 },
 
  // ── Đại hội VII & Cương lĩnh 1991 ────────────────────────────────────────
  { q: "Đại hội VII (1991) thông qua văn kiện nào quan trọng nhất?", opts: ["Hiến pháp 1992", "Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên CNXH", "Luật Doanh nghiệp đầu tiên", "Chiến lược phát triển 2001-2010"], ans: 1 },
  { q: "Cương lĩnh 1991 xác định bao nhiêu đặc trưng cơ bản của mô hình XHCN Việt Nam?", opts: ["4 đặc trưng", "6 đặc trưng", "8 đặc trưng", "10 đặc trưng"], ans: 1 },
  { q: "Bốn nguy cơ lớn được chỉ ra tại Hội nghị đại biểu toàn quốc giữa nhiệm kỳ (1994) là gì?", opts: ["Chiến tranh, thiên tai, dịch bệnh, đói nghèo", "Tụt hậu kinh tế, chệch hướng XHCN, tham nhũng-quan liêu, 'diễn biến hòa bình'", "Lạm phát, thất nghiệp, bất bình đẳng, ô nhiễm", "Nợ công, thâm hụt, mất giá tiền tệ, cô lập quốc tế"], ans: 1 },
  { q: "Việt Nam bình thường hóa quan hệ với Trung Quốc năm nào?", opts: ["1989", "1991", "1993", "1995"], ans: 1 },
  { q: "Việt Nam gia nhập ASEAN vào năm nào?", opts: ["1991", "1993", "1995", "1997"], ans: 2 },
  { q: "GDP bình quân Việt Nam tăng khoảng bao nhiêu %/năm trong giai đoạn 1991-1995?", opts: ["5,5%/năm", "6,8%/năm", "8,2%/năm", "10,1%/năm"], ans: 2 },
 
  // ── Đại hội VIII (1996) ───────────────────────────────────────────────────
  { q: "Đại hội VIII (1996) xác định Việt Nam bước vào thời kỳ mới là gì?", opts: ["Thời kỳ quá độ lên CNXH", "Thời kỳ đẩy mạnh công nghiệp hóa, hiện đại hóa", "Thời kỳ hội nhập kinh tế quốc tế", "Thời kỳ phát triển kinh tế tri thức"], ans: 1 },
  { q: "Đại hội VIII đề ra mục tiêu đến năm 2020 đưa Việt Nam cơ bản trở thành nước như thế nào?", opts: ["Nước giàu có nhất Đông Nam Á", "Nước công nghiệp theo hướng hiện đại", "Nước có nền kinh tế thị trường hoàn chỉnh", "Nước phát triển thu nhập cao"], ans: 1 },
  { q: "Đại hội VIII tổng kết 10 năm đổi mới và rút ra bao nhiêu bài học kinh nghiệm lớn?", opts: ["Bốn bài học", "Năm bài học", "Sáu bài học", "Tám bài học"], ans: 2 },
  { q: "Nghị quyết Trung ương 5 (khóa VIII, 1998) về xây dựng nền văn hóa Việt Nam xác định văn hóa là gì?", opts: ["Mục tiêu của phát triển", "Nền tảng tinh thần của xã hội", "Động lực của tăng trưởng kinh tế", "Sức mạnh mềm quốc gia"], ans: 1 },
  { q: "Khủng hoảng tài chính châu Á (1997) tác động thế nào đến Việt Nam?", opts: ["Không ảnh hưởng vì chưa hội nhập", "Tăng trưởng chậm lại nhưng không khủng hoảng nghiêm trọng, vẫn đạt ~6,9%/năm", "Gây siêu lạm phát như 1988", "Buộc Việt Nam vay IMF khẩn cấp"], ans: 1 },
 
  // ── Đại hội IX (2001) ─────────────────────────────────────────────────────
  { q: "Tại Đại hội IX (2001), Đảng xác định mô hình kinh tế tổng quát là gì?", opts: ["Kinh tế kế hoạch hóa có yếu tố thị trường", "Kinh tế thị trường tự do", "Kinh tế thị trường định hướng xã hội chủ nghĩa", "Kinh tế hỗn hợp theo mô hình Bắc Âu"], ans: 2 },
  { q: "Trước Đại hội IX (Đại hội VII năm 1991), Đảng đưa ra quan điểm đối ngoại nào?", opts: ["Việt Nam sẵn sàng là bạn với tất cả các nước", "Việt Nam muốn là bạn với tất cả các nước", "Việt Nam là đối tác tin cậy của cộng đồng quốc tế", "Việt Nam chủ động hội nhập quốc tế toàn diện"], ans: 1 },
  { q: "Đại hội IX (2001) điều chỉnh phương châm đối ngoại thành gì?", opts: ["Việt Nam muốn là bạn với tất cả các nước", "Việt Nam sẵn sàng là bạn, là đối tác tin cậy của các nước trong cộng đồng quốc tế", "Việt Nam hội nhập có chọn lọc", "Việt Nam ưu tiên quan hệ với các nước lớn"], ans: 1 },
  { q: "Sự thay đổi từ 'muốn là bạn' sang 'sẵn sàng là bạn' thể hiện điều gì?", opts: ["Việt Nam từ bỏ chính sách độc lập tự chủ", "Việt Nam chuyển từ bị động sang chủ động, tự tin, có năng lực hợp tác", "Việt Nam chỉ kết bạn với nước XHCN", "Việt Nam phụ thuộc vào nước lớn hơn"], ans: 1 },
  { q: "Chiến lược phát triển KT-XH 2001-2010 đặt mục tiêu GDP năm 2010 tăng bao nhiêu so với năm 2000?", opts: ["Tăng gấp rưỡi", "Tăng ít nhất gấp đôi", "Tăng gấp ba", "Tăng 70%"], ans: 1 },
  { q: "Việt Nam gia nhập WTO vào năm nào, trở thành thành viên thứ bao nhiêu?", opts: ["2005, thứ 140", "2006, thứ 145", "2007, thứ 150", "2008, thứ 155"], ans: 2 },
  { q: "Ý nghĩa thứ nhất của việc chuyển từ 'muốn là bạn' sang 'sẵn sàng là bạn' là gì?", opts: ["Tăng cường quan hệ với Liên Xô", "Phá vỡ rào cản ý thức hệ, sẵn sàng hợp tác cả với Mỹ, EU, Nhật Bản", "Chỉ hợp tác trong khối ASEAN", "Ưu tiên quan hệ kinh tế hơn chính trị"], ans: 1 },
 
  // ── Đại hội X, XI, XII ────────────────────────────────────────────────────
  { q: "Đại hội X (2006) có quyết định đột phá nào về kinh tế tư nhân?", opts: ["Hạn chế kinh tế tư nhân để bảo vệ doanh nghiệp nhà nước", "Cho phép đảng viên làm kinh tế tư nhân, kể cả làm chủ doanh nghiệp tư nhân", "Quốc hữu hóa các doanh nghiệp tư nhân lớn", "Chỉ cho phép kinh tế tư nhân quy mô nhỏ"], ans: 1 },
  { q: "Đại hội X xác định đặc trưng bao quát nhất của xã hội XHCN mà Việt Nam xây dựng là gì?", opts: ["Nhà nước pháp quyền XHCN", "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh", "Kinh tế thị trường định hướng XHCN", "Đảng lãnh đạo, Nhà nước quản lý, Nhân dân làm chủ"], ans: 1 },
  { q: "Ba đột phá chiến lược Đại hội XI (2011) xác định là thể chế, nguồn nhân lực chất lượng cao, và gì nữa?", opts: ["Khoa học công nghệ", "Kết cấu hạ tầng đồng bộ, hiện đại", "Cải cách hành chính", "Phát triển đô thị"], ans: 1 },
  { q: "Đại hội XI chuyển phương châm đối ngoại từ 'hội nhập kinh tế quốc tế' sang gì?", opts: ["Hội nhập có chọn lọc", "Hội nhập toàn diện và sâu rộng", "Chủ động và tích cực hội nhập quốc tế", "Hội nhập theo điều kiện Việt Nam"], ans: 2 },
  { q: "Đại hội XII (2016) tổng kết bao nhiêu năm đổi mới?", opts: ["20 năm", "25 năm", "30 năm", "35 năm"], ans: 2 },
  { q: "Câu nói nào thể hiện đánh giá của Đại hội XII về vị thế Việt Nam sau 30 năm đổi mới?", opts: ["Việt Nam đã hoàn thành công nghiệp hóa", "Việt Nam chưa bao giờ có được cơ đồ, tiềm lực, vị thế và uy tín quốc tế như ngày nay", "Việt Nam đã trở thành nước phát triển", "Việt Nam vươn lên dẫn đầu ASEAN"], ans: 1 },
  { q: "Thách thức nào được Đại hội XII nhấn mạnh là nguy cơ trực tiếp với vai trò lãnh đạo của Đảng?", opts: ["Tụt hậu kinh tế", "Suy thoái về tư tưởng chính trị, đạo đức, lối sống trong một bộ phận cán bộ, đảng viên", "Chiến tranh thương mại quốc tế", "Biến đổi khí hậu"], ans: 1 },
  { q: "Sau hơn 30 năm đổi mới, Việt Nam đã đạt được thành tựu nào về vị thế kinh tế?", opts: ["Trở thành nước phát triển thu nhập cao", "Thoát khỏi tình trạng kém phát triển, trở thành nước đang phát triển có thu nhập trung bình", "Vươn lên top 10 kinh tế châu Á", "Đứng đầu ASEAN về GDP bình quân đầu người"], ans: 1 },
  { q: "Hạn chế nào của Việt Nam được nhắc đến sau 30 năm đổi mới?", opts: ["Dân số già hóa nhanh", "Tăng trưởng kinh tế chưa thực sự bền vững, chất lượng và hiệu quả chưa cao", "Xuất khẩu giảm sút", "Đầu tư nước ngoài giảm"], ans: 1 },
  { q: "Việt Nam bình thường hóa quan hệ ngoại giao với Hoa Kỳ vào năm nào?", opts: ["1993", "1994", "1995", "1996"], ans: 2 },
]
 
export function getRandomQuestions(count = 50) {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, ALL_QUESTIONS.length))
}
 