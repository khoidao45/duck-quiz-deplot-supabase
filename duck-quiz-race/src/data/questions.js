export const ALL_QUESTIONS = [
  // Kiến thức chung
  { q: "Thủ đô của Việt Nam là gì?", opts: ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"], ans: 1 },
  { q: "Sông dài nhất thế giới?", opts: ["Amazon", "Nile", "Mekong", "Mississippi"], ans: 1 },
  { q: "Hành tinh gần Mặt Trời nhất?", opts: ["Kim Tinh", "Thổ Tinh", "Hỏa Tinh", "Thủy Tinh"], ans: 3 },
  { q: "Nước nào có dân số đông nhất thế giới?", opts: ["Mỹ", "Trung Quốc", "Ấn Độ", "Brazil"], ans: 2 },
  { q: "FIFA World Cup tổ chức mấy năm một lần?", opts: ["2", "3", "4", "5"], ans: 2 },
  { q: "Đại dương lớn nhất thế giới?", opts: ["Đại Tây Dương", "Thái Bình Dương", "Ấn Độ Dương", "Bắc Băng Dương"], ans: 1 },
  { q: "Vạn Lý Trường Thành ở nước nào?", opts: ["Nhật Bản", "Hàn Quốc", "Trung Quốc", "Mông Cổ"], ans: 2 },
  { q: "Kim tự tháp nổi tiếng nhất ở đâu?", opts: ["Mexico", "Peru", "Sudan", "Ai Cập"], ans: 3 },

  // Toán & Khoa học
  { q: "1 + 1 × 2 = ?", opts: ["4", "3", "2", "6"], ans: 1 },
  { q: "2³ = ?", opts: ["6", "8", "9", "12"], ans: 1 },
  { q: "Công thức hóa học của nước là gì?", opts: ["CO2", "H2O", "NaCl", "O2"], ans: 1 },
  { q: "Tốc độ ánh sáng xấp xỉ bao nhiêu km/s?", opts: ["100,000", "300,000", "500,000", "1,000,000"], ans: 1 },
  { q: "Nguyên tố hóa học có ký hiệu 'O' là gì?", opts: ["Vàng", "Bạc", "Oxy", "Osmium"], ans: 2 },
  { q: "Số Pi (π) xấp xỉ bằng?", opts: ["2.14", "3.14", "4.14", "5.14"], ans: 1 },
  { q: "Căn bậc 2 của 144 là?", opts: ["10", "11", "12", "14"], ans: 2 },

  // Động vật & Thiên nhiên
  { q: "Vịt đẻ ra cái gì?", opts: ["Vịt con", "Trứng", "Lông", "Bánh"], ans: 1 },
  { q: "Con gì kêu 'gâu gâu'?", opts: ["Mèo", "Vịt", "Chó", "Heo"], ans: 2 },
  { q: "Động vật nào chạy nhanh nhất trên cạn?", opts: ["Sư tử", "Báo gêpa", "Ngựa", "Đà điểu"], ans: 1 },
  { q: "Loài chim không biết bay nổi tiếng nhất?", opts: ["Cú mèo", "Chim cánh cụt", "Sẻ", "Vịt"], ans: 1 },
  { q: "Con gì sống lâu nhất?", opts: ["Voi", "Rùa", "Cá voi", "Đại bàng"], ans: 1 },
  { q: "Màu gì thu được khi pha đỏ và vàng?", opts: ["Tím", "Xanh", "Cam", "Nâu"], ans: 2 },

  // Công nghệ
  { q: "Ngôn ngữ lập trình nào có logo là con trăn?", opts: ["Java", "Ruby", "Python", "Snake"], ans: 2 },
  { q: "WWW là viết tắt của gì?", opts: ["World Wide Web", "World Wide Window", "Wide World Web", "Web World Wide"], ans: 0 },
  { q: "CPU là viết tắt của gì?", opts: ["Computer Processing Unit", "Central Processing Unit", "Core Processing Unit", "Central Power Unit"], ans: 1 },
  { q: "1 GB = bao nhiêu MB?", opts: ["100", "512", "1024", "2048"], ans: 2 },

  // Văn hóa & Lịch sử Việt Nam
  { q: "Quốc khánh Việt Nam là ngày nào?", opts: ["30/4", "2/9", "19/8", "1/1"], ans: 1 },
  { q: "Việt Nam có bao nhiêu tỉnh thành?", opts: ["58", "61", "63", "65"], ans: 2 },
  { q: "Tiền tệ của Việt Nam là gì?", opts: ["Đô la", "Đồng", "Yên", "Bath"], ans: 1 },
  { q: "Núi cao nhất Việt Nam?", opts: ["Ngọc Linh", "Phan Xi Păng", "Bạch Mã", "Langbiang"], ans: 1 },
]

export function getRandomQuestions(count = 8) {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
